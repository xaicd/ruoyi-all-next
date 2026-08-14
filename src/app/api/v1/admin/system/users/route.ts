import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import {
  userListQuerySchema,
  createUserSchema,
} from "@/modules/system/backend/validators"
import { SystemUserService } from "@/modules/system/backend/services/user.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

/**
 * GET /api/v1/admin/system/users
 * 分页查询用户列表
 */
export const GET = withAdminRoute(async (request, auth) => {
  try {
    const { searchParams } = new URL(request.url)
    const input = userListQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      deptId: searchParams.get("deptId") ?? undefined,
    })

    const data = await SystemUserService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_VIEW })

/**
 * POST /api/v1/admin/system/users
 * 创建用户
 */
export const POST = withAdminRoute(async (request, auth) => {
  try {
    const body = await request.json()
    const input = createUserSchema.parse(body)

    const data = await SystemUserService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_CREATE })
