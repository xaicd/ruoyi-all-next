/**
 * 统一插件视图：把**内置插件**（各业务域，Platform Module）与**已安装插件**（外部插件包）
 * 放在同一处列出，两者都带 `kind` 与同一套生命周期字段。
 *
 * 为什么要在这里合并、而不是在插件注册表服务里：
 *   内置来源是域注册表（`src/app/api/v1/admin/modules/_lib`，组合根），
 *   而插件注册表服务位于 `shared`（L0）。让 L0 反向 import 应用层会造成分层倒置
 *   （此前已因此修过一次：注册表放 shared 导致 domain:pack 被打包进全部域）。
 *   所以合并归属组合根 —— 与模块网关同一做法。
 *
 * 现状（P1）：这一步只统一**视图与生命周期字段**，不改任何业务代码。
 *   - builtin 由域契约（module.manifest.json）派生，**不落库** —— 给域也建安装记录会造成两处真源
 *   - installed 才有安装记录（plugin 表）
 *
 * 后续（P2/P3）：把某个域真正改造成插件包（merged 形态）时，它就会从 builtin 侧移到 installed 侧，
 *   而这张表的结构与调用方都不用变。
 */
import { listModules } from "@/app/api/v1/admin/modules/_lib/module-registry"
import { PluginRegistryService } from "@/modules/shared/backend/plugins/plugin-registry.service"

export type PluginKind = "builtin" | "installed"

export type PluginCatalogEntry = {
  pluginKey: string
  kind: PluginKind
  displayName: string
  version: string
  /** 生命周期状态。builtin 由平台随版本发布，恒为 ready；installed 走 installed/ready/error。 */
  status: string
  /** 运行形态。builtin 恒为同进程（它们是进程内的 Platform Module）。 */
  runtimeMode: "merged" | "isolated"
  capabilities: readonly string[]
  lastError: string | null
}

export async function listPluginCatalog(): Promise<PluginCatalogEntry[]> {
  const builtin: PluginCatalogEntry[] = listModules().map((manifest) => ({
    pluginKey: manifest.id,
    kind: "builtin",
    displayName: manifest.displayName,
    version: manifest.contractVersion ?? manifest.apiVersion?.toString() ?? "0",
    // 内置插件随宿主一起构建/发布，不存在"安装失败"这种状态
    status: "ready",
    runtimeMode: "merged",
    capabilities: manifest.capabilities ?? [],
    lastError: null,
  }))

  const installed: PluginCatalogEntry[] = (await PluginRegistryService.list()).map((record) => ({
    pluginKey: record.pluginKey,
    kind: "installed",
    displayName: record.packageName,
    version: record.version,
    status: record.status,
    runtimeMode: record.runtimeMode === "merged" ? "merged" : "isolated",
    capabilities: (record.manifestJson as { capabilities?: string[] } | null)?.capabilities ?? [],
    lastError: record.lastError,
  }))

  return [...builtin, ...installed].sort((a, b) => a.pluginKey.localeCompare(b.pluginKey))
}
