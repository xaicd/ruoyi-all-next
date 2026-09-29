import { NextResponse } from "next/server"
import { AppearanceService } from "@/modules/infra/backend/services/appearance.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

/** 后台读取站点/主题外观 GET /api/v1/admin/infra/appearance */
export const GET = withAdminRoute(
  async () => {
    const data = await AppearanceService.get()
    return NextResponse.json({ success: true, data })
  },
  { permission: PERMISSIONS.INFRA_APPEARANCE_QUERY },
)

/** 后台更新站点/主题外观 PUT /api/v1/admin/infra/appearance（局部 merge） */
export const PUT = withAdminRoute(
  async (request) => {
    const body = await request.json().catch(() => ({}))
    const data = await AppearanceService.update(body)
    return NextResponse.json({ success: true, data })
  },
  { permission: PERMISSIONS.INFRA_APPEARANCE_UPDATE },
)
