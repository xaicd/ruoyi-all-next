import { NextResponse } from "next/server"
import { assignUserRoleSchema } from "@/backend/validators/system.validator"
import { SystemPermissionService } from "@/backend/services/system-permission.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.SYSTEM_PERMISSION_ASSIGN_USER_ROLE)
    const body = await request.json()
    const input = assignUserRoleSchema.parse(body)

    const data = await SystemPermissionService.assignUserRole(auth.userId, input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}
