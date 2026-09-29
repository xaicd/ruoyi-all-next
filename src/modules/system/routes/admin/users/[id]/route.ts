import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemUserService } from "@/modules/system/backend/services/user.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemUserService.getUser(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getUser"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_VIEW })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemUserService.update(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateUser"], { ...await request.json(), id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403
      : error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "更新失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemUserService.deleteUser(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteUser"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403
      : error?.message?.includes("不存在") ? 404
      : error?.message?.includes("不允许") ? 409 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "删除失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_DELETE })

export const PATCH = withAdminRoute(async (request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const body = await request.json()
    if (body.action === "resetPassword") {
      const data = await SystemUserService.resetPassword(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.resetUserPassword"], { id, password: body.password }))
      return NextResponse.json({ success: true, data })
    }
    if (body.action === "updateStatus") {
      const data = await SystemUserService.updateUserStatus(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateUserStatus"], { id, status: body.status }))
      return NextResponse.json({ success: true, data })
    }
    return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403
      : error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_UPDATE })
