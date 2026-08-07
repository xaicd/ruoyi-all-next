/**
 * Rate Limiter - 接口限流与风控
 *
 * 能力：
 * - 滑动窗口限流（per IP / per User / per API）
 * - 令牌桶限流（突发流量控制）
 * - 黑白名单管理
 * - 风控规则引擎（异常行为检测）
 *
 * 阶段演进：
 * - 阶段A：内存计数器（单实例）
 * - 阶段B：Redis 分布式限流
 * - 阶段C：独立风控服务 + 规则引擎
 */

// ============ Types ============

export type RateLimitRule = {
  /** 规则 ID */
  id: string
  /** 限流维度：ip / userId / api / global */
  dimension: "ip" | "userId" | "api" | "global"
  /** 时间窗口（秒） */
  window: number
  /** 窗口内最大请求数 */
  maxRequests: number
  /** 超限后的处理：reject / delay / degrade */
  action: "reject" | "delay" | "degrade"
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
  rule?: string
}

export type RiskEvent = {
  type: "BRUTE_FORCE" | "REPLAY_ATTACK" | "ABNORMAL_FREQUENCY" | "IP_BLACKLIST"
  source: string
  detail: Record<string, unknown>
  timestamp: string
}

// ============ State ============

const counters = new Map<string, { count: number; resetAt: number }>()
const blacklist = new Set<string>()
const whitelist = new Set<string>()
const riskEvents: RiskEvent[] = []

const DEFAULT_RULES: RateLimitRule[] = [
  { id: "global-api", dimension: "global", window: 1, maxRequests: 1000, action: "reject" },
  { id: "per-ip", dimension: "ip", window: 60, maxRequests: 100, action: "reject" },
  { id: "per-user", dimension: "userId", window: 60, maxRequests: 200, action: "reject" },
  { id: "login-attempt", dimension: "api", window: 300, maxRequests: 5, action: "reject" },
]

// ============ Core ============

export const rateLimiter = {
  /**
   * 检查请求是否允许
   *
   * @example
   * const result = rateLimiter.check({ ip: "1.2.3.4", userId: "user-001", api: "/api/v1/admin/system/auth/login" })
   * if (!result.allowed) return NextResponse.json({ error: "请求过于频繁" }, { status: 429 })
   */
  check(ctx: { ip?: string; userId?: string; api?: string }): RateLimitResult {
    // 白名单直接放行
    if (ctx.ip && whitelist.has(ctx.ip)) return { allowed: true, remaining: 999, resetAt: 0 }
    if (ctx.userId && whitelist.has(ctx.userId)) return { allowed: true, remaining: 999, resetAt: 0 }

    // 黑名单直接拒绝
    if (ctx.ip && blacklist.has(ctx.ip)) {
      recordRisk({ type: "IP_BLACKLIST", source: ctx.ip, detail: { api: ctx.api }, timestamp: new Date().toISOString() })
      return { allowed: false, remaining: 0, resetAt: Date.now() + 3600000, rule: "blacklist" }
    }

    // 逐条检查规则
    for (const rule of DEFAULT_RULES) {
      let key: string | undefined
      switch (rule.dimension) {
        case "ip": key = ctx.ip ? `ip:${ctx.ip}` : undefined; break
        case "userId": key = ctx.userId ? `user:${ctx.userId}` : undefined; break
        case "api": key = ctx.api ? `api:${ctx.api}:${ctx.ip || ctx.userId}` : undefined; break
        case "global": key = "global"; break
      }
      if (!key) continue

      const now = Date.now()
      const counter = counters.get(key)

      if (!counter || counter.resetAt < now) {
        counters.set(key, { count: 1, resetAt: now + rule.window * 1000 })
        continue
      }

      counter.count++
      if (counter.count > rule.maxRequests) {
        return { allowed: false, remaining: 0, resetAt: counter.resetAt, rule: rule.id }
      }
    }

    return { allowed: true, remaining: 100, resetAt: Date.now() + 60000 }
  },

  /** 添加黑名单 */
  addBlacklist(key: string) { blacklist.add(key) },

  /** 移除黑名单 */
  removeBlacklist(key: string) { blacklist.delete(key) },

  /** 添加白名单 */
  addWhitelist(key: string) { whitelist.add(key) },

  /** 获取风控事件（监控用） */
  getRiskEvents(limit = 50): RiskEvent[] { return riskEvents.slice(-limit) },

  /** 重置计数器（测试用） */
  reset() { counters.clear() },
}

function recordRisk(event: RiskEvent) {
  riskEvents.push(event)
  if (riskEvents.length > 500) riskEvents.shift()
}
