import { NextResponse } from "next/server"
import { loginSchema } from "@/modules/system/backend/validators"
import { SystemAuthService } from "@/modules/system/backend/services/auth.service"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

/** POST /api/v1/admin/system/auth — the only public administrator login method. */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = loginSchema.parse(body)
    const data = await SystemAuthService.login(input)
    return NextResponse.json({ success: true, data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "登录失败"
    const status = message.includes("禁用") ? 403 : 401
    return NextResponse.json({ success: false, error: message }, { status })
  }
}

/** GET /api/v1/admin/system/auth — current authenticated administrator. */
export const GET = withAdminRoute(async (_request, auth) => {
  const data = await SystemAuthService.getPermissionInfo(auth.userId)
  return NextResponse.json({ success: true, data })
})

/** PUT /api/v1/admin/system/auth — refresh an authenticated administrator token. */
export const PUT = withAdminRoute(async (request) => {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) throw new Error("未登录")
  const data = await SystemAuthService.refreshToken(token)
  return NextResponse.json({ success: true, data })
})

/** DELETE /api/v1/admin/system/auth — stateless logout acknowledgement. */
export const DELETE = withAdminRoute(async () => (
  NextResponse.json({ success: true, data: { message: "已退出" } })
))
