import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const data = await SystemPermissionService.getRoleMenus(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.getRoleMenus"], request))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_ROLE_VIEW })
