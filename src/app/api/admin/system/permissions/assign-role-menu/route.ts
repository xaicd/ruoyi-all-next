import { NextResponse } from "next/server"
import { assignRoleMenuSchema } from "@/modules/system/backend/validators"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.SYSTEM_PERMISSION_ASSIGN_ROLE_MENU)
    const body = await request.json()
    const input = assignRoleMenuSchema.parse(body)

    const data = await SystemPermissionService.assignRoleMenu(auth.userId, input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}
