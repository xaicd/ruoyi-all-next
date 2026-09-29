import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const POST = withAdminRoute(async (request) => {
  const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.assignRoleMenu"], await request.json())
  return NextResponse.json({ success: true, data: await SystemPermissionService.assignRoleMenu(input) })
}, { permission: PERMISSIONS.SYSTEM_PERMISSION_ASSIGN_ROLE_MENU })
