/**
 * 插件 manifest 校验。
 *
 * 校验发生在**安装期**：读并校验 manifest → 拒绝不兼容 apiVersion → 向操作员展示申请的 capability）。
 * 所有失败都聚合成错误清单返回，而不是抛首个错 —— 插件作者需要一次看到全部问题。
 */
import { z } from "zod"

import {
  FORBIDDEN_CAPABILITIES,
  KNOWN_CAPABILITIES,
  PLUGIN_API_VERSION,
  type PluginManifest,
} from "./types"

const ID_PATTERN = /^[a-z0-9][a-z0-9._-]{1,127}$/
const SEMVER_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/

const pointerFreeString = z.string().min(1).max(500)

const manifestSchema = z.object({
  id: z.string().regex(ID_PATTERN, "id 必须是小写字母/数字开头，可含 . _ - ，长度 2–128"),
  apiVersion: z.number().int(),
  version: z.string().regex(SEMVER_PATTERN, "version 必须是 semver，如 0.1.0"),
  displayName: pointerFreeString,
  description: pointerFreeString,
  author: pointerFreeString,
  categories: z.array(z.enum(["connector", "workspace", "automation", "ui"])).min(1),
  minimumHostVersion: z.string().regex(SEMVER_PATTERN).optional(),
  capabilities: z.array(z.string()).default([]),
  entrypoints: z.object({
    worker: pointerFreeString.optional(),
    merged: pointerFreeString.optional(),
    ui: pointerFreeString.optional(),
  }),
  instanceConfigSchema: z.record(z.string(), z.unknown()).optional(),
  apiRoutes: z
    .array(
      z.object({
        routeKey: z.string().min(1),
        method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
        path: z.string().startsWith("/"),
        auth: z.enum(["operator", "company", "public"]),
      }),
    )
    .optional(),
  ui: z
    .object({
      slots: z
        .array(
          z.object({
            type: z.enum(["page", "dashboardWidget", "detailTab", "settingsPage", "sidebar", "toolbarButton"]),
            id: z.string().min(1),
            displayName: z.string().min(1),
            exportName: z.string().min(1),
            routePath: z.string().optional(),
          }),
        )
        .min(1),
    })
    .optional(),
})

export type ManifestValidation =
  | { ok: true; manifest: PluginManifest }
  | { ok: false; errors: string[] }

export function parsePluginManifest(input: unknown): ManifestValidation {
  const parsed = manifestSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`),
    }
  }

  const data = parsed.data
  const errors: string[] = []

  // 至少要有一种可运行形态: 独立 worker 或合并加载。
  if (!data.entrypoints.worker && !data.entrypoints.merged) {
    errors.push("entrypoints 至少要声明 worker（独立运行）或 merged（合并运行）之一")
  }

  // 拒绝不兼容的插件 API 版本（精确匹配，不做范围推断）
  if (data.apiVersion !== PLUGIN_API_VERSION) {
    errors.push(
      `apiVersion ${data.apiVersion} 与宿主支持的 ${PLUGIN_API_VERSION} 不兼容，拒绝安装`,
    )
  }

  // capability 必须静态可见。未知能力一律拒绝；
  // 禁忌能力单独给出明确理由，而不是笼统的"未知能力"。
  const seen = new Set<string>()
  for (const capability of data.capabilities) {
    if ((FORBIDDEN_CAPABILITIES as readonly string[]).includes(capability)) {
      errors.push(`capability "${capability}" 属禁忌能力，宿主不提供`)
      continue
    }
    if (!(KNOWN_CAPABILITIES as readonly string[]).includes(capability)) {
      errors.push(`capability "${capability}" 不在宿主能力白名单内`)
      continue
    }
    if (seen.has(capability)) {
      errors.push(`capability "${capability}" 重复声明`)
      continue
    }
    seen.add(capability)
  }

  // 同一 manifest 内重复 slot id 必须在安装期拒绝（跨插件重复由宿主命名空间化，无需检查）
  if (data.ui) {
    const slotIds = new Set<string>()
    for (const slot of data.ui.slots) {
      if (slotIds.has(slot.id)) errors.push(`ui.slots 内重复 id: "${slot.id}"`)
      slotIds.add(slot.id)
    }
    // 声明了 ui.slots 就必须有 entrypoints.ui，否则宿主无处加载组件
    if (!data.entrypoints.ui) {
      errors.push("声明了 ui.slots 但缺少 entrypoints.ui（宿主无法定位 UI bundle）")
    }
  }

  if (errors.length > 0) return { ok: false, errors }

  return {
    ok: true,
    manifest: {
      ...data,
      capabilities: [...seen] as PluginManifest["capabilities"],
    } as PluginManifest,
  }
}
