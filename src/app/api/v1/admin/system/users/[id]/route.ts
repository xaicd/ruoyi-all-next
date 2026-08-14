import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import {
  updateUserSchema,
  updateUserPasswordSchema,
  deleteUserSchema,
} from "@/modules/system/backend/validators"
import { SystemUserService } from "@/modules/system/backend/services/user.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

/**
 * GET /api/v1/admin/system/users/:id
 * 获取用户详情
 */
export const GET = withAdminRoute(async (request, auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemUserService.getById(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_VIEW })

/**
 * PUT /api/v1/admin/system/users/:id
 * 更新用户
 */
export const PUT = withAdminRoute(async (request, auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const body = await request.json()
    const input = updateUserSchema.parse({ ...body, id })

    const data = await SystemUserService.update(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403
      : error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "更新失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_UPDATE })

/**
 * DELETE /api/v1/admin/system/users/:id
 * 删除用户
 */
export const DELETE = withAdminRoute(async (request, auth, context: RouteContext) => {
  try {
    const { id } = await context.params

    const data = await SystemUserService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403
      : error?.message?.includes("不存在") ? 404
      : error?.message?.includes("不允许") ? 409 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "删除失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_DELETE })

/**
 * PATCH /api/v1/admin/system/users/:id
 * 部分更新（状态变更、密码重置）
 */
export const PATCH = withAdminRoute(async (request, auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const body = await request.json()

    // 密码重置
    if (body.action === "resetPassword") {
      const input = updateUserPasswordSchema.parse({ id, password: body.password })
      const data = await SystemUserService.resetPassword(input)
      return NextResponse.json({ success: true, data })
    }

    // 状态变更
    if (body.action === "updateStatus") {
      if (!["ACTIVE", "DISABLED"].includes(body.status)) {
        return NextResponse.json({ success: false, error: "无效状态值" }, { status: 400 })
      }
      const data = await SystemUserService.updateStatus(id, body.status)
      return NextResponse.json({ success: true, data })
    }

    return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403
      : error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_UPDATE })
