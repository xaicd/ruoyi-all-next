import type { PermissionCode } from "../constants/permissions"

type AuthContext = {
  userId: string
  permissions: string[]
}

/**
 * 从请求头读取最小鉴权上下文。
 * x-user-id: 当前操作者
 * x-permissions: 逗号分隔的权限码集合
 */
export function extractAuthContext(request: Request): AuthContext {
  const userId = request.headers.get("x-user-id")?.trim() || "SYSTEM"
  const permissions = (request.headers.get("x-permissions") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
  return { userId, permissions }
}

export function ensurePermission(request: Request, requiredPermission: PermissionCode): AuthContext {
  const auth = extractAuthContext(request)

  // 演示基座中保留 SYSTEM 超级账号通道。
  if (auth.userId === "SYSTEM") return auth

  if (!auth.permissions.includes(requiredPermission)) {
    throw new Error(`缺少权限: ${requiredPermission}`)
  }

  return auth
}
