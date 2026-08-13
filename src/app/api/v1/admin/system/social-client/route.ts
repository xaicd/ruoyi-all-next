import { NextResponse } from "next/server"
import { getAuthErrorStatus, requireAdminAuth } from "@/modules/shared/backend/auth/guards"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export async function GET(request: Request) {
  try {
    requireAdminAuth(request, PERMISSIONS.SYSTEM_SOCIAL_USER_VIEW)
    return NextResponse.json({ success: false, error: "社交客户端功能尚未实现" }, { status: 501 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "未授权"
    return NextResponse.json({ success: false, error: message }, { status: getAuthErrorStatus(error) })
  }
}
