import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemMenuService } from "@/modules/system/backend/services/menu.service"
import { getPlatformRole } from "@/modules/shared/backend/lib/biz-tenant"

export const GET = withAdminRoute(async (_request, auth) => {
  const data = await SystemMenuService.getSidebarNav(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getSidebarNav"], {
    userId: auth.userId,
    isPlatformAdmin: auth.roles.includes(getPlatformRole()),
  }))
  return NextResponse.json({ success: true, data })
})
