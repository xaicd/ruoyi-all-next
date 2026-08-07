/**
 * Auth Gateway - 统一授权网关
 *
 * 支持多端鉴权：
 * - admin: JWT + permission code（管理后台）
 * - app: Member JWT（用户端/小程序）
 * - open: 签名验证（第三方回调）
 * - internal: 服务间调用（信任链）
 *
 * 阶段演进：
 * - 阶段A：本地 JWT 验证
 * - 阶段B：加入 OAuth2 / SSO
 * - 阶段C：独立 Auth Service + Token 中心
 */

// ============ Types ============

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
  sub: string         // userId
  type: AuthEndpoint
  tenantId?: string
  permissions?: string[]
  roles?: string[]
  exp: number         // 过期时间戳
  iat: number         // 签发时间戳
}

// ============ Core ============

export const authGateway = {
  /**
   * 统一鉴权入口
   */
  async authenticate(request: Request, endpoint: AuthEndpoint): Promise<AuthResult> {
    switch (endpoint) {
      case "admin":
        return authGateway.authenticateAdmin(request)
      case "app":
        return authGateway.authenticateApp(request)
      case "open":
        return authGateway.authenticateOpen(request)
      case "internal":
        return authGateway.authenticateInternal(request)
      default:
        return { authenticated: false, endpoint, error: "Unknown endpoint type" }
    }
  },

  /** 管理后台鉴权 */
  async authenticateAdmin(request: Request): Promise<AuthResult> {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      // 兼容旧的 x-user-id 模式
      const userId = request.headers.get("x-user-id")
      if (userId) {
        const permissions = (request.headers.get("x-permissions") || "").split(",").filter(Boolean)
        return { authenticated: true, endpoint: "admin", userId, permissions }
      }
      return { authenticated: false, endpoint: "admin", error: "Missing authorization" }
    }

    // TODO: 阶段B 接入真实 JWT 验证
    try {
      const payload = decodeToken(token)
      return {
        authenticated: true,
        endpoint: "admin",
        userId: payload.sub,
        tenantId: payload.tenantId,
        permissions: payload.permissions || [],
        roles: payload.roles || [],
      }
    } catch (e: any) {
      return { authenticated: false, endpoint: "admin", error: e.message }
    }
  },

  /** 用户端/小程序鉴权 */
  async authenticateApp(request: Request): Promise<AuthResult> {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return { authenticated: false, endpoint: "app", error: "Missing authorization" }
    }

    try {
      const payload = decodeToken(token)
      return {
        authenticated: true,
        endpoint: "app",
        userId: payload.sub,
        tenantId: payload.tenantId,
        metadata: { memberLevel: "NORMAL" }, // TODO: 从会员服务获取
      }
    } catch (e: any) {
      return { authenticated: false, endpoint: "app", error: e.message }
    }
  },

  /** 开放接口验签 */
  async authenticateOpen(request: Request): Promise<AuthResult> {
    const signature = request.headers.get("x-signature")
    const timestamp = request.headers.get("x-timestamp")
    const appId = request.headers.get("x-app-id")

    if (!signature || !timestamp || !appId) {
      return { authenticated: false, endpoint: "open", error: "Missing signature headers" }
    }

    // TODO: 验证签名、时间窗口、appId 有效性
    const timeDiff = Math.abs(Date.now() - Number(timestamp))
    if (timeDiff > 5 * 60 * 1000) {
      return { authenticated: false, endpoint: "open", error: "Timestamp expired" }
    }

    return { authenticated: true, endpoint: "open", metadata: { appId } }
  },

  /** 服务间内部调用鉴权 */
  async authenticateInternal(request: Request): Promise<AuthResult> {
    const internalToken = request.headers.get("x-internal-token")
    const serviceName = request.headers.get("x-service-name")

    if (!internalToken || !serviceName) {
      return { authenticated: false, endpoint: "internal", error: "Missing internal auth" }
    }

    // TODO: 验证内部 token（阶段C 使用 mTLS）
    return { authenticated: true, endpoint: "internal", metadata: { serviceName } }
  },

  /** 权限检查 */
  hasPermission(auth: AuthResult, requiredPermission: string): boolean {
    if (!auth.authenticated) return false
    if (auth.userId === "SYSTEM") return true // 超级管理员
    return auth.permissions?.includes(requiredPermission) || false
  },

  /** 角色检查 */
  hasRole(auth: AuthResult, requiredRole: string): boolean {
    if (!auth.authenticated) return false
    return auth.roles?.includes(requiredRole) || false
  },
}

// ============ Helpers ============

function decodeToken(token: string): TokenPayload {
  // 简易 JWT 解码（阶段A：不验证签名）
  // TODO: 阶段B 接入 jose/jsonwebtoken 做完整验证
  try {
    const parts = token.split(".")
    if (parts.length !== 3) throw new Error("Invalid token format")
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString())
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new Error("Token expired")
    }
    return payload
  } catch {
    throw new Error("Invalid token")
  }
}
