export const nextReactAdminRouterAccessTemplate = `export const ADMIN_STATIC_ROUTES = [
  "/admin/home",
  "/admin/profile",
  "/admin/error",
  "/admin/iframe",
] as const

export function buildAdminModuleRoute(modulePath: string): string {
  return \`/admin/\${modulePath}\`
}

export function isAdminStaticRoute(route: string): boolean {
  return (ADMIN_STATIC_ROUTES as readonly string[]).includes(route)
}
`