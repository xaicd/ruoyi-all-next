/**
 * 插件注册表持久化。
 *
 * 落位说明：本文件**刻意不放在 `backend/repositories/` 下**。那里是**业务域仓储**，
 * `business-repository-tenant-scope` 规则（AGENTS.md §4.8）针对的是它们；
 * 而插件安装是**实例级**的（installation is global to the instance，
 * 无 per-company install 表），`plugin` 表本就没有 tenant_id。放这里语义才准确。
 * 按租户配置在 `plugin_config`，其租户一律取自全局上下文（AGENTS.md §4.8）。
 */
import { ruoyiPrisma } from "@/modules/shared/backend/prisma"

import type { PluginManifest } from "./types"

export type PluginRecord = {
  pluginKey: string
  packageName: string
  packagePath: string | null
  version: string
  apiVersion: number
  categories: string[]
  manifest: PluginManifest
  status: string
  installOrder: number | null
  lastError: string | null
}

export const PluginRepository = {
  /** 实例级安装记录（不含已逻辑删除）。 */
  async listAll() {
    return ruoyiPrisma.plugin.findMany({
      where: { deleted: false },
      orderBy: [{ installOrder: "asc" }, { pluginKey: "asc" }],
    })
  },

  async findByKey(pluginKey: string) {
    return ruoyiPrisma.plugin.findFirst({ where: { pluginKey, deleted: false } })
  },

  /**
   * 安装或更新一条记录。
   * 只更新 manifest 派生字段与包路径；**不覆盖 status** —— 状态由生命周期推进，
   * 同步磁盘不该把 `error`/`upgrade_pending` 悄悄重置回 `installed`。
   */
  async upsertFromManifest(record: Omit<PluginRecord, "status" | "installOrder" | "lastError">) {
    const data = {
      packageName: record.packageName,
      packagePath: record.packagePath,
      version: record.version,
      apiVersion: record.apiVersion,
      categories: record.categories,
      manifestJson: record.manifest as unknown as object,
    }
    return ruoyiPrisma.plugin.upsert({
      where: { pluginKey: record.pluginKey },
      create: { pluginKey: record.pluginKey, status: "installed", ...data },
      update: data,
    })
  },

  /** 推进生命周期状态（installed | ready | error | upgrade_pending）。 */
  async setStatus(pluginKey: string, status: string, lastError: string | null = null) {
    return ruoyiPrisma.plugin.updateMany({ where: { pluginKey }, data: { status, lastError } })
  },

  /** 磁盘上已消失的插件：只对**未被禁用**的记录做逻辑删除。 */
  async markMissing(pluginKeys: string[]) {
    return ruoyiPrisma.plugin.updateMany({
      where: { pluginKey: { notIn: pluginKeys }, deleted: false },
      data: { deleted: true, status: "error", lastError: "插件包已从插件目录移除" },
    })
  },
}

export const pluginRepository = PluginRepository
