/**
 * App Auth Guard - 用户端/小程序鉴权
 *
 * 与 admin 端区别：
 * - 不需要 permission code，只需要登录态
 * - 会员等级/积分等信息附加在 context 中
 * - 某些接口允许游客访问（如商品列表）
 */

import type { AuthContext } from "../auth/context"
import { optionalAppAuth, requireAppAuth } from "../auth/guards"

export type AppAuthContext = AuthContext

/**
 * Optional application authentication. A missing Bearer token is a guest;
 * an invalid supplied token is rejected and never downgraded to a guest.
 */
export function ensureAppAuth(request: Request): AppAuthContext {
  return optionalAppAuth(request)
}

/** Requires a verified app-scoped Bearer JWT. */
export function requireAppLogin(request: Request): AppAuthContext {
  return requireAppAuth(request)
}
