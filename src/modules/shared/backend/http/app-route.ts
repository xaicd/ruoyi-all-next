/**
 * App (C 端) 路由包装器 —— 对标 withAdminRoute，简化版。
 *
 * 与 admin 版区别：无 permission / platform 校验（C 端只需登录态或游客）；
 * 保留 trace / 计时 / 租户上下文 / 统一错误处理 / 访问日志。
 */

import type { AuthContext } from "../auth/context"
import { requireAppAuth, optionalAppAuth } from "../auth/guards"
import { toTenantContext } from "../auth/tenant"
import { runWithTenantContext } from "../lib/biz-tenant"
import { handleApiError } from "./api-error"
import { recordApiAccess, resolveApiAccessOutcome } from "../lib/observability"
import { persistApiAccessLog } from "../lib/api-log-persistence"
import { traceContext } from "../lib/trace-context"

export type AppRouteOptions = {
  /** true = 允许游客（optionalAppAuth，无 token 也放行为 GUEST）；默认 false = 必须登录 */
  optional?: boolean
}

type AppRouteHandler<TArgs extends unknown[]> = (
  request: Request,
  auth: AuthContext,
  ...args: TArgs
) => Response | Promise<Response>

/**
 * C 端资源边界。校验 app JWT（或游客），保持租户上下文贯穿异步执行。
 */
export function withAppRoute<TArgs extends unknown[]>(
  handler: AppRouteHandler<TArgs>,
  options: AppRouteOptions = {},
): (request: Request, ...args: TArgs) => Promise<Response> {
  return async (request, ...args) => {
    const path = new URL(request.url).pathname
    const trace = traceContext.fromHeaders(request.headers, "app-api", `${request.method} ${path}`)
    return traceContext.runWithTrace(trace, async () => {
      const startedAt = Date.now()
      let userId: string | undefined
      let tenantId: string | undefined
      let response: Response
      try {
        const auth = options.optional ? optionalAppAuth(request) : requireAppAuth(request)
        userId = auth.userId
        tenantId = auth.tenantId
        response = await runWithTenantContext(toTenantContext(auth), () => handler(request, auth, ...args))
      } catch (error) {
        response = handleApiError(error, { request, operation: trace.operationName })
      }
      const errorCode = response.headers.get("X-Error-Code") ?? undefined
      const accessLog = {
        method: request.method,
        path,
        status: response.status,
        durationMs: Date.now() - startedAt,
        userId,
        tenantId,
        outcome: resolveApiAccessOutcome(response.status, errorCode),
        errorCode,
      }
      recordApiAccess(accessLog)
      const userIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      void persistApiAccessLog({
        ...accessLog,
        traceId: trace.traceId,
        userIp,
        userAgent: request.headers.get("user-agent") ?? undefined,
        operation: trace.operationName,
      })
      return response
    })
  }
}
