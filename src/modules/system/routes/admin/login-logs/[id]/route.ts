import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { LoginLogService } from "@/modules/system/backend/services/login-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await LoginLogService.getLoginLog(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getLoginLog"], { id }))
  if (!data) return NextResponse.json({ success: false, error: "不存在" }, { status: 404 })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_LOGIN_LOG_QUERY })
