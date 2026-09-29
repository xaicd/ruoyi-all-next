/**
 * 插件 UI 宿主（服务端部分）：把 manifest 里声明的 `ui.slots` 解析成**可加载的 bundle URL**，
 * 并把插件的预构建 UI bundle 静态投送出去。
 *
 * 设计遵循 Paperclip 的做法：**宿主不编译插件 UI**，插件自己产出预构建 bundle，
 * 宿主只做"投送 + 按 exportName 挂载"。这样插件包是自包含的，宿主也不必把第三方的
 * 前端依赖吃进自己的构建链。
 *
 * 分工：
 *   - 本文件（server）：解析 slot、校验能力、给出 bundle URL、按路径安全取文件
 *   - 客户端 PluginSlotHost：按 URL 动态 import bundle，取 exportName 渲染（带错误隔离）
 *
 * 能力门禁：声明了 ui.slots 的插件必须同时声明 `ui.page.register` —— 否则宿主不挂载它的 UI。
 * 这与 apiRoutes 必须声明 `api.routes.register` 是同一套规则。
 */
import { existsSync, statSync } from "node:fs"
import path from "node:path"

import type { PluginManifest, PluginUiSlotType } from "./types"

export const UI_SLOT_CAPABILITY = "ui.page.register"
export const PLUGIN_UI_PREFIX = "/api/v1/plugins"

export type ResolvedUiSlot = {
  pluginKey: string
  type: PluginUiSlotType
  id: string
  displayName: string
  exportName: string
  routePath?: string
  /** 该插件 UI bundle 的入口目录（相对插件包根）。 */
  bundleDir: string
  /** 宿主投送该 bundle 的 URL 前缀。 */
  bundleUrl: string
}

/** 插件 UI bundle 的投送 URL 前缀。 */
export function pluginUiBundleUrl(pluginKey: string, relative = ""): string {
  const suffix = relative.replace(/^\/+/, "")
  return `${PLUGIN_UI_PREFIX}/${pluginKey}/ui${suffix ? `/${suffix}` : ""}`
}

/**
 * 把 bundle 内的相对路径解析为绝对路径，并**确认未逃出 bundle 目录**。
 * 与 package-scanner 同一道防线：URL 里的 `../` 不能读走插件包外的文件。
 */
export function resolveBundleFile(packagePath: string, bundleDir: string, relative: string): string | null {
  const root = path.resolve(packagePath, bundleDir)
  const target = path.resolve(root, relative.replace(/^\/+/, ""))
  if (target !== root && !target.startsWith(root + path.sep)) return null
  if (!existsSync(target) || !statSync(target).isFile()) return null
  return target
}

/** 从一批插件记录解析出全部可挂载的 UI slot。 */
export function resolveUiSlots(
  records: Array<{ pluginKey: string; packagePath: string | null; manifestJson: unknown }>,
): ResolvedUiSlot[] {
  const slots: ResolvedUiSlot[] = []
  for (const record of records) {
    const manifest = record.manifestJson as PluginManifest | null
    const declared = manifest?.ui?.slots
    if (!declared?.length) continue

    // 能力门禁：与 apiRoutes 同规则 —— 没声明就不挂载
    if (!(manifest?.capabilities ?? []).includes(UI_SLOT_CAPABILITY)) continue

    const bundleDir = manifest?.entrypoints?.ui
    if (!bundleDir || !record.packagePath) continue // 安装期已校验过，这里只是防御

    for (const slot of declared) {
      slots.push({
        pluginKey: record.pluginKey,
        type: slot.type,
        id: slot.id,
        displayName: slot.displayName,
        exportName: slot.exportName,
        ...(slot.routePath ? { routePath: slot.routePath } : {}),
        bundleDir,
        bundleUrl: pluginUiBundleUrl(record.pluginKey),
      })
    }
  }
  return slots.sort((a, b) => a.pluginKey.localeCompare(b.pluginKey) || a.type.localeCompare(b.type) || a.id.localeCompare(b.id))
}

/** 按 slot 类型过滤（宿主页面按需取用）。 */
export function filterUiSlots(slots: ResolvedUiSlot[], type: PluginUiSlotType): ResolvedUiSlot[] {
  return slots.filter((slot) => slot.type === type)
}
