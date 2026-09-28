/**
 * 插件注册表（module→plugin 迁移 P1）。
 *
 * 数据来自生成的静态索引 `plugin-registry.generated.ts`（由 `npm run domain:manifests`
 * 产出）。本文件**不维护任何清单** —— 清单只在生成物里，避免出现第二份真源。
 *
 * 设计见 docs/architecture/ruoyi-all-next-module-to-plugin-migration.md。
 */
import { PLUGIN_MANIFESTS } from "@/modules/shared/contract/plugin-registry.generated"

export type PluginManifest = (typeof PLUGIN_MANIFESTS)[number]

/** 全部已登记域插件（顺序与 domain-catalog 一致）。 */
export function listPlugins(): readonly PluginManifest[] {
  return PLUGIN_MANIFESTS
}

/** 按域名解析插件。域名即 manifest 的 `domain` 字段（生成自 domain-catalog）。 */
export function getPluginByDomain(domain: string): PluginManifest | undefined {
  return PLUGIN_MANIFESTS.find((manifest) => manifest.domain === domain)
}

export type PluginDispatchTarget = {
  plugin: PluginManifest
  method: string
}

export type PluginDispatchResolution =
  | { ok: true; target: PluginDispatchTarget }
  | { ok: false; status: 400 | 404; error: string }

/**
 * 把网关的 `[...path]` 解析为 `<domain>/<method>`。
 *
 * 只支持两级：更深的路径属于「插件自有子路由」，P1 不承诺（需要 P2 的 apiRoutes 声明面）。
 * 方法必须在 manifest 已声明的 facadeMethods 内 —— 声明之外的调用直接 404，
 * 不落到 `invokeAction` 的动态兜底上，避免绕过声明面。
 */
export function resolvePluginDispatch(segments: readonly string[]): PluginDispatchResolution {
  if (segments.length === 0) {
    return { ok: false, status: 400, error: "缺少插件路径，格式为 <domain>/<method>" }
  }
  if (segments.length !== 2) {
    return {
      ok: false,
      status: 400,
      error: `仅支持 <domain>/<method> 两级路径，收到 ${segments.length} 段`,
    }
  }

  const [domain, method] = segments
  const plugin = getPluginByDomain(domain)
  if (!plugin) {
    return { ok: false, status: 404, error: `未登记的插件域: ${domain}` }
  }
  if (!(plugin.facadeMethods as readonly string[]).includes(method)) {
    return { ok: false, status: 404, error: `${domain} 未声明 facade 方法: ${method}` }
  }
  return { ok: true, target: { plugin, method } }
}
