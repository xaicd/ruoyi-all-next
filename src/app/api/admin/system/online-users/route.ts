import { NextResponse } from "next/server"
import { pageQuerySchema, forceLogoutSchema } from "@/modules/system/backend/validators"
import { SystemOnlineUserService } from "@/modules/system/backend/services/online-user.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { writeAuditLog } from "@/modules/shared/backend/lib/audit-log"

/**
 * GET /api/admin/system/online-users
 * 在线用户列表（模板）
 */
export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_ONLINE_USER_VIEW)
    const { searchParams } = new URL(request.url)
    const input = pageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })

    const data = await SystemOnlineUserService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

/**
 * POST /api/admin/system/online-users
 * 强制下线（模板）
 */
export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.SYSTEM_ONLINE_USER_FORCE_LOGOUT)
    const body = await request.json()
    const input = forceLogoutSchema.parse(body)
    const data = await SystemOnlineUserService.forceLogout(auth.userId, input)
    await writeAuditLog({
      action: "system.online-user.force-logout",
      operatorId: auth.userId,
      targetType: "SESSION",
      targetId: input.sessionId,
      detail: { sessionId: input.sessionId },
    })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}
