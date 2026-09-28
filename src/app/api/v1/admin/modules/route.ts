import { NextResponse } from "next/server"

import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { listModules } from "./_lib/module-registry"

/**
 * GET /api/v1/admin/modules
 *
 * 模块目录：列出全部已登记域模块及其声明面摘要。
 * 挂在 /api/v1/admin 下以复用既有 proxy 默认鉴权与路由保护基线。
 */
export const GET = withAdminRoute(
  async () =>
    NextResponse.json({
      success: true,
      data: listModules().map((manifest) => ({
        id: manifest.id,
        domain: manifest.domain,
        displayName: manifest.displayName,
        kind: manifest.kind,
        stage: manifest.stage,
        capabilities: manifest.capabilities,
        facadeMethodCount: manifest.facadeMethods.length,
        permissionCount: manifest.permissions.length,
      })),
    }),
  { permission: PERMISSIONS.PLATFORM_PLUGIN_QUERY },
)
