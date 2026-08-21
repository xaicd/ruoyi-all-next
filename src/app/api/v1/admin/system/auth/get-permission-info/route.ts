import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemAuthService } from "@/modules/system/backend/services/auth.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (_request, auth) => {
  const data = await SystemAuthService.getPermissionInfoByUser(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getPermissionInfoByUser"], { userId: auth.userId }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_USER_VIEW })
