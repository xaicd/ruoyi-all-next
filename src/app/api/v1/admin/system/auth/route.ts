import { NextResponse } from "next/server"
import { loginSchema } from "@/modules/system/backend/validators"
import { SystemAuthService } from "@/modules/system/backend/services/auth.service"
import { getPlatformRole, runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"

/**
 * POST /api/v1/admin/system/auth
 * 登录
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = loginSchema.parse(body)
    const data = await SystemAuthService.login(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("禁用") ? 403 : 401
    return NextResponse.json({ success: false, error: error?.message ?? "登录失败" }, { status })
  }
}

/**
 * GET /api/v1/admin/system/auth
 * 获取当前用户权限信息（需 Bearer token）
 */
export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ success: false, error: "未登录" }, { status: 401 })

    const payload = await SystemAuthService.verifyToken(token)
    const data = await runWithTenantContext(
      { tenantId: payload.tenantId, actorId: payload.sub, endpoint: "admin", isPlatform: payload.roles.includes(getPlatformRole()) },
      () => SystemAuthService.getPermissionInfo(payload.sub),
    )
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "获取失败" }, { status: 401 })
  }
}

/**
 * PUT /api/v1/admin/system/auth
 * 刷新 token
 */
export async function PUT(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ success: false, error: "未登录" }, { status: 401 })

    const data = await SystemAuthService.refreshToken(token)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "刷新失败" }, { status: 401 })
  }
}

/**
 * DELETE /api/v1/admin/system/auth
 * 退出登录（JWT 无状态，服务端可选加黑名单）
 */
export async function DELETE() {
  return NextResponse.json({ success: true, data: { message: "已退出" } })
}
