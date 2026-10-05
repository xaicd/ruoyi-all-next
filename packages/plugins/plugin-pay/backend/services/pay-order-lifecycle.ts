/**
 * 支付订单生命周期（状态机 + 不变量）。
 *
 * 从源框架 `PayOrderServiceImpl` 忠实移植的三条**核心不变量** —— 它们不是 CRUD 能覆盖的，
 * 而且一旦缺失就会造成资金侧的真实事故:
 *
 *   1. **回调必须幂等**：支付平台会重复回调。第一次成功要发业务事件（通知商户系统），
 *      重复回调**绝不能再发一次** —— 否则下游会重复发货/重复记账。
 *   2. **已成功不被降级**：先支付成功、后来收到"关闭"通知（通常是全额退款导致），
 *      此时**不能**把订单改回关闭 —— 关闭只通过退款流程去更新支付单。
 *   3. **只有待支付可关闭**：非 WAITING 状态的关闭通知是异常，必须报错而不是静默改状态。
 *
 * 这些规则放在独立模块里而不是塞进 Service: Service 是生成产物（会被重生成），
 * 状态机是手写资产。
 */

export type PayOrderStatus = "WAITING" | "SUCCESS" | "CLOSED"

export interface PayOrderLike {
  id: string
  status: PayOrderStatus | string
  price?: number
}

export interface PayOrderExtensionLike {
  id: string
  orderId: string
  status: PayOrderStatus | string
}

export interface PaidCallbackResult<T extends PayOrderLike> {
  /** 应用后的订单（未变更时原样返回） */
  order: T
  /** true = 这是重复回调，**不要**再发业务事件 */
  duplicate: boolean
  /** true = 首次成功，应当发业务事件（如通知商户系统） */
  emitEvent: boolean
}

/**
 * 应用"支付成功"回调。
 *
 * 对应源实现: 先更新拓展单，再更新订单；订单"之前已经成功"则**直接返回、不重复记录通知**。
 */
export function applyPaidCallback<T extends PayOrderLike>(order: T, extension: PayOrderExtensionLike): PaidCallbackResult<T> {
  if (extension.orderId !== order.id) {
    throw new Error(`支付回调的拓展单不属于该订单: extension.orderId=${extension.orderId} order.id=${order.id}`)
  }
  // 不变量 1: 幂等。
  if (order.status === "SUCCESS") {
    return { order, duplicate: true, emitEvent: false }
  }
  if (order.status !== "WAITING") {
    throw new Error(`只有待支付订单能被支付成功回调: 当前状态 ${order.status}`)
  }
  return { order: { ...order, status: "SUCCESS" }, duplicate: false, emitEvent: true }
}

export type ClosedCallbackOutcome = "closed" | "skipped-already-closed" | "skipped-paid-no-downgrade"

/**
 * 应用"支付关闭"回调。
 *
 * 对应源实现 `updateOrderExtensionClosed` 的两条提前返回:
 * 已关闭 → 跳过；已成功 → 跳过（**不降级**）。其余非 WAITING 状态 → 报错。
 */
export function applyClosedCallback<T extends PayOrderLike>(order: T, extension: PayOrderExtensionLike): { order: T; outcome: ClosedCallbackOutcome } {
  if (extension.orderId !== order.id) {
    throw new Error(`支付关闭回调的拓展单不属于该订单: extension.orderId=${extension.orderId} order.id=${order.id}`)
  }
  if (order.status === "CLOSED") {
    return { order, outcome: "skipped-already-closed" }
  }
  // 不变量 2: 已支付不因"关闭"通知而降级（全额退款才关闭，且走退款流程）。
  if (order.status === "SUCCESS") {
    return { order, outcome: "skipped-paid-no-downgrade" }
  }
  // 不变量 3: 其余状态不是合法的关闭来源。
  if (order.status !== "WAITING") {
    throw new Error(`只有待支付订单能被关闭回调: 当前状态 ${order.status}`)
  }
  return { order: { ...order, status: "CLOSED" }, outcome: "closed" }
}

/**
 * 订单是否应当被超时关闭。
 *
 * 对应源实现 `expireOrder` 的前置判定: **只有待支付**的订单会在超时后被关单，
 * 已成功/已关闭的都不动。
 */
export function shouldExpire(order: PayOrderLike, createdAt: string | Date, expireMinutes: number, now: Date = new Date()): boolean {
  if (order.status !== "WAITING") return false
  if (!Number.isFinite(expireMinutes) || expireMinutes <= 0) return false
  const created = createdAt instanceof Date ? createdAt : new Date(createdAt)
  if (Number.isNaN(created.getTime())) return false
  return now.getTime() - created.getTime() >= expireMinutes * 60_000
}

/** 状态迁移是否合法（供路由/服务做入参校验，避免绕过上面两个回调入口直接改状态）。 */
export function canTransition(from: PayOrderStatus | string, to: PayOrderStatus | string): boolean {
  const allowed: Record<string, PayOrderStatus[]> = {
    WAITING: ["SUCCESS", "CLOSED"],
    SUCCESS: ["CLOSED"], // 仅退款流程可关闭
    CLOSED: [],
  }
  return (allowed[from] ?? []).includes(to as PayOrderStatus)
}
