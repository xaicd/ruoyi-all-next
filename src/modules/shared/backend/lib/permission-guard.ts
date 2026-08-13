import type { PermissionCode } from "../constants/permissions"
import { requireAdminAuth } from "../auth/guards"
import type { AuthContext } from "../auth/context"

/**
 * @deprecated Use requireAdminAuth directly in new routes. This adapter keeps
 * existing routes compatible while enforcing verified Bearer JWT authentication.
 */
export function extractAuthContext(request: Request): AuthContext {
  return requireAdminAuth(request)
}

/**
 * @deprecated Use requireAdminAuth(request, permission) in new routes.
 */
export function ensurePermission(request: Request, requiredPermission: PermissionCode): AuthContext {
  return requireAdminAuth(request, requiredPermission)
}
