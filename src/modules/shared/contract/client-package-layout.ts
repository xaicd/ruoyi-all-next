import { existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { DOMAIN_CATALOG } from "../backend/constants/domain-catalog"
import {
  clientChannels,
  listStandaloneClientChannels,
  manifestForChannel,
  sourceRootForChannel,
  type ClientChannel,
} from "./client-channels"

const ALLOWED_MODULE_DIRS = new Set(DOMAIN_CATALOG.domains.map((domain) => domain.name))

export function requiredSourceDirPaths(channel: ClientChannel, repoRoot: string): string[] {
  const sourceRoot = join(repoRoot, channel.workspace, sourceRootForChannel(channel))
  return clientChannels.packageLayout.requiredSourceDirs.map((dir) => join(sourceRoot, dir))
}

export function collectClientPackageLayoutErrors(repoRoot: string): string[] {
  const errors: string[] = []
  for (const channel of listStandaloneClientChannels()) {
    const packageRoot = join(repoRoot, channel.workspace)
    const readme = join(packageRoot, "README.md")
    const manifest = join(packageRoot, manifestForChannel(channel))
    if (!existsSync(readme)) errors.push(`${channel.id}: 缺少 ${channel.workspace}/README.md`)
    if (!existsSync(manifest)) errors.push(`${channel.id}: 缺少 ${channel.workspace}/${manifestForChannel(channel)}`)
    for (const dir of requiredSourceDirPaths(channel, repoRoot)) {
      if (!existsSync(dir)) errors.push(`${channel.id}: 缺少目录 ${dir.slice(repoRoot.length + 1)}`)
    }
    const modulesDir = join(repoRoot, channel.workspace, sourceRootForChannel(channel), "modules")
    if (!existsSync(modulesDir)) continue
    for (const entry of readdirSync(modulesDir)) {
      if (entry.startsWith(".") || entry === "README.md") continue
      const fullPath = join(modulesDir, entry)
      if (!statSync(fullPath).isDirectory()) continue
      if (!ALLOWED_MODULE_DIRS.has(entry)) {
        errors.push(`${channel.id}: modules/${entry} 不是 domain-catalog 中的域名`)
        continue
      }
      for (const subdir of clientChannels.packageLayout.moduleSubdirs) {
        const subdirPath = join(fullPath, subdir)
        if (!existsSync(subdirPath) || !statSync(subdirPath).isDirectory()) {
          errors.push(`${channel.id}: modules/${entry} 缺少 ${subdir}/`)
        }
      }
    }
  }
  return errors
}
