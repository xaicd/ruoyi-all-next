import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemUserService } from "@/modules/system/backend/services/user.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  try {
    const input = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listUsers"], request)
    const data = await SystemUserService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_VIEW })

export const POST = withAdminRoute(async (request) => {
  try {
    const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createUser"], await request.json())
    const data = await SystemUserService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_CREATE })
