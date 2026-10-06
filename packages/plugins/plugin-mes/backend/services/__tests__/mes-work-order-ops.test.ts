/**
 * 生产工单状态机 —— 规则忠实地来自源框架，但**修掉了源实现的并发竞态**。
 */
import { runWithTenantContext } from "@/modules/shared/backend/lib/biz-tenant"
import { describe, it, expect, beforeEach } from "vitest"
import { MES_WORK_ORDER_MACHINE, canEditWorkOrder, mesWorkOrderOps } from "../mes-work-order-ops"
import { MesProWorkOrderRepository } from "../../repositories/mes-pro-work-order.repository"
import { validateStateMachine, nextStates } from "@/modules/shared/backend/lib/state-machine"

/** 建单用**库里的数字状态**（MesProWorkOrderStatusEnum: PREPARE=0）——元数据里 status 是 int。 */
async function createWorkOrder(status: number = 0) {
  const row = await MesProWorkOrderRepository.create({ code: `WO-${Date.now()}-${Math.random()}`, name: "测试工单", status })
  return String((row as { id: string }).id)
}

/**
 * 这些用例直接驱动仓储/服务，**必须带租户上下文** —— 业务表 tenant_id 非空
 * （AGENTS §4.8: 租户从全局上下文取）。生成的测试模板本来就会包这一层，
 * 手写的这几个漏了，于是真实库报 `null value in column "tenant_id"`。
 */
const asTenant = <T>(work: () => Promise<T>) => runWithTenantContext({ tenantId: "1" }, work)

describe("mes 工单状态机（移植自源框架）", () => {
  beforeEach(() => {})

  it("状态机定义自洽", () => {
    expect(validateStateMachine(MES_WORK_ORDER_MACHINE)).toEqual([])
  })

  it("规则与源框架一致: PREPARE -> CONFIRMED -> FINISHED，或 CONFIRMED -> CANCELED", () => {
    expect(nextStates(MES_WORK_ORDER_MACHINE, "PREPARE")).toEqual(["CONFIRMED"])
    expect(nextStates(MES_WORK_ORDER_MACHINE, "CONFIRMED").sort()).toEqual(["CANCELED", "FINISHED"])
    expect(nextStates(MES_WORK_ORDER_MACHINE, "FINISHED")).toEqual([])
    expect(nextStates(MES_WORK_ORDER_MACHINE, "CANCELED")).toEqual([])
  })

  it("只有草稿（PREPARE）能编辑/删除（源的另一类规则）", () => {
    expect(canEditWorkOrder("PREPARE")).toBe(true)
    expect(canEditWorkOrder("CONFIRMED")).toBe(false)
    expect(canEditWorkOrder("FINISHED")).toBe(false)
  })

  it("confirm: PREPARE -> CONFIRMED", () => asTenant(async () => {
    const id = await createWorkOrder()
    const updated = await mesWorkOrderOps.confirm(id)
    expect((updated as { status: string }).status).toBe("CONFIRMED")
  }))

  it("confirm 一个已确认的工单 -> 报错（非法迁移，不静默通过）", () => asTenant(async () => {
    const id = await createWorkOrder()
    await mesWorkOrderOps.confirm(id)
    await expect(mesWorkOrderOps.confirm(id)).rejects.toThrow(/非法状态迁移/)
  }))

  it("完成与取消的完整链路", () => asTenant(async () => {
    const a = await createWorkOrder()
    await mesWorkOrderOps.confirm(a)
    expect((await mesWorkOrderOps.finish(a) as { status: string }).status).toBe("FINISHED")

    const b = await createWorkOrder()
    await mesWorkOrderOps.confirm(b)
    expect((await mesWorkOrderOps.cancel(b) as { status: string }).status).toBe("CANCELED")
  }))

  it("草稿不能直接完工（必须先确认）", () => asTenant(async () => {
    const id = await createWorkOrder()
    await expect(mesWorkOrderOps.finish(id)).rejects.toThrow(/非法状态迁移/)
  }))

  it("★ 并发迁移只有一个成功（源实现是「先查再写」，这里靠条件更新）", () => asTenant(async () => {
    const id = await createWorkOrder()
    const results = await Promise.allSettled([mesWorkOrderOps.confirm(id), mesWorkOrderOps.confirm(id)])
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1)
    expect(results.filter((r) => r.status === "rejected")).toHaveLength(1)
    const row = await MesProWorkOrderRepository.findById(id)
    // 仓储返回的是**库里的数字状态**（CONFIRMED=1）——可读状态名只在 ops 的边界上出现
    expect(Number((row as { status: unknown }).status)).toBe(1)
  }))

  it("availableActions 给前端渲染按钮（与后端同一真源）", () => asTenant(async () => {
    expect(mesWorkOrderOps.availableActions("PREPARE")).toMatchObject({ canConfirm: true, canFinish: false, canEdit: true })
    expect(mesWorkOrderOps.availableActions("CONFIRMED")).toMatchObject({ canFinish: true, canCancel: true, canEdit: false })
    expect(mesWorkOrderOps.availableActions("FINISHED")).toMatchObject({ canConfirm: false, canFinish: false, canCancel: false, canEdit: false })
  }))
})
