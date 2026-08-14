import { NextResponse } from "next/server"
import { loginSchema } from "@/modules/system/backend/validators"
import { SystemAuthService } from "@/modules/system/backend/services/auth.service"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { ApiError, handleApiError } from "@/modules/shared/backend/http/api-error"
import { traceContext } from "@/modules/shared/backend/lib/trace-context"
import { recordApiAccess } from "@/modules/shared/backend/lib/observability"

/** POST /api/v1/admin/system/auth — the only public administrator login method. */
export async function POST(request: Request) {
  const trace = traceContext.fromHeaders(request.headers, "admin-api", "POST /api/v1/admin/system/auth")
  return traceContext.runWithTrace(trace, async () => {
    const startedAt = Date.now()
    let response: Response
    try {
      const body = await request.json()
      const input = loginSchema.parse(body)
      const data = await SystemAuthService.login(input)
      response = NextResponse.json({ success: true, data }, { headers: { "X-Trace-Id": trace.traceId } })
    } catch (error: unknown) {
      if (error instanceof Error && ["用户名或密码错误", "租户账号登录必须填写租户标识", "租户编码不存在", "账号未绑定租户"].includes(error.message)) {
        response = handleApiError(new ApiError(401, error.message, "AUTHENTICATION_FAILED"), { request, operation: trace.operationName })
      } else if (error instanceof Error && error.message.includes("禁用")) {
        response = handleApiError(new ApiError(403, error.message, "ACCOUNT_DISABLED"), { request, operation: trace.operationName })
      } else {
        response = handleApiError(error, { request, operation: trace.operationName })
      }
    }
    recordApiAccess({ method: request.method, path: new URL(request.url).pathname, status: response.status, durationMs: Date.now() - startedAt })
    return response
  })
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
