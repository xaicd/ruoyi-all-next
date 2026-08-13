import type { AuthContext } from "./context"
import { AuthorizationError } from "./context"
import { getPlatformRole, type TenantContext } from "../lib/biz-tenant"

export function toTenantContext(auth: AuthContext): TenantContext {
  const isPlatform = auth.roles.includes(getPlatformRole())
  if (!isPlatform && !auth.tenantId && process.env.TENANT_MODE === "required") {
    throw new AuthorizationError("当前账号未绑定租户")
  }
  return {
    tenantId: auth.tenantId,
    actorId: auth.subject,
    endpoint: auth.endpoint,
    isPlatform,
  }
}
