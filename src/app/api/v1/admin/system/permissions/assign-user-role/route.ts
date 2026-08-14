import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { assignUserRoleSchema } from "@/modules/system/backend/validators"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const POST = withAdminRoute(async (request, auth) => {
  try {
    const body = await request.json()
    const input = assignUserRoleSchema.parse(body) as any
    const data = await SystemPermissionService.assignUserRole(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_PERMISSION_ASSIGN_USER_ROLE })
