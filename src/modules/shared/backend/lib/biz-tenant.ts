import { AsyncLocalStorage } from "node:async_hooks"

export type TenantMode = "disabled" | "required"

export type TenantContext = {
  tenantId?: string
  actorId?: string
  endpoint?: "admin" | "app" | "open" | "internal"
  isPlatform: boolean
  traceId?: string
}

const tenantStorage = new AsyncLocalStorage<TenantContext>()

export function getTenantMode(): TenantMode {
  return process.env.TENANT_MODE === "required" ? "required" : "disabled"
}

export function getPlatformRole(): string {
  return process.env.TENANT_PLATFORM_ROLE?.trim() || "platform-admin"
}

export function isPlatformUsername(username: string): boolean {
  return (process.env.TENANT_PLATFORM_USERNAMES ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .includes(username)
}

export function isTenantRequired(): boolean {
  return getTenantMode() === "required"
}

export function runWithTenantContext<T>(context: TenantContext, work: () => T): T {
  if (context.tenantId === "") throw new Error("tenantId 不能为空")
  if (isTenantRequired() && !context.isPlatform && !context.tenantId) {
    throw new Error("租户上下文缺失")
  }
  return tenantStorage.run(Object.freeze({ ...context }), work)
}

/**
 * Transitional adapter for existing Route Handlers. New routes must use
 * runWithTenantContext()/withTenantContext so the context lifetime is explicit.
 */
export function activateTenantContext(context: TenantContext): void {
  if (context.tenantId === "") throw new Error("tenantId 不能为空")
  if (isTenantRequired() && !context.isPlatform && !context.tenantId) {
    throw new Error("租户上下文缺失")
  }
  tenantStorage.enterWith(Object.freeze({ ...context }))
}

export function getTenantContext(): TenantContext | undefined {
  return tenantStorage.getStore()
}

export function requireTenantContext(): TenantContext & { tenantId: string } {
  const context = getTenantContext()
  if (!context || context.isPlatform || !context.tenantId) throw new Error("当前操作必须在租户上下文中执行")
  return context as TenantContext & { tenantId: string }
}

export function getCurrentTenantId(): string | undefined {
  return getTenantContext()?.tenantId
}

export function isPlatformContext(): boolean {
  return getTenantContext()?.isPlatform === true
}

/** A collision-safe key namespace for caches, locks, rate limits and files. */
export function tenantKey(purpose: string, id?: string, context = getTenantContext()): string {
  const scope = context?.isPlatform ? "platform" : context?.tenantId ? `tenant:${context.tenantId}` : "public"
  return [scope, purpose, id].filter(Boolean).join(":")
}

/** Legacy API retained only for source compatibility; request code must use runWithTenantContext. */
export function setTenantContext(context: TenantContext): void {
  activateTenantContext(context)
}

/** AsyncLocalStorage contexts are scoped to execution; this is intentionally a no-op. */
export function clearTenantContext(): void {}
