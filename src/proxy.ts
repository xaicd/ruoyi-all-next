import { NextRequest, NextResponse, type ProxyConfig } from "next/server"
import { AuthenticationError, AuthorizationError } from "@/modules/shared/backend/auth/context"
import { requireAdminAuth } from "@/modules/shared/backend/auth/guards"
import { getAdminRoutePolicy } from "@/modules/shared/backend/lib/admin-route-policy"

/**
 * Node-runtime perimeter guard for every admin API route. It deliberately
 * performs authentication only; resource permissions remain enforced inside
 * each Route Handler and are tracked by the route-policy migration gate.
 */
export async function proxy(request: NextRequest) {
  if (getAdminRoutePolicy(request.nextUrl.pathname, request.method) === "public") {
    return NextResponse.next()
  }

  try {
    await requireAdminAuth(request)
    return NextResponse.next()
  } catch (error) {
    const status = error instanceof AuthenticationError || error instanceof AuthorizationError
      ? error.status
      : 500
    return NextResponse.json(
      { success: false, error: status === 401 ? "未登录或登录已过期" : status === 403 ? "没有权限执行此操作" : "管理员认证服务不可用" },
      { status },
    )
  }
}

export const config: ProxyConfig = {
  matcher: ["/api/v1/admin/:path*"],
}
