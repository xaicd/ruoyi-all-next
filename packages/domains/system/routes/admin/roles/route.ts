import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemRoleService } from "@/modules/system/backend/services/role.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  try {
    const input = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listRoles"], request)
    const data = await SystemRoleService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_ROLE_VIEW })

export const POST = withAdminRoute(async (request) => {
  try {
    const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createRole"], await request.json())
    const data = await SystemRoleService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_ROLE_CREATE })
