export type AdminRoutePolicy = "authenticated" | "public"

type PublicAdminRouteException = {
  path: string
  methods: readonly string[]
  reason: string
}

/**
 * Admin APIs are authenticated by default. Every anonymous exception must be
 * narrow (exact path + HTTP method) and documented here for auditability.
 */
export const ADMIN_PUBLIC_ROUTE_EXCEPTIONS: readonly PublicAdminRouteException[] = [
  { path: "/api/v1/admin/system/auth", methods: ["POST"], reason: "administrator login" },
  { path: "/api/v1/admin/system/auth/login", methods: ["POST"], reason: "administrator login endpoint" },
  { path: "/api/v1/admin/system/auth/captcha", methods: ["GET", "POST"], reason: "login captcha issuance and verification" },
  { path: "/api/v1/admin/system/auth/refresh-token", methods: ["POST"], reason: "token refresh" },
  { path: "/api/v1/admin/aigw/demo/execute", methods: ["POST"], reason: "Playground demo execution and interactive scenario testing" },
  { path: "/api/v1/admin/aigw/auth/agent-verify", methods: ["POST"], reason: "Third-party ISV agent authentication by phone" },
]

export function getAdminRoutePolicy(pathname: string, method: string): AdminRoutePolicy {
  return ADMIN_PUBLIC_ROUTE_EXCEPTIONS.some(
    (exception) => exception.path === pathname && exception.methods.includes(method.toUpperCase()),
  )
    ? "public"
    : "authenticated"
}
