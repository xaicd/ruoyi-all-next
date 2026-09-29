import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemDeptService } from "@/modules/system/backend/services/dept.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  try {
    const input = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.treeDepts"], request)
    const data = input.mode === "list"
      ? await SystemDeptService.list(input)
      : await SystemDeptService.tree(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_DEPT_VIEW })

export const POST = withAdminRoute(async (request) => {
  try {
    const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createDept"], await request.json())
    const data = await SystemDeptService.create({ ...input, email: input.email || undefined })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_DEPT_CREATE })
