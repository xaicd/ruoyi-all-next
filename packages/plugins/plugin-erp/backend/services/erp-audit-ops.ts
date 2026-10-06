/**
 * ERP 单据的**审核状态**规则（采购单 / 采购入库 / 销售单 / 销售出库 / 销售退货 共用）。
 *
 * 忠实移植自源框架 `ErpAuditStatus` 与 `ErpPurchaseOrderServiceImpl`:
 *
 *   PROCESS(10) 未审核  <-->  APPROVE(20) 已审核
 *
 *   * 审核/反审核必须是**状态翻转**（重复审核报错）
 *   * **反审核有额外守卫**: 已经产生入库/退货数量时不允许反审核
 *     （否则下游单据会指向一个"未审核"的上游 —— 数据自相矛盾）
 *   * 只有 **PROCESS** 可编辑/删除
 *
 * 一处**如实说明**（不套用上次的结论）: 源实现的 `updateByIdAndStatus(id, 期望旧状态, 新状态)`
 * **本身就是条件更新**（影响 0 行即报错），并发下是安全的 —— 这里**没有**竞态要修，
 * 与本仓 mes 工单那次不同（那次确实是"先查再写"）。
 */

import { ApiError } from "@/modules/shared/backend/http/api-error"
import { assertTransition, defineStateMachine, nextStates, type StateMachine } from "@/modules/shared/backend/lib/state-machine"

export type ErpAuditStatus = "PROCESS" | "APPROVE"

/** 反审核时要检查的下游数量 —— 各单据字段名不同，由调用方给出。 */
export interface ReverseGuardContext {
  /** 已入库/已出库数量 */
  inCount?: number
  /** 已退货数量 */
  returnCount?: number
}

export const ERP_AUDIT_MACHINE: StateMachine<ErpAuditStatus> = defineStateMachine({
  name: "erp-audit",
  states: ["PROCESS", "APPROVE"] as const,
  // 两者都不是终态 —— 审核可反审核（有守卫），这是 ERP 的常见需求
  terminal: [] as const,
  transitions: [
    { from: "PROCESS", to: "APPROVE", action: "approve" },
    {
      from: "APPROVE",
      to: "PROCESS",
      action: "unapprove",
      // ★ 守卫式反向迁移: 已产生下游数量时不允许反审核
      guard: (ctx) => {
        const context = (ctx ?? {}) as ReverseGuardContext
        return Number(context.inCount ?? 0) <= 0 && Number(context.returnCount ?? 0) <= 0
      },
    },
  ],
})

/** 只有未审核（PROCESS）的单据能编辑/删除 —— 与源实现的守卫一致。 */
export function canMutateAuditedDoc(status: ErpAuditStatus | string): boolean {
  return status === "PROCESS"
}

/** 反审核被拒的原因（用于给出可读错误，而不是笼统失败）。 */
export function reverseBlockedReason(context: ReverseGuardContext): string | null {
  if (Number(context.inCount ?? 0) > 0) return "已存在入库/出库记录，无法反审核"
  if (Number(context.returnCount ?? 0) > 0) return "已存在退货记录，无法反审核"
  return null
}

/**
 * 存储适配器 —— 由**各单据**提供自己的仓储操作。
 *
 * 为什么不让本模块直接拿表名去写: 那会绕过仓储的内存回退（本仓 §4.8 要求
 * 内存与真实库同语义），测试里也没法驱动。让调用方交出这两个动作，
 * 规则与存储就分开了，两边都能单独验证。
 */
export interface AuditStore {
  findById(id: string): Promise<{ status?: unknown } | null>
  /**
   * **条件**置状态: 仅当当前状态仍等于 `expectedFrom` 时才写入，返回是否成功。
   * 真实库应实现为 `UPDATE ... WHERE id = ? AND status = <expectedFrom>`（0 行即失败）；
   * 内存实现必须**串行化**后重新核对 —— 否则两个并发审核会双双通过。
   */
  setStatusIfCurrent(id: string, expectedFrom: ErpAuditStatus, next: ErpAuditStatus): Promise<boolean>
}

/**
 * 审核 / 反审核（守卫 + 条件更新）。
 *
 * 真正保证并发安全的是 `store.setStatusIfCurrent` 的**条件**语义 ——
 * 本函数只负责规则判定（那是纯的、可单测的部分）。
 */
export async function applyAuditStatus(
  store: AuditStore,
  id: string,
  next: ErpAuditStatus,
  context: ReverseGuardContext = {},
): Promise<{ status: ErpAuditStatus }> {
  const reverseReason = next === "PROCESS" ? reverseBlockedReason(context) : null
  if (reverseReason) throw new ApiError("CONFLICT", reverseReason)

  const existing = await store.findById(id)
  if (!existing) throw new ApiError("NOT_FOUND", `单据不存在: ${id}`)
  const current = String(existing.status ?? "")

  // 状态机判定（守卫在机内再校验一次 —— 单一真源）
  assertTransition(ERP_AUDIT_MACHINE, current as ErpAuditStatus, next, {
    action: next === "APPROVE" ? "approve" : "unapprove",
    context,
  })

  const ok = await store.setStatusIfCurrent(id, current as ErpAuditStatus, next)
  if (!ok) {
    // 影响 0 行 = 状态在我们读取之后被改（重复审核 / 并发）
    throw new ApiError("CONFLICT", next === "APPROVE" ? "审核失败：状态已变更" : "反审核失败：状态已变更")
  }
  return { status: next }
}


/** 当前状态可做什么（前端渲染按钮，与后端同一真源）。 */
export function auditActions(status: ErpAuditStatus | string, context: ReverseGuardContext = {}) {
  const targets = nextStates(ERP_AUDIT_MACHINE, status as ErpAuditStatus, context)
  return {
    canEdit: canMutateAuditedDoc(status),
    canDelete: canMutateAuditedDoc(status),
    canApprove: targets.includes("APPROVE"),
    canUnapprove: targets.includes("PROCESS"),
    unapproveBlockedReason: status === "APPROVE" ? reverseBlockedReason(context) : null,
  }
}

/* ================= 采购订单的接入（示范 + 真实使用） ================= */

import { eqColumn as eqCol, hasRealDatabase as hasDb, joinAnd as andAll, updateDynamicRow as updateRow } from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId as currentTenant } from "@/modules/shared/backend/lib/biz-tenant"
import { ErpPurchaseOrderRepository } from "../repositories/erp-purchase-order.repository"

/** 内存路径按 id 串行化 —— 真实库有条件更新，内存没有（§4.8 要求同语义）。 */
const auditQueues = new Map<string, Promise<unknown>>()
function serialize<T>(id: string, work: () => Promise<T>): Promise<T> {
  const previous = auditQueues.get(id) ?? Promise.resolve()
  const next = previous.then(work, work)
  auditQueues.set(id, next.catch(() => undefined))
  return next
}

const PURCHASE_ORDER_TABLE = "erp_purchase_order"

/**
 * 状态在**库里是 Integer**（源框架 `ErpAuditStatus`: PROCESS=10 / APPROVE=20）——
 * 可读的状态名是我们内部的表达，**存储边界**负责翻译。
 * 早先直接把 "PROCESS" 写进去，真实库报 `invalid input syntax for type integer: "PROCESS"`
 * （内存回退不校验类型，所以只有真实库暴露）。
 */
const AUDIT_TO_DB: Record<ErpAuditStatus, number> = { PROCESS: 10, APPROVE: 20 }
const DB_TO_AUDIT: Record<number, ErpAuditStatus> = { 10: "PROCESS", 20: "APPROVE" }

/** 采购订单的存储适配器。 */
export const purchaseOrderAuditStore: AuditStore = {
  async findById(id) {
    const row = (await ErpPurchaseOrderRepository.findById(id)) as { status?: unknown } | null
    if (!row) return null
    // 出库边界翻译: 库里的 10/20 -> 可读状态名
    return { ...row, status: DB_TO_AUDIT[Number(row.status)] ?? row.status }
  },

  async setStatusIfCurrent(id, expectedFrom, next) {
    const dbNext = AUDIT_TO_DB[next]
    if (!hasDb()) {
      return serialize(id, async () => {
        const latest = (await ErpPurchaseOrderRepository.findById(id)) as { status?: unknown } | null
        if (DB_TO_AUDIT[Number(latest?.status)] !== expectedFrom) return false
        await ErpPurchaseOrderRepository.update(id, { status: dbNext } as never)
        return true
      })
    }
    const tenantId = currentTenant()
    const updated = await updateRow(
      PURCHASE_ORDER_TABLE,
      { status: dbNext },
      andAll([eqCol("id", id), eqCol("status", AUDIT_TO_DB[expectedFrom]), tenantId ? eqCol("tenant_id", tenantId) : eqCol("id", id)]),
    )
    return Boolean(updated)
  },
}

/** 采购订单: 审核 / 反审核。 */
export function auditPurchaseOrder(id: string, next: ErpAuditStatus, context: ReverseGuardContext = {}) {
  return applyAuditStatus(purchaseOrderAuditStore, id, next, context)
}
