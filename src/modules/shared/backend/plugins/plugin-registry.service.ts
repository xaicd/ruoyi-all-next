/**
 * 插件注册表服务：把磁盘上的插件包同步为实例级安装记录。
 *
 * 生命周期位置：本服务停在 §8.3 的"持久化安装记录"这一步，状态为 `installed`。
 * 到 `ready`/`error` 还需要 §12.1 的 worker 进程与健康检查 —— 那是下一增量的事，
 * 在 worker 运行时落地前**不谎报 ready**。
 */
import { existsSync } from "node:fs"

import { resolvePluginDir, scanPluginPackages } from "./package-scanner"
import { PluginRepository } from "./plugin.repository"

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
}

export const pluginRegistryService = PluginRegistryService
