import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemDeptService } from "@/modules/system/backend/services/dept.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemDeptService.getDept(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getDept"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_DEPT_VIEW })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateDept"], { ...await request.json(), id })
    const data = await SystemDeptService.update({ ...input, email: input.email || undefined })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_DEPT_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemDeptService.deleteDept(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteDept"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404
      : error?.message?.includes("子部门") ? 409 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_DEPT_DELETE })
