/**
 * 插件包发现与扫描。
 *
 * 部署模型（对齐 Paperclip §8.1 的实例插件目录，而不是 workspace 成员）：
 * 插件包放在一个**实例级目录**下，宿主扫描它；宿主源码树不含插件代码。
 * 选这个模型是因为本仓是 npm 单包（无 workspaces），改成 workspace 会牵动
 * lockfile / Docker / domain:pack 三条既有链路。
 *
 * 安全要点：`ruoyiPlugin.manifest` 指针**来自插件包自己**，因此解析后必须确认
 * 仍落在该插件包目录内 —— 否则一个恶意包可以用 `../../` 让宿主读取任意文件。
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"

import { parsePluginManifest } from "./manifest"
import type { PluginManifest, PluginPackagePointer } from "./types"

/** 插件包 package.json 中的入口指针键名（对应 Paperclip 的 `paperclipPlugin`）。 */
export const PLUGIN_POINTER_KEY = "ruoyiPlugin"

/** 插件目录：可用 RUOYI_PLUGIN_DIR 覆盖；默认落在仓库内的 .ruoyi/plugins（已 gitignore）。 */
export function resolvePluginDir(env: NodeJS.ProcessEnv = process.env): string {
  const configured = env.RUOYI_PLUGIN_DIR?.trim()
  if (configured) return path.resolve(configured)
  return path.join(process.cwd(), ".ruoyi", "plugins")
}

export type DiscoveredPlugin = {
  /** 插件包目录（绝对路径）。 */
  packageDir: string
  /** package.json 的 name。 */
  packageName: string
  /** package.json 声明的入口指针；缺失或形状不对时为 undefined。 */
  pointer?: PluginPackagePointer
  /** 校验通过的 manifest。 */
  manifest?: PluginManifest
  /** 该包被拒的原因（空数组表示通过）。 */
  errors: string[]
}

function readJson(file: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(readFileSync(file, "utf8")) }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

function readPointer(pkg: Record<string, unknown>): PluginPackagePointer | undefined {
  const raw = pkg[PLUGIN_POINTER_KEY]
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined
  const pointer = raw as Record<string, unknown>
  const manifest = typeof pointer.manifest === "string" ? pointer.manifest : ""
  const worker = typeof pointer.worker === "string" ? pointer.worker : ""
  const ui = typeof pointer.ui === "string" ? pointer.ui : undefined
  if (!manifest || !worker) return undefined
  return { manifest, worker, ...(ui ? { ui } : {}) }
}

/**
 * 把包内相对路径解析为绝对路径，并**确认未逃出插件包目录**。
 * 越界返回 undefined（调用方按拒绝处理）。
 */
function resolveInside(packageDir: string, relative: string): string | undefined {
  const resolved = path.resolve(packageDir, relative)
  const root = path.resolve(packageDir) + path.sep
  return resolved.startsWith(root) ? resolved : undefined
}

/** 扫描一个插件包目录；任何不合法都体现在 errors 里，不抛异常（一个坏包不该中断整轮扫描）。 */
export function scanPluginPackage(packageDir: string): DiscoveredPlugin | undefined {
  const pkgFile = path.join(packageDir, "package.json")
  if (!existsSync(pkgFile)) return undefined

  const pkgRead = readJson(pkgFile)
  if (!pkgRead.ok) {
    return { packageDir, packageName: path.basename(packageDir), errors: [`package.json 解析失败: ${pkgRead.error}`] }
  }
  const pkg = pkgRead.value as Record<string, unknown>
  const packageName = typeof pkg.name === "string" ? pkg.name : path.basename(packageDir)

  const pointer = readPointer(pkg)
  if (!pointer) {
    return {
      packageDir,
      packageName,
      errors: [`package.json 缺少合法的 ${PLUGIN_POINTER_KEY} 指针（需 manifest 与 worker）`],
    }
  }

  const manifestFile = resolveInside(packageDir, pointer.manifest)
  if (!manifestFile) {
    return { packageDir, packageName, pointer, errors: [`${PLUGIN_POINTER_KEY}.manifest 越出插件包目录: ${pointer.manifest}`] }
  }
  if (!existsSync(manifestFile)) {
    return { packageDir, packageName, pointer, errors: [`manifest 文件不存在: ${pointer.manifest}`] }
  }

  const manifestRead = readJson(manifestFile)
  if (!manifestRead.ok) {
    return { packageDir, packageName, pointer, errors: [`manifest 解析失败: ${manifestRead.error}`] }
  }

  const validation = parsePluginManifest(manifestRead.value)
  if (!validation.ok) return { packageDir, packageName, pointer, errors: validation.errors }

  const errors: string[] = []
  // 入口文件必须真实存在，否则安装成功但启动必失败
  for (const [key, relative] of Object.entries({ worker: pointer.worker, ui: pointer.ui })) {
    if (!relative) continue
    const resolved = resolveInside(packageDir, relative)
    if (!resolved) errors.push(`${PLUGIN_POINTER_KEY}.${key} 越出插件包目录: ${relative}`)
    else if (!existsSync(resolved)) errors.push(`${PLUGIN_POINTER_KEY}.${key} 指向的路径不存在: ${relative}`)
  }

  return {
    packageDir,
    packageName,
    pointer,
    // 语义统一：有 errors 即不可安装，不返回可用的 manifest。
    // （调用方只看 errors 是否为空来决定放行，不该出现"有错也有 manifest"的中间态。）
    ...(errors.length === 0 ? { manifest: validation.manifest } : {}),
    errors,
  }
}

/** 扫描插件目录下的全部插件包，并检查跨包 id 冲突。 */
export function scanPluginPackages(pluginDir: string = resolvePluginDir()): DiscoveredPlugin[] {
  if (!existsSync(pluginDir)) return []

  const candidates = readdirSync(pluginDir)
    .filter((entry) => !entry.startsWith(".") && entry !== "node_modules")
    .map((entry) => path.join(pluginDir, entry))
    .filter((full) => {
      try {
        return statSync(full).isDirectory()
      } catch {
        return false
      }
    })
    .sort()

  const discovered: DiscoveredPlugin[] = []
  const idOwners = new Map<string, string>()

  for (const dir of candidates) {
    const found = scanPluginPackage(dir)
    if (!found) continue
    if (found.manifest) {
      const previous = idOwners.get(found.manifest.id)
      if (previous) {
        found.errors.push(`插件 id "${found.manifest.id}" 与 ${previous} 冲突`)
        delete found.manifest
      } else {
        idOwners.set(found.manifest.id, found.packageName)
      }
    }
    discovered.push(found)
  }

  return discovered
}
