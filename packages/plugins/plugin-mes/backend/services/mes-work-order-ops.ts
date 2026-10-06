/**
 * mes 生产工单的状态迁移（**手写资产**，不放进生成的 Service —— 那会被重生成覆盖）。
 *
 * 规则**忠实移植**自源框架 `MesProWorkOrderServiceImpl`:
 *
 *   | 动作   | 前置状态  | 目标      |
 *   |--------|-----------|-----------|
 *   | confirm| PREPARE   | CONFIRMED |
 *   | finish | CONFIRMED | FINISHED  |
 *   | cancel | CONFIRMED | CANCELED  |
 *   | 编辑 / 删除 | **仅 PREPARE** | —— |
 *
 * 移植时做了一处**修正**（不是照抄）: 源实现是"先查状态 -> 再写状态"，
 * 并发下两个 confirm 会**双双通过检查**、各写一次。这里把前置状态写进
 * **同一条 UPDATE 的 WHERE**（条件更新），影响 0 行即视为并发冲突 -> 抛错。
 * 与库存、支付回调用的是同一套思路。
 */

import { eqColumn, hasRealDatabase, joinAnd, updateDynamicRow } from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId } from "@/modules/shared/backend/lib/biz-tenant"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { assertTransition, defineStateMachine, nextStates, type StateMachine } from "@/modules/shared/backend/lib/state-machine"
import { MesProWorkOrderRepository } from "../repositories/mes-pro-work-order.repository"

export type WorkOrderStatus = "PREPARE" | "CONFIRMED" | "FINISHED" | "CANCELED"

export const MES_WORK_ORDER_MACHINE: StateMachine<WorkOrderStatus> = defineStateMachine({
  name: "mes-work-order",
  states: ["PREPARE", "CONFIRMED", "FINISHED", "CANCELED"] as const,
  terminal: ["FINISHED", "CANCELED"] as const,
  transitions: [
    { from: "PREPARE", to: "CONFIRMED", action: "confirm" },
    { from: "CONFIRMED", to: "FINISHED", action: "finish" },
    { from: "CONFIRMED", to: "CANCELED", action: "cancel" },
  ],
})

const TABLE_NAME = "mes_pro_work_order"

/**
 * 状态在**库里是 Integer**（源框架 `MesProWorkOrderStatusEnum`: PREPARE=0 / CONFIRMED=1 /
 * FINISHED=2 / CANCELED=3）—— 可读状态名是内部表达，**存储边界**负责翻译。
 * 早先直接写 "PREPARE"，真实库报 `invalid input syntax for type integer: "PROCESS"`。
 */
const STATUS_TO_DB: Record<WorkOrderStatus, number> = { PREPARE: 0, CONFIRMED: 1, FINISHED: 2, CANCELED: 3 }
const DB_TO_STATUS: Record<number, WorkOrderStatus> = { 0: "PREPARE", 1: "CONFIRMED", 2: "FINISHED", 3: "CANCELED" }

/** 库里的数字状态 -> 可读状态名（外部读到时用）。 */
function readStatus(value: unknown): string {
  const asNumber = Number(value)
  return DB_TO_STATUS[asNumber] ?? String(value ?? "")
}

/**
 * 内存回退的串行化队列。
 *
 * 真实库靠**条件更新**保证并发安全（`WHERE status = 前置`，0 行即冲突）。
 * 内存回退没有这个能力: 两个调用都会在对方写入前读到旧状态，双双通过 —— 就是竞态本身。
 * 本仓 §4.8 要求"内存与真实库同语义"，所以这里按 id 串行化，把窗口关掉。
 * （仅内存路径；真实库不受影响）
 */
const memoryQueues = new Map<string, Promise<unknown>>()

function serialize<T>(id: string, work: () => Promise<T>): Promise<T> {
  const previous = memoryQueues.get(id) ?? Promise.resolve()
  const next = previous.then(work, work)
  memoryQueues.set(id, next.catch(() => undefined))
  return next
}

/** 源实现的另一类规则: **只有草稿（PREPARE）能被编辑/删除**。 */
export function canEditWorkOrder(status: WorkOrderStatus | string): boolean {
  return status === "PREPARE"
}

function tenantPredicate() {
  const tenantId = getCurrentTenantId()
  return tenantId ? eqColumn("tenant_id", tenantId) : eqColumn("id", "__none__")
}

/**
 * 原子状态迁移: `WHERE id = ? AND status = <前置>`，0 行即并发冲突。
 *
 * 这一步是**修掉源实现竞态**的关键 —— 先查再写在并发下不安全。
 */
async function applyTransition(id: string, from: WorkOrderStatus, to: WorkOrderStatus, action: string, patch: Record<string, unknown> = {}) {
  const existing = await MesProWorkOrderRepository.findById(id)
  if (!existing) throw new ApiError("NOT_FOUND", `工单不存在: ${id}`)

  const current = readStatus((existing as { status?: unknown }).status)
  // 先做**快速失败**（给调用方明确原因），再做并发安全的落地
  assertTransition(MES_WORK_ORDER_MACHINE, current as WorkOrderStatus, to, { action })

  if (!hasRealDatabase()) {
    // 内存回退: 串行化 + 重新核对，与 SQL 的条件更新同语义（§4.8）
    return serialize(id, async () => {
      const latest = await MesProWorkOrderRepository.findById(id)
      const latestStatus = readStatus((latest as { status?: unknown } | null)?.status)
      if (latestStatus !== from) {
        throw new ApiError("CONFLICT", `工单状态已被并发修改（期望 ${from}，实际 ${latestStatus}）`)
      }
      const row = (await MesProWorkOrderRepository.update(id, { status: STATUS_TO_DB[to as WorkOrderStatus], ...patch } as never)) as Record<string, unknown>
      // 出口同样归一: 库里是数字，对外给可读状态名（与 readStatus 对称）
      return { ...row, status: readStatus(row?.status) }
    })
  }

  const where = joinAnd([eqColumn("id", id), eqColumn("status", STATUS_TO_DB[from]), tenantPredicate()])
  const updated = await updateDynamicRow(TABLE_NAME, { status: STATUS_TO_DB[to as WorkOrderStatus], ...patch }, where)
  if (!updated) {
    // 影响 0 行 = 有人在我们读取之后改了状态
    throw new ApiError("CONFLICT", `工单状态已被并发修改（期望 ${from}）`)
  }
  return { ...updated, status: readStatus((updated as { status?: unknown }).status) }
}

export const mesWorkOrderOps = {
  /** 确认工单: PREPARE -> CONFIRMED */
  confirm(id: string) {
    return applyTransition(id, "PREPARE", "CONFIRMED", "confirm")
  },

  /** 完工: CONFIRMED -> FINISHED */
  finish(id: string) {
    return applyTransition(id, "CONFIRMED", "FINISHED", "finish", { finish_date: new Date().toISOString() })
  },

  /** 取消: CONFIRMED -> CANCELED */
  cancel(id: string) {
    return applyTransition(id, "CONFIRMED", "CANCELED", "cancel", { cancel_date: new Date().toISOString() })
  },

  /** 当前状态还能做什么（给前端渲染按钮用，与后端同一个真源） */
  availableActions(status: WorkOrderStatus | string) {
    const targets = nextStates(MES_WORK_ORDER_MACHINE, status as WorkOrderStatus)
    return {
      canEdit: canEditWorkOrder(status),
      canDelete: canEditWorkOrder(status),
      canConfirm: targets.includes("CONFIRMED"),
      canFinish: targets.includes("FINISHED"),
      canCancel: targets.includes("CANCELED"),
    }
  },
}
