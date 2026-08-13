/**
 * Legacy compatibility facade for callers that expect an AuthResult instead of
 * guard exceptions. It never trusts caller-supplied identity headers.
 */
import type { AuthContext } from "../auth/context"
import { requireAdminAuth, requireAppAuth } from "../auth/guards"

export type AuthEndpoint = "admin" | "app" | "open" | "internal"

export type AuthResult = {
  authenticated: boolean
  endpoint: AuthEndpoint
  userId?: string
  tenantId?: string
  permissions?: string[]
  roles?: string[]
  metadata?: Record<string, unknown>
  error?: string
}

export type TokenPayload = {
  sub: string
  type: AuthEndpoint
  tenantId?: string
  permissions?: string[]
  roles?: string[]
  exp: number
  iat: number
}

function toResult(auth: AuthContext): AuthResult {
  return {
    authenticated: true,
    endpoint: auth.endpoint,
    userId: auth.userId,
    tenantId: auth.tenantId,
    permissions: auth.permissions,
    roles: auth.roles,
    metadata: auth.memberId || auth.memberLevel ? { memberId: auth.memberId, memberLevel: auth.memberLevel } : undefined,
  }
}

function rejected(endpoint: AuthEndpoint, error: unknown): AuthResult {
  return { authenticated: false, endpoint, error: error instanceof Error ? error.message : "认证失败" }
}

/**
 * @deprecated Route handlers must use the strict guards directly. This facade
 * remains source-compatible for legacy callers while failing closed.
 */
export const authGateway = {
  async authenticate(request: Request, endpoint: AuthEndpoint): Promise<AuthResult> {
    switch (endpoint) {
      case "admin": return authGateway.authenticateAdmin(request)
      case "app": return authGateway.authenticateApp(request)
      case "open": return authGateway.authenticateOpen(request)
      case "internal": return authGateway.authenticateInternal(request)
    }
  },

  async authenticateAdmin(request: Request): Promise<AuthResult> {
    try {
      return toResult(requireAdminAuth(request))
    } catch (error) {
      return rejected("admin", error)
    }
  },

  async authenticateApp(request: Request): Promise<AuthResult> {
    try {
      return toResult(requireAppAuth(request))
    } catch (error) {
      return rejected("app", error)
    }
  },

  /** Fails closed until HMAC signature + nonce replay protection is implemented. */
  async authenticateOpen(_request: Request): Promise<AuthResult> {
    return rejected("open", new Error("开放接口签名认证尚未配置"))
  },

  /** Fails closed until a trusted internal service authentication mechanism is implemented. */
  async authenticateInternal(_request: Request): Promise<AuthResult> {
    return rejected("internal", new Error("内部服务认证尚未配置"))
  },

  hasPermission(auth: AuthResult, requiredPermission: string): boolean {
    return auth.authenticated && auth.permissions?.includes(requiredPermission) === true
  },

  hasRole(auth: AuthResult, requiredRole: string): boolean {
    return auth.authenticated && auth.roles?.includes(requiredRole) === true
  },
}
