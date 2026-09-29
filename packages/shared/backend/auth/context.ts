export type AuthEndpoint = "admin" | "app"

export type AuthContext = {
  subject: string
  /** Compatibility alias for existing service and route handlers. */
  userId: string
  tenantId?: string
  roles: string[]
  permissions: string[]
  endpoint: AuthEndpoint
  isGuest: boolean
  memberId?: string
  memberLevel?: string
  jti?: string
}

export class AuthenticationError extends Error {
  readonly status = 401
  readonly code = "UNAUTHENTICATED"

  constructor(message = "未登录或登录已过期") {
    super(message)
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends Error {
  readonly status = 403
  readonly code = "FORBIDDEN"

  constructor(message = "没有权限执行此操作") {
    super(message)
    this.name = "AuthorizationError"
  }
}
