/**
 * 库存不变量（wms 是库存的归属域；erp/mes 需要扣减时应经 Facade 调本域，不得各自实现）。
 *
 * 从源框架 `ErpStockServiceImpl.updateStockCountIncrement` 忠实移植，并按本仓模型扩展:
 * 本仓的 `wms_inventory` 比源的单一 `count` 多一层**预占**（`locked_qty`），
 * 所以可用量 = `qty - locked_qty`。
 *
 * ## 为什么不能只做"先查后判断"
 *
 * 源实现里"查当前库存 → 判断是否充足"只是**快速失败**，真正保证安全的是那句**条件更新**
 * （`WHERE id = ? AND count >= |delta|`，影响 0 行即视为不足）。
 * 只做前者的话，两个并发出库会**双双通过检查**，各自扣一次 —— 超卖。
 * 所以本模块把决策写成**纯函数**，把"必须在一条 SQL 里完成"的要求写成显式契约
 * （见 `StockMutationPlan.conditionalUpdate`），让适配器的实现无处可躲。
 *
 * 手写资产: 不放进生成的 Service/Repository 里（那两个会被重生成覆盖）。
 */

export interface InventoryRow {
  id: string
  /** 实际在库数量 */
  qty: number
  /** 已预占（下单未出库）数量 */
  lockedQty: number
}

export interface StockMutationOptions {
  /**
   * 是否允许负库存。源实现里是常量 `NEGATIVE_STOCK_COUNT_ENABLE = false`；
   * 这边做成参数，因为不同业务（如先出后补的寄售）确实需要打开。
   */
  allowNegative?: boolean
}

export type StockMutationKind = "deduct" | "replenish" | "lock" | "release"

export interface StockMutationPlan {
  kind: StockMutationKind
  /** 是否允许执行。false 时 `reason` 说明原因，调用方应转成 409/400 而不是静默跳过 */
  allowed: boolean
  reason?: "insufficient-qty" | "insufficient-available" | "invalid-delta" | "locked-below-zero"
  /** 执行后的期望值（仅供日志/返回，**不作为写入依据** —— 写入必须走条件更新） */
  nextQty: number
  nextLockedQty: number
  /**
   * 条件更新的语义契约。适配器必须实现为**单条**带条件的 UPDATE，并返回影响行数:
   *
   *   deduct    : SET qty = qty - |delta|          WHERE id = ? AND qty >= |delta|
   *   replenish : SET qty = qty + |delta|          WHERE id = ?
   *   lock      : SET locked_qty = locked_qty + |delta|
   *                WHERE id = ? AND (qty - locked_qty) >= |delta|
   *   release   : SET locked_qty = locked_qty - |delta|
   *                WHERE id = ? AND locked_qty >= |delta|
   *
   * **影响 0 行必须抛错**（并发下别人先拿走了），不能当作成功。
   */
  conditionalUpdate: {
    column: "qty" | "locked_qty"
    guard: string
    /**
     * **要不要应用上面的 guard**（由 planner 结合 options 算好的**判定结果**）。
     *
     * 早先这里放的是"负库存打开时放宽"这种**条件性描述**，执行器拿到 plan 后
     * 无从判断该不该加 guard（它并不知道 allowNegative）—— 契约缺口，实测被测试抓到。
     * 现在只给结果，不给需要二次推理的描述。
     */
    guardApplies: boolean
  }
}

/** 可用量 = 在库 - 已预占。可能为负（数据异常），调用方按负值处理。 */
export function availableQty(row: Pick<InventoryRow, "qty" | "lockedQty">): number {
  return row.qty - row.lockedQty
}

function invalid(kind: StockMutationKind, row: InventoryRow, reason: StockMutationPlan["reason"]): StockMutationPlan {
  return {
    kind,
    allowed: false,
    reason,
    nextQty: row.qty,
    nextLockedQty: row.lockedQty,
    conditionalUpdate: { column: kind === "lock" || kind === "release" ? "locked_qty" : "qty", guard: "invalid-delta", guardApplies: true },
  }
}

/**
 * 出库/消耗：按**在库量**判断（预占的货已经算作要走的了）。
 *
 * `amount` 必须是**正数**，表示"扣多少"。刻意不接受负数 —— 符号写错时
 * 静默变成反向操作是最危险的失败方式，宁可报参数错。
 */
export function planDeduct(row: InventoryRow, amount: number, options: StockMutationOptions = {}): StockMutationPlan {
  if (!Number.isFinite(amount) || amount <= 0) return invalid("deduct", row, "invalid-delta")
  if (!options.allowNegative && row.qty < amount) return invalid("deduct", row, "insufficient-qty")
  return {
    kind: "deduct",
    allowed: true,
    nextQty: row.qty - amount,
    nextLockedQty: row.lockedQty,
    conditionalUpdate: {
      column: "qty",
      guard: `qty >= ${amount}`,
      // 允许负库存时就不加 guard —— 结果在这里算好，执行器直接用
      guardApplies: !options.allowNegative,
    },
  }
}

/** 入库/补货：无条件允许（负库存开关对它无意义）。 */
export function planReplenish(row: InventoryRow, amount: number): StockMutationPlan {
  if (!Number.isFinite(amount) || amount <= 0) return invalid("replenish", row, "invalid-delta")
  return {
    kind: "replenish",
    allowed: true,
    nextQty: row.qty + amount,
    nextLockedQty: row.lockedQty,
    conditionalUpdate: { column: "qty", guard: "1 = 1", guardApplies: false },
  }
}

/** 预占（下单未出库）：按**可用量**判断，不能占别人已占的。 */
export function planLock(row: InventoryRow, amount: number): StockMutationPlan {
  if (!Number.isFinite(amount) || amount <= 0) return invalid("lock", row, "invalid-delta")
  if (availableQty(row) < amount) return invalid("lock", row, "insufficient-available")
  return {
    kind: "lock",
    allowed: true,
    nextQty: row.qty,
    nextLockedQty: row.lockedQty + amount,
    conditionalUpdate: {
      column: "locked_qty",
      guard: `(qty - locked_qty) >= ${amount}`,
      guardApplies: true,
    },
  }
}

/** 释放预占（取消订单）。不允许把 locked_qty 放成负数。 */
export function planRelease(row: InventoryRow, amount: number): StockMutationPlan {
  if (!Number.isFinite(amount) || amount <= 0) return invalid("release", row, "invalid-delta")
  if (row.lockedQty < amount) return invalid("release", row, "locked-below-zero")
  return {
    kind: "release",
    allowed: true,
    nextQty: row.qty,
    nextLockedQty: row.lockedQty - amount,
    conditionalUpdate: {
      column: "locked_qty",
      guard: `locked_qty >= ${amount}`,
      guardApplies: true,
    },
  }
}

/**
 * 执行库存变更的适配器契约。
 *
 * 返回**影响行数**：0 行 = 条件不满足（并发下被别人先拿走了），调用方必须抛错。
 * 刻意不提供"直接 setQty"的接口 —— 那会绕过条件更新，把超卖的口子重新打开。
 */
export interface StockMutationExecutor {
  /** 按 plan.conditionalUpdate 的语义执行单条条件 UPDATE，返回影响行数 */
  applyConditionalUpdate(inventoryId: string, plan: StockMutationPlan, amount: number): Promise<number>
}

export class InsufficientStockError extends Error {
  constructor(
    readonly inventoryId: string,
    readonly kind: StockMutationKind,
    message: string,
  ) {
    super(message)
    this.name = "InsufficientStockError"
  }
}

/**
 * 执行一个已规划好的变更。并发安全的落点就是这里:
 * 规划通过**不代表**成功 —— 必须看条件更新返回的行数。
 *
 * **刻意要求显式传入 plan，而不是靠 delta 的正负去猜操作类型**:
 * `lock` 与 `replenish` 都是正数，靠符号推断会把"预占"错当成"入库"（我在写这版时
 * 真踩了），而那种错误不会报错，只会静默把库存改错。
 */
export async function executePlan(
  row: InventoryRow,
  plan: StockMutationPlan,
  amount: number,
  executor: StockMutationExecutor,
): Promise<{ qty: number; lockedQty: number }> {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new InsufficientStockError(row.id, plan.kind, `库存变更数量非法: ${amount}`)
  }
  if (!plan.allowed) {
    throw new InsufficientStockError(row.id, plan.kind, `库存不可用（${plan.reason}）: inventory=${row.id}`)
  }
  const affected = await executor.applyConditionalUpdate(row.id, plan, amount)
  if (affected === 0) {
    // 关键: 规划时够，落地时不够（并发）。这里必须报错，不能当成功。
    throw new InsufficientStockError(row.id, plan.kind, `库存变更未生效（并发下条件不满足）: inventory=${row.id}`)
  }
  return { qty: plan.nextQty, lockedQty: plan.nextLockedQty }
}
