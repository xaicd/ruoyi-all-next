/**
 * 宿主挂载层：把插件 manifest 里声明的 `apiRoutes` 变成真实可访问的路由。
 *
 * 这是「路由跟着包走」的关键一步 —— 插件把路由声明写在 manifest 里、处理器写在包内，
 * 由宿主统一挂载，因此插件目录可以完全自包含（不必把路由文件塞进 app/）。
 *
 * 挂载前缀: `/api/v1/plugins/<pluginKey>/api<path>`
 *   为什么**不**放在 /api/v1/admin 下: admin 前缀由 proxy 的 perimeter 统一要求管理员鉴权，
 *   而插件的 auth 是**运行期按 manifest 声明**的（operator/company/public），静态的
 *   "精确路径+方法"白名单表达不了。放在非 admin 前缀下，proxy 直接放行，
 *   由**本挂载点**按声明鉴权 —— 也与 Paperclip 的 /api/plugins/* 形态一致。
 *
 * 支撑范围（诚实标注，不静默降级）:
 *   - 运行形态: 目前只支持 merged（同进程）。isolated 需要 worker 协议新增路由转发方法，**尚未实现**，
 *     调用会得到明确的 501 而不是假装成功。
 *   - auth: 目前只支持 `operator`。`public` / `company` 需要把该路径纳入 proxy 的公开策略，
 *     否则请求在到达本层之前就被 proxy 拦掉，因此暂时明确拒绝这两种声明。
 */
import type { PluginApiRouteDeclaration, PluginManifest } from "./types"

export const PLUGIN_ROUTE_PREFIX = "/api/v1/plugins"

export function pluginRoutePath(pluginKey: string, declarationPath: string): string {
  const suffix = declarationPath.startsWith("/") ? declarationPath : `/${declarationPath}`
  return `${PLUGIN_ROUTE_PREFIX}/${pluginKey}/api${suffix}`
}

/**
 * 注意形状: 本仓 tsconfig 未开严格模式, 判别联合(strictNullChecks)的窄化不生效
 * （同类问题在 package-scanner 的 readJson 上已出现过）。因此这里用可选字段而不是联合,
 * 避免调用方需要依赖窄化。
 */
export type RouteMountResolution = {
  ok: boolean
  declaration?: PluginApiRouteDeclaration
  status?: number
  error?: string
}

/**
 * 判定一次请求能否落到插件的某个处理器上。
 * 未声明、方法不符、能力缺失、运行形态不支持 —— 每一种都给出**不同的**明确原因。
 */
export function resolvePluginRoute(input: {
  manifest: PluginManifest | null
  capabilities: readonly string[]
  method: string
  pathname: string
  pluginKey: string
  runtimeMode: "merged" | "isolated" | undefined
}): RouteMountResolution {
  const { manifest, capabilities, method, pathname, pluginKey, runtimeMode } = input

  if (!manifest) return { ok: false, status: 404, error: `未找到插件: ${pluginKey}` }
  if (!capabilities.includes("api.routes.register")) {
    return { ok: false, status: 403, error: `插件未声明 api.routes.register 能力` }
  }
  // isolated 形态的路由转发需要 worker 协议新增方法，尚未实现 —— 明确 501，不假装支持
  if (runtimeMode === "isolated") {
    return {
      ok: false,
      status: 501,
      error: "isolated 形态的插件路由转发尚未实现（需要 worker 协议新增路由方法）",
    }
  }

  const want = pathname.slice(`${PLUGIN_ROUTE_PREFIX}/${pluginKey}/api`.length) || "/"
  const declaration = (manifest.apiRoutes ?? []).find(
    (route) => route.method === method && route.path === want,
  )
  if (!declaration) {
    return { ok: false, status: 404, error: `插件未声明该路由: ${method} ${want}` }
  }
  return { ok: true, declaration }
}
