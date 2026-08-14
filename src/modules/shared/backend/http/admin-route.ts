import type { PermissionCode } from "../constants/permissions"
import type { AuthContext } from "../auth/context"
import { requireAdminAuth, requirePlatformAdmin } from "../auth/guards"
import { toTenantContext } from "../auth/tenant"
import { runWithTenantContext } from "../lib/biz-tenant"
import { handleApiError } from "./api-error"
import { recordApiAccess } from "../lib/observability"
import { traceContext } from "../lib/trace-context"

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
    const path = new URL(request.url).pathname
    const trace = traceContext.fromHeaders(request.headers, "admin-api", `${request.method} ${path}`)
    return traceContext.runWithTrace(trace, async () => {
      const startedAt = Date.now()
      let userId: string | undefined
      let tenantId: string | undefined
      let response: Response
      try {
        const auth = options.platformOnly
          ? await requirePlatformAdmin(request, options.permission)
          : await requireAdminAuth(request, options.permission)
        userId = auth.userId
        tenantId = auth.tenantId
        response = await runWithTenantContext(toTenantContext(auth), () => handler(request, auth, ...args))
      } catch (error) {
        response = handleApiError(error, { request, operation: trace.operationName })
      }
      recordApiAccess({ method: request.method, path, status: response.status, durationMs: Date.now() - startedAt, userId, tenantId })
      response.headers.set("X-Trace-Id", trace.traceId)
      return response
    })
  }
}
