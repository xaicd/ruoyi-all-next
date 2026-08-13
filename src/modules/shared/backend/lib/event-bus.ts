/**
 * Event Bus - 域间异步事件通信
 *
 * 设计目标：
 * - 阶段A（当前）：本地内存发布/订阅，同步执行
 * - 阶段B：加入持久化队列、失败重试、幂等消费
 * - 阶段C：替换为 Redis Streams / Kafka / RabbitMQ
 *
 * 规范：
 * - 域内状态变更完成后发布事件
 * - 其他域通过订阅事件响应（解耦）
 * - 事件必须幂等处理（同一事件可能投递多次）
 */

import { getTenantContext, isTenantRequired } from "./biz-tenant"

// ============ Types ============

export type DomainEvent = {
  /** 事件类型，格式：domain.entity.action，如 pay.order.created */
  type: string
  /** 事件负载 */
  payload: Record<string, unknown>
  /** 事件来源域 */
  source: string
  /** 事件 ID（幂等标识） */
  eventId: string
  /** 发布时间 */
  timestamp: string
  /** 关联追踪 ID */
  traceId?: string
  /** Immutable owner scope copied from the verified execution context. */
  tenantId?: string
}

export type EventHandler = (event: DomainEvent) => Promise<void>

type Subscription = {
  pattern: string | RegExp
  handler: EventHandler
  subscriber: string
}

// ============ State ============

const subscriptions: Subscription[] = []
const eventLog: DomainEvent[] = []
const MAX_EVENT_LOG = 1000
const deadLetterQueue: { event: DomainEvent; error: string; failedAt: string }[] = []

// ============ Core ============

function generateEventId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function matchPattern(eventType: string, pattern: string | RegExp): boolean {
  if (pattern instanceof RegExp) return pattern.test(eventType)
  // 支持通配符：pay.order.* 匹配 pay.order.created, pay.order.paid
  const regex = new RegExp("^" + pattern.replace(/\./g, "\\.").replace(/\*/g, "[^.]+") + "$")
  return regex.test(eventType)
}

export const eventBus = {
  /**
   * 发布事件
   *
   * @example
   * // pay 域：支付成功后发布事件
   * await eventBus.publish({
   *   type: "pay.order.paid",
   *   source: "pay",
   *   payload: { orderId: "pay-001", amount: 9900 },
   * })
   */
  async publish(event: Omit<DomainEvent, "eventId" | "timestamp" | "tenantId">): Promise<string> {
    const context = getTenantContext()
    if (isTenantRequired() && !context) throw new Error("发布租户事件缺少租户上下文")
    const fullEvent: DomainEvent = {
      ...event,
      tenantId: context?.tenantId,
      traceId: event.traceId ?? context?.traceId,
      eventId: generateEventId(),
      timestamp: new Date().toISOString(),
    }

    // 记录事件日志
    eventLog.push(fullEvent)
    if (eventLog.length > MAX_EVENT_LOG) eventLog.shift()

    // 分发给匹配的订阅者
    const matchedSubs = subscriptions.filter((s) => matchPattern(fullEvent.type, s.pattern))

    for (const sub of matchedSubs) {
      try {
        await sub.handler(fullEvent)
      } catch (e: any) {
        // 失败进入死信队列（阶段B/C可配置重试策略）
        deadLetterQueue.push({
          event: fullEvent,
          error: e.message,
          failedAt: new Date().toISOString(),
        })
      }
    }

    return fullEvent.eventId
  },

  /**
   * 订阅事件
   *
   * @example
   * // mall 域：监听支付成功事件，更新订单状态
   * eventBus.subscribe({
   *   pattern: "pay.order.paid",
   *   subscriber: "mall.order",
   *   handler: async (event) => {
   *     await MallOrderService.markPaid(event.payload.orderId)
   *   },
   * })
   *
   * // 通配符订阅
   * eventBus.subscribe({
   *   pattern: "pay.order.*",
   *   subscriber: "audit.logger",
   *   handler: async (event) => { ... },
   * })
   */
  subscribe(opts: { pattern: string | RegExp; subscriber: string; handler: EventHandler }) {
    subscriptions.push(opts)
  },

  /** 取消订阅 */
  unsubscribe(subscriber: string) {
    const idx = subscriptions.findIndex((s) => s.subscriber === subscriber)
    if (idx !== -1) subscriptions.splice(idx, 1)
  },

  /** 获取事件日志（用于调试/监控） */
  getEventLog(limit = 50): DomainEvent[] {
    return eventLog.slice(-limit)
  },

  /** 获取死信队列（用于运维） */
  getDeadLetterQueue() {
    return [...deadLetterQueue]
  },

  /** 重试死信队列中的事件 */
  async retryDeadLetter(eventId: string): Promise<boolean> {
    const idx = deadLetterQueue.findIndex((d) => d.event.eventId === eventId)
    if (idx === -1) return false
    const { event } = deadLetterQueue[idx]
    deadLetterQueue.splice(idx, 1)
    await eventBus.publish(event)
    return true
  },

  /** 清空（测试用） */
  clear() {
    subscriptions.length = 0
    eventLog.length = 0
    deadLetterQueue.length = 0
  },
}
