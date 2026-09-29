import { NextResponse } from "next/server"

import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { PLUGIN_ROUTE_PREFIX, resolvePluginRoute } from "@/modules/shared/backend/plugins/route-mount"
import { PluginRepository } from "@/modules/shared/backend/plugins/plugin.repository"
import { pluginRuntimeManager } from "@/modules/shared/backend/plugins/runtime-manager"
import type { PluginManifest } from "@/modules/shared/backend/plugins/types"

/**
 * 插件自有 API 的挂载点：`/api/v1/admin/plugins/<pluginKey>/api<path>`
 *
 * 存在的意义：插件把路由**声明**在 manifest、处理器写在**包内**，由宿主统一挂载 ——
 * 这样插件目录才能完全自包含，不必把路由文件塞进 app/。
 * 本文件是宿主侧唯一的挂载实现，不含任何插件业务逻辑。
 *
 * 鉴权走 `withAdminRoute`（本仓约定：admin 路由不得直接 requireAdminAuth ——
 * 那种写法会被 admin:routes:manifest 判定为 legacy-direct-guard 并让门禁失败）。
 * 当前只支持 manifest 里 `auth: "operator"` 的声明；其余声明在 resolvePluginRoute 里
 * 明确返回 501 并说明原因，不静默降级。
 *
 * 形状说明：不依赖 Next 的 ctx.params（withAdminRoute 的签名是 (request, auth)），
 * 直接从 URL 解析 pluginKey 与子路径 —— 少一层耦合。
 */
async function handle(request: Request) {
  const pathname = new URL(request.url).pathname
  const rest = pathname.slice(`${PLUGIN_ROUTE_PREFIX}/`.length)
  const [pluginKey, ...tail] = rest.split("/")
  const pathPart = tail.join("/").replace(/^api\/?/, "")

  const record = await PluginRepository.findByKey(pluginKey)
  const manifest = (record?.manifestJson ?? null) as unknown as PluginManifest | null

  const resolution = resolvePluginRoute({
    manifest,
    capabilities: manifest?.capabilities ?? [],
    method: request.method,
    pathname: `${PLUGIN_ROUTE_PREFIX}/${pluginKey}/api${pathPart ? `/${pathPart}` : ""}`,
    pluginKey,
    runtimeMode: pluginRuntimeManager.modeOf(pluginKey),
  })
  if (!resolution.ok) {
    return NextResponse.json(
      { success: false, error: resolution.error ?? "插件路由不可用" },
      { status: resolution.status ?? 400 },
    )
  }

  const url = new URL(request.url)
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.json().catch(() => undefined)

  try {
    const result = await pluginRuntimeManager.invokeRoute(pluginKey, resolution.declaration!.routeKey, {
      method: request.method,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams),
      body,
      headers: Object.fromEntries(request.headers),
      pluginKey,
    })
    return NextResponse.json({ success: true, data: result?.body ?? null }, { status: result?.status ?? 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: `插件路由执行失败: ${message}` }, { status: 500 })
  }
}

export const GET = withAdminRoute(handle, { permission: PERMISSIONS.PLATFORM_PLUGIN_QUERY })
export const POST = withAdminRoute(handle, { permission: PERMISSIONS.PLATFORM_PLUGIN_QUERY })
export const PUT = withAdminRoute(handle, { permission: PERMISSIONS.PLATFORM_PLUGIN_QUERY })
export const PATCH = withAdminRoute(handle, { permission: PERMISSIONS.PLATFORM_PLUGIN_QUERY })
export const DELETE = withAdminRoute(handle, { permission: PERMISSIONS.PLATFORM_PLUGIN_QUERY })
