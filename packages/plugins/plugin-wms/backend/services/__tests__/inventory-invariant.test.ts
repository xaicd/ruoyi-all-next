import { describe, it, expect } from "vitest"
import {
  availableQty, planDeduct, planReplenish, planLock, planRelease,
  executePlan, InsufficientStockError,
  type InventoryRow, type StockMutationPlan, type StockMutationExecutor,
} from "../inventory-invariant"

const row = (qty: number, lockedQty = 0): InventoryRow => ({ id: "inv1", qty, lockedQty })

/**
 * 模拟真实库的条件更新语义: `UPDATE ... WHERE <guard>` 的影响行数。
 * 这不是"假 mock" —— 它实现的正是适配器契约要求的判定，含 guard 不满足返回 0 行。
 */
function executor(state: { qty: number; lockedQty: number }, opts: { failGuard?: boolean } = {}): StockMutationExecutor {
  return {
    async applyConditionalUpdate(_id: string, plan: StockMutationPlan, amount: number) {
      if (opts.failGuard) return 0 // 条件不满足（并发被别人先拿走）
      if (plan.kind === "deduct") {
        if (state.qty < amount && plan.conditionalUpdate.guardApplies) return 0
        state.qty -= amount
      } else if (plan.kind === "replenish") {
        state.qty += amount
      } else if (plan.kind === "lock") {
        if (state.qty - state.lockedQty < amount) return 0
        state.lockedQty += amount
      } else {
        if (state.lockedQty < amount) return 0
        state.lockedQty -= amount
      }
      return 1
    },
  }
}

describe("库存不变量（对齐源框架 ErpStockServiceImpl.updateStockCountIncrement）", () => {
  it("可用量 = 在库 - 已预占", () => {
    expect(availableQty(row(10, 3))).toBe(7)
    expect(availableQty(row(2, 5))).toBe(-3)
  })

  it("出库: 够扣则允许，恰好扣完为 0 也允许", () => {
    expect(planDeduct(row(10), 4).allowed).toBe(true)
    expect(planDeduct(row(10), 4).nextQty).toBe(6)
    expect(planDeduct(row(4), 4).allowed).toBe(true)
    expect(planDeduct(row(4), 4).nextQty).toBe(0)
  })

  it("出库: 不够则拒绝（源实现的 STOCK_COUNT_NEGATIVE）", () => {
    const p = planDeduct(row(3), 4)
    expect(p.allowed).toBe(false)
    expect(p.reason).toBe("insufficient-qty")
  })

  it("负库存开关打开时，出库不再被前置检查拦下（guard 放宽）", () => {
    const p = planDeduct(row(3), 4, { allowNegative: true })
    expect(p.allowed).toBe(true)
    expect(p.nextQty).toBe(-1)
    expect(p.conditionalUpdate.guardApplies).toBe(false)
  })

  it("非正数/非法数量一律拒绝（避免用 0 或负数绕过语义）", () => {
    expect(planDeduct(row(10), 0).allowed).toBe(false)
    expect(planReplenish(row(10), -5).allowed).toBe(false)
    expect(planLock(row(10), Number.NaN).allowed).toBe(false)
  })

  it("预占按可用量判断 —— 不能占别人已占的", () => {
    expect(planLock(row(10, 8), 3).allowed).toBe(false)
    expect(planLock(row(10, 8), 2).allowed).toBe(true)
    expect(planLock(row(10, 8), 2).nextLockedQty).toBe(10)
  })

  it("释放预占不允许把 locked_qty 放成负数", () => {
    expect(planRelease(row(10, 2), 3).allowed).toBe(false)
    expect(planRelease(row(10, 2), 2).nextLockedQty).toBe(0)
  })

  it("补货无条件允许", () => {
    const p = planReplenish(row(-2), 5)
    expect(p.allowed).toBe(true)
    expect(p.nextQty).toBe(3)
  })

  it("★ 并发超卖防护: 规划时够、落地时不够 -> 必须报错而不是当成功", async () => {
    const state = { qty: 5, lockedQty: 0 }
    // 两个并发请求各自都"看到"5 件，都规划通过
    const planA = planDeduct({ id: "inv1", ...state }, 5)
    const planB = planDeduct({ id: "inv1", ...state }, 5)
    expect(planA.allowed).toBe(true)
    expect(planB.allowed).toBe(true)

    const ex = executor(state)
    const plan = planDeduct({ id: "inv1", ...state }, 5)
    await expect(executePlan({ id: "inv1", ...state }, plan, 5, ex)).resolves.toEqual({ qty: 0, lockedQty: 0 })
    // 第二个: 规划仍然"通过"，但条件更新影响 0 行 -> 抛错
    await expect(executePlan({ id: "inv1", ...state }, plan, 5, ex)).rejects.toBeInstanceOf(InsufficientStockError)
    expect(state.qty).toBe(0)
  })

  it("执行器返回 0 行（guard 不满足）时抛 InsufficientStockError", async () => {
    await expect(
      executePlan(row(100), planDeduct(row(100), 5), 5, executor({ qty: 100, lockedQty: 0 }, { failGuard: true })),
    ).rejects.toBeInstanceOf(InsufficientStockError)
  })

  it("规划阶段就不可用时，不触碰执行器", async () => {
    let called = 0
    const spy: StockMutationExecutor = { async applyConditionalUpdate() { called++; return 1 } }
    await expect(executePlan(row(1), planDeduct(row(1), 5), 5, spy)).rejects.toThrow(/库存不可用/)
    expect(called).toBe(0)
  })
})
