import type { PermissionCode } from "../constants/permissions"
import { AuthenticationError, AuthorizationError, type AuthContext, type AuthEndpoint } from "./context"
import { activateTenantContext, getPlatformRole } from "../lib/biz-tenant"
import { TenantEntitlementService } from "@/modules/system/backend/services/tenant-entitlement.service"
import { toTenantContext } from "./tenant"
import { verifyJwt } from "./jwt"

function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization")?.trim()
  if (!authorization) return null
  const match = /^Bearer\s+(.+)$/i.exec(authorization)
  if (!match || !match[1]) throw new AuthenticationError("Authorization 格式无效")
  return match[1]
}

function toContext(token: string, endpoint: AuthEndpoint): AuthContext {
  const payload = verifyJwt(token, endpoint)
  const auth: AuthContext = {
    subject: payload.sub,
    userId: payload.sub,
    tenantId: payload.tenantId,
    roles: payload.roles,
    permissions: payload.permissions,
    endpoint,
    isGuest: false,
    memberId: payload.memberId,
    memberLevel: payload.memberLevel,
  }
  // Transitional activation: existing route handlers call the guard directly.
  // New handlers should wrap their full execution in runWithTenantContext.
  activateTenantContext(toTenantContext(auth))
  return auth
}

export async function requireAdminAuth(request: Request, requiredPermission?: PermissionCode): Promise<AuthContext> {
  const token = readBearerToken(request)
  if (!token) throw new AuthenticationError()
  const auth = toContext(token, "admin")
  const isPlatformAdmin = auth.roles.includes(getPlatformRole())

  if (!isPlatformAdmin) {
    if (!auth.tenantId) throw new AuthorizationError("管理员账号未绑定租户")
    try {
      await TenantEntitlementService.resolve(auth.tenantId)
    } catch (error) {
      throw new AuthorizationError(error instanceof Error ? error.message : "租户权益不可用")
    }
  }

  if (requiredPermission && !auth.permissions.includes(requiredPermission) && !auth.permissions.includes("*")) {
    throw new AuthorizationError(`缺少权限: ${requiredPermission}`)
  }
  return auth
}

/** Platform control-plane guard for tenant, tenant-package and global catalog administration. */
export async function requirePlatformAdmin(request: Request, requiredPermission?: PermissionCode): Promise<AuthContext> {
  const auth = await requireAdminAuth(request, requiredPermission)
  if (!auth.roles.includes(getPlatformRole())) {
    throw new AuthorizationError("仅平台管理员可访问租户控制面")
  }
  return auth
}

export function requireAppAuth(request: Request): AuthContext {
  const token = readBearerToken(request)
  if (!token) throw new AuthenticationError()
  return toContext(token, "app")
}

export function optionalAppAuth(request: Request): AuthContext {
  const token = readBearerToken(request)
  if (!token) {
    return { subject: "GUEST", userId: "GUEST", roles: [], permissions: [], endpoint: "app", isGuest: true }
  }
  return toContext(token, "app")
}

export function getAuthErrorStatus(error: unknown): number {
  return error instanceof AuthenticationError || error instanceof AuthorizationError ? error.status : 400
}
