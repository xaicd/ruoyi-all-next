/**
 * 库存操作（wms 域的**手写**落点）。
 *
 * 把 `inventory-invariant.ts` 的纯决策接到真实存储上。两条路径**必须同语义**
 * （AGENTS §4.8）:
 *   - 真实库: 单条带 guard 的 UPDATE（`mutateColumnAtomic`），影响行数即成败
 *   - 内存回退: 用同样的 guard 判定后改内存值
 * 只做"先查再判断再写"会在并发下双双通过检查 —— 超卖，所以真实库路径
 * 必须走条件更新，不能退化成读改写。
 *
 * 为什么手写: 域里的 Service/Repository 都是生成产物（重生成会覆盖）。
 */

import {
  alwaysTrue,
  comparePredicate,
  eqColumn,
  hasRealDatabase,
  joinAnd,
  mutateColumnAtomic,
} from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId, isPlatformContext, isTenantRequired } from "@/modules/shared/backend/lib/biz-tenant"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import {
  executePlan,
  planDeduct,
  planLock,
  planRelease,
  planReplenish,
  type InventoryRow,
  type StockMutationKind,
  type StockMutationPlan,
  type StockMutationOptions,
} from "./inventory-invariant"
import { WmsInventoryRepository } from "../repositories/wms-inventory.repository"
import { wmsStockOpSchema } from "../validators/inventory-op.validator"

const TABLE_NAME = "wms_inventory"

/**
 * 租户隔离条件。与生成仓储的 `scopedWhere` 同语义:
 * 有上下文就过滤；`TENANT_MODE=required` 且无上下文直接抛错（把"静默全量"变成显性 bug）。
 */
function tenantPredicate() {
  const tenantId = getCurrentTenantId()
  if (!tenantId && hasRealDatabase() && isTenantRequired() && !isPlatformContext()) {
    throw new ApiError("FORBIDDEN", "业务数据访问缺少租户上下文")
  }
  return tenantId ? eqColumn("tenant_id", tenantId) : alwaysTrue()
}

/** 把不变量给出的 guard 契约翻成真实条件（两者必须一致，改一处要改两处）。 */
function guardPredicate(plan: StockMutationPlan, amount: number, options: StockMutationOptions) {
  // guard 的"要不要加"由 planner 算好（guardApplies），这里不二次推理
  if (!plan.conditionalUpdate.guardApplies) return alwaysTrue()
  if (plan.kind === "deduct") return comparePredicate("qty", amount, ">=")
  if (plan.kind === "lock") return comparePredicate("qty", amount, ">=")
  if (plan.kind === "release") return comparePredicate("locked_qty", amount, ">=")
  return alwaysTrue()
}

/** 内存回退的守卫判定（与 SQL 的 guard 同语义）。 */
function memoryGuardPasses(row: InventoryRow, plan: StockMutationPlan, amount: number, options: StockMutationOptions): boolean {
  if (plan.kind === "deduct") return options.allowNegative ? true : row.qty >= amount
  if (plan.kind === "lock") return row.qty - row.lockedQty >= amount
  if (plan.kind === "release") return row.lockedQty >= amount
  return true
}

export const inventoryStockOps = {
  /**
   * 统一入口: 读当前库存 -> 纯函数规划（快速失败）-> **条件更新**（并发安全）。
   *
   * `kind` 必须**显式**给出。不能用 delta 的正负去猜 —— `lock` 与 `replenish`
   * 都是正数，猜错会把"预占"写成"入库"，而且不报错。
   */
  async apply(
    inventoryId: string,
    kind: StockMutationKind,
    amount: number,
    options: StockMutationOptions = {},
  ): Promise<{ qty: number; lockedQty: number }> {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ApiError("VALIDATION_ERROR", `库存变更数量必须是正数: ${amount}`)
    }
    const current = await WmsInventoryRepository.findById(inventoryId)
    if (!current) throw new ApiError("NOT_FOUND", `库存记录不存在: ${inventoryId}`)
    const row: InventoryRow = {
      id: inventoryId,
      qty: Number((current as { qty?: unknown }).qty ?? 0),
      lockedQty: Number((current as { lockedQty?: unknown }).lockedQty ?? 0),
    }
    const plan =
      kind === "deduct" ? planDeduct(row, amount, options)
        : kind === "replenish" ? planReplenish(row, amount)
          : kind === "lock" ? planLock(row, amount)
            : planRelease(row, amount)

    return executePlan(row, plan, amount, {
      applyConditionalUpdate: async (_id, executed, appliedAmount) => {
        const column = executed.conditionalUpdate.column
        const signed =
          executed.kind === "deduct" ? -appliedAmount
            : executed.kind === "release" ? -appliedAmount
              : appliedAmount

        if (!hasRealDatabase()) {
          // 内存回退: 同语义守卫（与 SQL guard 一一对应）
          if (!memoryGuardPasses(row, executed, appliedAmount, options)) return 0
          const nextLocked =
            executed.kind === "lock" ? row.lockedQty + appliedAmount
              : executed.kind === "release" ? row.lockedQty - appliedAmount
                : row.lockedQty
          const nextQty =
            executed.kind === "deduct" ? row.qty - appliedAmount
              : executed.kind === "replenish" ? row.qty + appliedAmount
                : row.qty
          await WmsInventoryRepository.update(inventoryId, { qty: nextQty, lockedQty: nextLocked } as never)
          return 1
        }
        const predicates = [eqColumn("id", inventoryId), tenantPredicate(), guardPredicate(executed, appliedAmount, options)].filter((item): item is NonNullable<typeof item> => item != null)
        const where = joinAnd(predicates)
        return mutateColumnAtomic(TABLE_NAME, column, signed, where)
      },
    })
  },

  /** 出库/消耗: 按**在库量**判断 */
  deduct(inventoryId: string, amount: number, options: StockMutationOptions = {}) {
    return this.apply(inventoryId, "deduct", amount, options)
  },

  /** 入库/补货 */
  replenish(inventoryId: string, amount: number) {
    return this.apply(inventoryId, "replenish", amount)
  },

  /** 预占（下单未出库）: 按**可用量**判断 */
  lock(inventoryId: string, amount: number) {
    return this.apply(inventoryId, "lock", amount)
  },

  /** 释放预占 */
  release(inventoryId: string, amount: number) {
    return this.apply(inventoryId, "release", amount)
  },

  // ---- 跨域入口（payload 形状）----
  // broker 派发调用的是 target(payload)，且按 holder[method] 查找 —— 所以这几个
  // 必须挂在**本对象上**，名字与 rpc-actions.json 的 method 一致。
  // 位置参数那套（deduct/lock/...）保留给同进程直接调用。

  /** 出库/消耗（erp/mes 等经 Facade 调本方法，不各自实现扣减） */
  deductStock(payload: unknown) {
    return handleStockOp(payload, "deduct", true)
  },
  lockStock(payload: unknown) {
    return handleStockOp(payload, "lock")
  },
  releaseStock(payload: unknown) {
    return handleStockOp(payload, "release")
  },
  replenishStock(payload: unknown) {
    return handleStockOp(payload, "replenish")
  },
}

/**
 * **RPC 形状的入口**（跨域调用走这几个）。
 *
 * 为什么必须单独一层: broker 派发调用的是 `target(payload)` —— **只传一个对象**。
 * 把 `deduct(inventoryId, amount, options)` 直接挂上去，payload 会被当成 inventoryId
 * 收下，然后静默做错事。这里显式校验后转给位置参数的 API。
 */
async function handleStockOp(payload: unknown, kind: "deduct" | "lock" | "release" | "replenish", allowNegativeFromPayload = false) {
  // broker 的调用约定: 派发过来的是**请求对象**，业务入参在 `.data` 里
  // （生成的 rpc 模板用的就是 `req.data`）。直接当业务对象解包会取到 undefined，
  // 表现为"数量必须为正: undefined"。
  const request = (payload ?? {}) as { data?: unknown }
  const parsed = wmsStockOpSchema.safeParse(request.data ?? payload)
  if (!parsed.success) {
    throw new ApiError("VALIDATION_ERROR", `库存操作入参非法: ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join("; ")}`)
  }
  const { inventoryId, amount, allowNegative } = parsed.data
  return inventoryStockOps.apply(inventoryId, kind, amount, allowNegativeFromPayload && allowNegative ? { allowNegative: true } : {})
}

/** 供测试与调用方直接使用纯函数（不碰存储）。 */
export { planDeduct, planReplenish, planLock, planRelease }
