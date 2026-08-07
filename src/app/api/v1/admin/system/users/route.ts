import { NextResponse } from "next/server"
import {
  userListQuerySchema,
  createUserSchema,
} from "@/modules/system/backend/validators"
import { SystemUserService } from "@/modules/system/backend/services/user.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

/**
 * GET /api/v1/admin/system/users
 * 分页查询用户列表
 */
export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_USER_VIEW)
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
}

/**
 * POST /api/v1/admin/system/users
 * 创建用户
 */
export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_USER_CREATE)
    const body = await request.json()
    const input = createUserSchema.parse(body)

    const data = await SystemUserService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    const status = error?.message?.includes("权限") ? 403 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status })
  }
}
