import { NextResponse } from "next/server"
import type { PermissionCode } from "../constants/permissions"
import { AuthenticationError, AuthorizationError, type AuthContext } from "../auth/context"
import { requireAdminAuth, requirePlatformAdmin } from "../auth/guards"
import { toTenantContext } from "../auth/tenant"
import { runWithTenantContext } from "../lib/biz-tenant"

export type AdminRouteOptions = {
  permission?: PermissionCode
  platformOnly?: boolean
}

type AdminRouteHandler<TArgs extends unknown[]> = (
  request: Request,
  auth: AuthContext,
  ...args: TArgs
) => Response | Promise<Response>

/**
 * Resource-level admin boundary. Proxy protects the perimeter; this wrapper
 * enforces the route permission and keeps tenant context alive for all async work.
 */
export function withAdminRoute<TArgs extends unknown[]>(
  handler: AdminRouteHandler<TArgs>,
  options: AdminRouteOptions = {},
): (request: Request, ...args: TArgs) => Promise<Response> {
  return async (request, ...args) => {
    try {
      const auth = options.platformOnly
        ? await requirePlatformAdmin(request, options.permission)
        : await requireAdminAuth(request, options.permission)
      return await runWithTenantContext(toTenantContext(auth), () => handler(request, auth, ...args))
    } catch (error) {
      const status = error instanceof AuthenticationError || error instanceof AuthorizationError ? error.status : 400
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : "请求处理失败" },
        { status },
      )
    }
  }
}
