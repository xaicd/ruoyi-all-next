/**
 * App Auth Guard - 用户端/小程序鉴权
 *
 * 与 admin 端区别：
 * - 不需要 permission code，只需要登录态
 * - 会员等级/积分等信息附加在 context 中
 * - 某些接口允许游客访问（如商品列表）
 */

import { authGateway, type AuthResult } from "./auth-gateway"

export type AppAuthContext = {
  userId: string
  memberId?: string
  memberLevel?: string
  tenantId?: string
  isGuest: boolean
}

/**
 * 确保用户端已登录
 * @throws 未登录时抛出 401 错误
 */
export function ensureAppAuth(request: Request): AppAuthContext {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")

  // 游客模式：无 token 但允许访问
  if (!token) {
    return { userId: "GUEST", isGuest: true }
  }

  // 简易解码（阶段 A）
  try {
    const parts = token.split(".")
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString())
      return {
        userId: payload.sub || payload.userId,
        memberId: payload.memberId,
        memberLevel: payload.memberLevel || "NORMAL",
        tenantId: payload.tenantId,
        isGuest: false,
      }
    }
  } catch {}

  // 兼容旧 header 模式
  const userId = request.headers.get("x-user-id")
  if (userId) {
    return { userId, isGuest: false }
  }

  return { userId: "GUEST", isGuest: true }
}

/**
 * 要求必须登录（不允许游客）
 * @throws 未登录时抛出错误
 */
export function requireAppLogin(request: Request): AppAuthContext {
  const ctx = ensureAppAuth(request)
  if (ctx.isGuest) {
    throw new Error("请先登录")
  }
  return ctx
}
