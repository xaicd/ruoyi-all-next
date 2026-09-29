/**
 * 插件注册表服务：把磁盘上的插件包同步为实例级安装记录，并可启动 worker。
 *
 * 状态机：磁盘扫描通过 → `installed`；worker 起来且 initialize 成功 → `ready`；
 * 任一步失败 → `error`。启停 worker 的副作用只在 `reconcile()` 里发生，
 * 单纯的 `syncFromDisk()` 只碰数据库。
 */
import { existsSync } from "node:fs"
import path from "node:path"

import { resolvePluginDir, scanPluginPackages } from "./package-scanner"
import { PluginRepository } from "./plugin.repository"
import { pluginRuntimeManager } from "./runtime-manager"
import type { PluginManifest, PluginRuntimeMode } from "./types"

export type PluginSyncRejection = { packageName: string; errors: string[] }

export type PluginSyncResult = {
  /** 已落库的插件数。 */
  installed: number
  /** 被拒的插件包及原因（不落库 —— 校验不过的包不可安装）。 */
  rejected: PluginSyncRejection[]
  /** 因包已从磁盘消失而被逻辑删除的条数。 */
  removed: number
  /** 同步使用的插件目录。 */
  pluginDir: string
}

export type PluginReconcileResult = PluginSyncResult & {
  /** 成功启动 worker 的插件（状态已推进到 ready）。 */
  started: string[]
  /** 启动失败的插件及原因（状态已标 error）。 */
  failed: Array<{ pluginKey: string; error: string }>
  /** 当前存活的插件运行时（两种形态合并计）。 */
  running: string[]
  /** 各插件实际采用的形态。 */
  modes?: Record<string, PluginRuntimeMode>
}

export const PluginRegistryService = {
  /**
   * 同步磁盘插件目录 → 安装记录。
   *
   * 安全考虑：只有当插件目录**真实存在**时才执行"缺失即移除"。
   * 否则目录未挂载/路径写错会一次性把全部安装记录判为缺失并清空 —— 一次配置错误
   * 不该造成注册表被抹掉。
   */
  async syncFromDisk(pluginDir: string = resolvePluginDir()): Promise<PluginSyncResult> {
    const dirExists = existsSync(pluginDir)
    const discovered = dirExists ? scanPluginPackages(pluginDir) : []

    const accepted = discovered.filter((item) => item.manifest)
    const rejected: PluginSyncRejection[] = discovered
      .filter((item) => !item.manifest)
      .map((item) => ({ packageName: item.packageName, errors: item.errors }))

    for (const item of accepted) {
      const manifest = item.manifest!
      await PluginRepository.upsertFromManifest({
        pluginKey: manifest.id,
        packageName: item.packageName,
        packagePath: item.packageDir,
        version: manifest.version,
        apiVersion: manifest.apiVersion,
        categories: manifest.categories,
        manifest,
      })
    }

    const removed = dirExists
      ? (await PluginRepository.markMissing(accepted.map((item) => item.manifest!.id))).count
      : 0

    return { installed: accepted.length, rejected, removed, pluginDir }
  },

  async list() {
    return PluginRepository.listAll()
  },

  async get(pluginKey: string) {
    return PluginRepository.findByKey(pluginKey)
  },

  /**
   * 完整对账：同步注册表 + 启停 worker，把状态推进到 `ready`/`error`。
   *
   * 与 `syncFromDisk` 分开是因为后者只碰数据库、不出进程；启停进程的副作用
   * 应当是一个显式动作，而不是"读一下列表"的副作用。
   *
   * 失败隔离：单个 worker 启动失败只把它自己标 `error`，循环继续 ——
   * 不中断、不连带其它插件。
   */
  async reconcile(pluginDir: string = resolvePluginDir()): Promise<PluginReconcileResult> {
    const sync = await this.syncFromDisk(pluginDir)
    const records = await PluginRepository.listAll()
    const started: string[] = []
    const failed: Array<{ pluginKey: string; error: string }> = []
    /** 本轮各插件实际采用的运行形态（供返回与诊断）。 */
    const runningModes = new Map<string, PluginRuntimeMode>()

    for (const record of records) {
      const manifest = record.manifestJson as unknown as PluginManifest | null
      const declared = manifest?.entrypoints
      const wantsMerged = record.runtimeMode === "merged"

      // 形态选择规则（不静默降级，任何一种不匹配都给出可执行的错误）：
      //   1. 运营把该插件配成 merged，但 manifest 没声明 merged 入口 -> 报错（配置错，不猜）
      //   2. 插件只声明了 merged 入口 -> 只能按 merged 跑（没有 worker 可起）
      //   3. 其余 -> 按运营配置（默认 isolated）
      let mode: PluginRuntimeMode = wantsMerged ? "merged" : "isolated"
      let reason = ""
      if (wantsMerged && !declared?.merged) {
        reason = "已配置为 merged 运行形态，但 manifest 未声明 entrypoints.merged"
      } else if (!declared?.worker && declared?.merged) {
        mode = "merged"
      }
      const entryPath = mode === "merged" ? declared?.merged : declared?.worker
      if (!reason && (!entryPath || !record.packagePath)) {
        reason = mode === "merged" ? "manifest 缺少 entrypoints.merged 或包路径未知" : "manifest 缺少 entrypoints.worker 或包路径未知"
      }

      if (reason) {
        failed.push({ pluginKey: record.pluginKey, error: reason })
        await PluginRepository.setStatus(record.pluginKey, "error", reason)
        continue
      }

      const resolvedEntry = path.resolve(record.packagePath as string, entryPath as string)
      const inside = resolvedEntry.startsWith(path.resolve(record.packagePath as string) + path.sep)
      if (!inside) {
        // 与包扫描同一道防线：入口路径同样不许越出插件包目录
        const message = `entrypoints.${mode === "merged" ? "merged" : "worker"} 越出插件包目录`
        failed.push({ pluginKey: record.pluginKey, error: message })
        await PluginRepository.setStatus(record.pluginKey, "error", message)
        continue
      }

      try {
        await pluginRuntimeManager.start(record.pluginKey, mode, resolvedEntry, record.packagePath as string, {
          manifest,
          config: {},
          hostApiVersion: 1,
          instance: { pluginKey: record.pluginKey, packagePath: record.packagePath as string },
          mode,
        })
        await PluginRepository.setStatus(record.pluginKey, "ready", null)
        started.push(record.pluginKey)
        runningModes.set(record.pluginKey, mode)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        failed.push({ pluginKey: record.pluginKey, error: message })
        await PluginRepository.setStatus(record.pluginKey, "error", message)
      }
    }

    return { ...sync, started, failed, running: pluginRuntimeManager.list(), modes: Object.fromEntries(runningModes) }
  },
}

export const pluginRegistryService = PluginRegistryService
