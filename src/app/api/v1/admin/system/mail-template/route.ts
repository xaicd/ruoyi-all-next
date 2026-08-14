import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request, auth) => {
  try {
    return NextResponse.json({ success: false, error: "邮件模板功能尚未实现" }, { status: 501 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "未授权"
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_MAIL_ACCOUNT_VIEW })
