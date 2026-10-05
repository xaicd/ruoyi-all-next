/**
 * 状态机原语（**存储/领域无关的纯函数**，与 `inventory-invariant` 同形）。
 *
 * 为什么需要它: 本仓有 **160 个带 `status` 的仓储** —— 订单、工单、审批、退款、支付…
 * 没有原语时每个域各写一套 `if (status === "X") ...`，结果是:
 *   * 规则散在 Service 里，看不出全集（"这个状态还能去哪"没人答得上来）
 *   * 非法迁移**静默通过**（我在 pay 与 erp 上各撞到一次真实事故）
 *   * 前端要展示"可做什么"，只能再写一遍同样的判断
 *
 * 设计取向与库存不变量一致: **声明式 + 纯函数 + 错误信息指名道姓**。
 * 不提供"静默跳过非法迁移"的选项 —— 那正是上面第二类事故的成因。
 */

export interface Transition<S extends string> {
  from: S
  to: S
  /**
   * 迁移动作名（如 "refund"）。用于错误信息与审计，
   * 也用于区分"同一对状态有多条路径"的场景（如 SUCCESS->CLOSED 只能走退款）。
   */
  action?: string
  /** 条件守卫: 返回 false 表示该迁移在当前上下文下不允许。省略表示无条件允许。 */
  guard?: (context: unknown) => boolean
}

export interface StateMachine<S extends string> {
  name: string
  states: readonly S[]
  /** 终态: 不可再迁出 */
  terminal: readonly S[]
  transitions: readonly Transition<S>[]
}

/** 声明一台状态机。唯一约束是"状态集合里必须有初始状态"由调用方保证（运行时校验见 assertValid）。 */
export function defineStateMachine<S extends string>(spec: StateMachine<S>): StateMachine<S> {
  return spec
}

export class IllegalTransitionError extends Error {
  constructor(
    readonly machine: string,
    readonly from: string,
    readonly to: string,
    readonly allowed: readonly string[],
    readonly action?: string,
  ) {
    super(
      `[${machine}] 非法状态迁移: ${from} -> ${to}${action ? `（动作 ${action}）` : ""}；` +
        `当前状态允许迁移到: ${allowed.length > 0 ? allowed.join(", ") : "（终态，无可用迁移）"}`,
    )
    this.name = "IllegalTransitionError"
  }
}

/** 某状态在给定上下文下**允许**迁往哪些状态（供前端渲染"可做什么"，与后端同一个真源）。 */
export function nextStates<S extends string>(machine: StateMachine<S>, from: S, context?: unknown): S[] {
  return machine.transitions
    .filter((transition) => transition.from === from && (!transition.guard || transition.guard(context)))
    .map((transition) => transition.to)
}

export function isTerminal<S extends string>(machine: StateMachine<S>, state: S): boolean {
  return machine.terminal.includes(state)
}

/** 是否允许迁移（不抛错，供判断用）。 */
export function canTransition<S extends string>(machine: StateMachine<S>, from: S, to: S, context?: unknown): boolean {
  return nextStates(machine, from, context).includes(to)
}

/**
 * 断言迁移合法，否则抛 `IllegalTransitionError`。
 *
 * **刻意不提供"非法时静默返回原状态"的变体** —— 那种"降级"会把 bug 藏到下游，
 * 而本次引入这个原语，正是因为已经在两个域上踩过"非法迁移静默通过"。
 */
export function assertTransition<S extends string>(
  machine: StateMachine<S>,
  from: S,
  to: S,
  options: { context?: unknown; action?: string } = {},
): void {
  if (!machine.states.includes(from)) {
    throw new Error(`[${machine.name}] 未知状态: ${from}；已声明状态: ${machine.states.join(", ")}`)
  }
  if (!machine.states.includes(to)) {
    throw new Error(`[${machine.name}] 未知状态: ${to}；已声明状态: ${machine.states.join(", ")}`)
  }
  if (!canTransition(machine, from, to, options.context)) {
    throw new IllegalTransitionError(machine.name, from, to, nextStates(machine, from, options.context), options.action)
  }
}

/**
 * 校验状态机定义本身自洽 —— 供声明处的测试调用。
 *
 * 能提前抓到的: 迁移引用了未声明的状态、终态却有迁出、同一 (from, action) 指向多个目标。
 * 这些都是"写的时候看不出来、运行时才炸"的定义错误。
 */
export function validateStateMachine<S extends string>(machine: StateMachine<S>): string[] {
  const problems: string[] = []
  const states = new Set<string>(machine.states)
  for (const transition of machine.transitions) {
    if (!states.has(transition.from)) problems.push(`迁移引用了未声明的来源状态: ${transition.from}`)
    if (!states.has(transition.to)) problems.push(`迁移引用了未声明的目标状态: ${transition.to}`)
    if (machine.terminal.includes(transition.from)) {
      problems.push(`终态 ${transition.from} 不应有迁出: -> ${transition.to}`)
    }
  }
  const seen = new Map<string, string>()
  for (const transition of machine.transitions) {
    if (!transition.action) continue
    const key = `${transition.from}:${transition.action}`
    const previous = seen.get(key)
    if (previous && previous !== transition.to) {
      problems.push(`同一动作 ${transition.action} 从 ${transition.from} 指向多个目标: ${previous} 与 ${transition.to}`)
    }
    seen.set(key, transition.to)
  }
  return problems
}
