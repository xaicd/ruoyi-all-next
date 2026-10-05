import { describe, it, expect } from "vitest"
import {
  assertTransition, canTransition, defineStateMachine, IllegalTransitionError,
  isTerminal, nextStates, validateStateMachine,
} from "../state-machine"

/** 用支付订单当例子 —— 本仓真实存在的状态机。 */
const payable = defineStateMachine({
  name: "pay-order",
  states: ["WAITING", "SUCCESS", "CLOSED"] as const,
  terminal: ["CLOSED"] as const,
  transitions: [
    { from: "WAITING", to: "SUCCESS", action: "pay" },
    { from: "WAITING", to: "CLOSED", action: "close" },
    // 已支付只能通过退款关闭（带守卫）—— 对应真实业务规则
    { from: "SUCCESS", to: "CLOSED", action: "refund", guard: (ctx) => (ctx as { refunded?: boolean })?.refunded === true },
  ],
})

describe("状态机原语", () => {
  it("合法迁移通过", () => {
    expect(canTransition(payable, "WAITING", "SUCCESS")).toBe(true)
    expect(() => assertTransition(payable, "WAITING", "SUCCESS")).not.toThrow()
  })

  it("★ 非法迁移抛错，且错误信息指名道姓（含当前可用目标）", () => {
    try {
      assertTransition(payable, "CLOSED", "SUCCESS")
      throw new Error("本应抛错")
    } catch (error) {
      expect(error).toBeInstanceOf(IllegalTransitionError)
      const message = (error as Error).message
      expect(message).toContain("pay-order")
      expect(message).toContain("CLOSED -> SUCCESS")
      expect(message).toContain("终态")
    }
  })

  it("★ 守卫按上下文生效（已支付只有退款才能关闭）", () => {
    expect(canTransition(payable, "SUCCESS", "CLOSED", { refunded: false })).toBe(false)
    expect(canTransition(payable, "SUCCESS", "CLOSED", { refunded: true })).toBe(true)
  })

  it("nextStates 给出「当前能去哪」（前端与后端同一个真源）", () => {
    expect(nextStates(payable, "WAITING").sort()).toEqual(["CLOSED", "SUCCESS"])
    expect(nextStates(payable, "SUCCESS", { refunded: false })).toEqual([])
    expect(nextStates(payable, "SUCCESS", { refunded: true })).toEqual(["CLOSED"])
  })

  it("终态识别", () => {
    expect(isTerminal(payable, "CLOSED")).toBe(true)
    expect(isTerminal(payable, "WAITING")).toBe(false)
  })

  it("未知状态报错信息把已声明状态列全（排查时不用翻代码）", () => {
    expect(() => assertTransition(payable, "NOT_A_STATE" as never, "SUCCESS")).toThrow(/未知状态.*NOT_A_STATE/)
  })

  it("★ validateStateMachine 能抓出定义本身的错（运行时才炸的那类）", () => {
    const broken = defineStateMachine({
      name: "broken",
      states: ["A", "B"] as const,
      terminal: ["B"] as const,
      transitions: [
        { from: "A", to: "C" as never, action: "go" },   // C 未声明
        { from: "B", to: "A", action: "back" },          // 终态不应有迁出
      ],
    })
    const problems = validateStateMachine(broken)
    expect(problems.some((p) => p.includes("未声明的目标状态"))).toBe(true)
    expect(problems.some((p) => p.includes("终态"))).toBe(true)
  })

  it("validateStateMachine 对自洽的定义返回空", () => {
    expect(validateStateMachine(payable)).toEqual([])
  })
})
