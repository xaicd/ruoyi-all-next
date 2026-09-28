import { NextResponse } from "next/server"

import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { listPlugins } from "@/modules/shared/backend/plugins/plugin-registry"

/**
 * GET /api/v1/admin/plugins
 *
 * 插件目录：列出全部已登记域插件及其声明面摘要。
 * 挂在 /api/v1/admin 下以复用既有 proxy 默认鉴权与路由保护基线。
 */
export const GET = withAdminRoute(
  async () =>
    NextResponse.json({
      success: true,
      data: listPlugins().map((plugin) => ({
        id: plugin.id,
        domain: plugin.domain,
        displayName: plugin.displayName,
        kind: plugin.kind,
        stage: plugin.stage,
        capabilities: plugin.capabilities,
        facadeMethodCount: plugin.facadeMethods.length,
        permissionCount: plugin.permissions.length,
      })),
    }),
  { permission: PERMISSIONS.PLATFORM_PLUGIN_QUERY },
)
