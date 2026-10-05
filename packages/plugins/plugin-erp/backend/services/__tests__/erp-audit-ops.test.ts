/**
 * ERP 审核状态规则 —— 忠实移植自源框架 `ErpAuditStatus` + `ErpPurchaseOrderServiceImpl`。
 */
import { describe, it, expect } from "vitest"
import {
  ERP_AUDIT_MACHINE, auditActions, auditPurchaseOrder, canMutateAuditedDoc, reverseBlockedReason,
} from "../erp-audit-ops"
import { validateStateMachine, nextStates } from "@/modules/shared/backend/lib/state-machine"
import { ErpPurchaseOrderRepository } from "../../repositories/erp-purchase-order.repository"

async function createOrder(status = "PROCESS") {
  const row = await ErpPurchaseOrderRepository.create({ no: `PO-${Date.now()}-${Math.random()}`, status })
  return String((row as { id: string }).id)
}
const statusOf = async (id: string) => String(((await ErpPurchaseOrderRepository.findById(id)) as { status?: unknown } | null)?.status ?? "")

describe("ERP 审核状态规则", () => {
  it("状态机定义自洽；两个状态都不是终态（可以反审核）", () => {
    expect(validateStateMachine(ERP_AUDIT_MACHINE)).toEqual([])
    expect(nextStates(ERP_AUDIT_MACHINE, "PROCESS")).toEqual(["APPROVE"])
    expect(nextStates(ERP_AUDIT_MACHINE, "APPROVE", { inCount: 0, returnCount: 0 })).toEqual(["PROCESS"])
  })

  it("只有未审核（PROCESS）能编辑/删除", () => {
    expect(canMutateAuditedDoc("PROCESS")).toBe(true)
    expect(canMutateAuditedDoc("APPROVE")).toBe(false)
  })

  it("★ 反审核守卫: 已有入库/退货数量时给出**具体原因**，不是笼统失败", () => {
    expect(reverseBlockedReason({ inCount: 0, returnCount: 0 })).toBeNull()
    expect(reverseBlockedReason({ inCount: 5 })).toMatch(/入库|出库/)
    expect(reverseBlockedReason({ returnCount: 1 })).toMatch(/退货/)
  })

  it("★ 守卫生效: 有入库数量时不允许反审核", () => {
    expect(nextStates(ERP_AUDIT_MACHINE, "APPROVE", { inCount: 3 })).toEqual([])
    expect(auditActions("APPROVE", { inCount: 3 }).canUnapprove).toBe(false)
    expect(auditActions("APPROVE", { inCount: 3 }).unapproveBlockedReason).toMatch(/入库/)
  })

  it("审核: PROCESS -> APPROVE", async () => {
    const id = await createOrder()
    expect((await auditPurchaseOrder(id, "APPROVE")).status).toBe("APPROVE")
    expect(await statusOf(id)).toBe("APPROVE")
  })

  it("反审核: APPROVE -> PROCESS（无下游单据时）", async () => {
    const id = await createOrder()
    await auditPurchaseOrder(id, "APPROVE")
    expect((await auditPurchaseOrder(id, "PROCESS")).status).toBe("PROCESS")
  })

  it("★ 重复审核报错（状态非翻转 -> 非法迁移）", async () => {
    const id = await createOrder()
    await auditPurchaseOrder(id, "APPROVE")
    await expect(auditPurchaseOrder(id, "APPROVE")).rejects.toThrow(/非法状态迁移/)
  })

  it("★ 反审核被守卫拦住时**状态没被改动**", async () => {
    const id = await createOrder()
    await auditPurchaseOrder(id, "APPROVE")
    await expect(auditPurchaseOrder(id, "PROCESS", { inCount: 1 })).rejects.toThrow(/入库|出库/)
    expect(await statusOf(id)).toBe("APPROVE")
  })

  it("★ 并发审核只有一个成功", async () => {
    const id = await createOrder()
    const results = await Promise.allSettled([auditPurchaseOrder(id, "APPROVE"), auditPurchaseOrder(id, "APPROVE")])
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1)
    expect(await statusOf(id)).toBe("APPROVE")
  })

  it("auditActions 给前端渲染按钮（与后端同一真源）", () => {
    expect(auditActions("PROCESS")).toMatchObject({ canApprove: true, canEdit: true, canUnapprove: false })
    expect(auditActions("APPROVE", { inCount: 0 })).toMatchObject({ canUnapprove: true, canEdit: false })
  })
})
