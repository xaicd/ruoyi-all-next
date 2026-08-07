import type { MesPageQueryInput, MesReportWorkInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type MesWorkOrder = {
  id: string
  code: string
  productName: string
  status: "PLANNED" | "RUNNING" | "DONE"
  planQty: number
  doneQty: number
}

const MOCK_WORK_ORDERS: MesWorkOrder[] = [
  { id: "mes-wo-001", code: "WO-202608-001", productName: "伴手礼套盒", status: "RUNNING", planQty: 2000, doneQty: 1200 },
  { id: "mes-wo-002", code: "WO-202608-002", productName: "生态米礼袋", status: "PLANNED", planQty: 1200, doneQty: 0 },
]

export class MesService {
  static async listWorkOrders(input: MesPageQueryInput) {
    domainLog.event("mes.work-order.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const filtered = keyword
      ? MOCK_WORK_ORDERS.filter(
          (item) => item.code.toLowerCase().includes(keyword) || item.productName.toLowerCase().includes(keyword),
        )
      : MOCK_WORK_ORDERS

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async reportWork(input: MesReportWorkInput) {
    const workOrder = MOCK_WORK_ORDERS.find((item) => item.id === input.workOrderId)
    if (!workOrder) {
      throw new Error("工单不存在")
    }

    const nextDoneQty = workOrder.doneQty + input.outputQty
    if (nextDoneQty > workOrder.planQty) {
      throw new Error("报工数量超过计划数量")
    }

    workOrder.doneQty = nextDoneQty
    workOrder.status = workOrder.doneQty >= workOrder.planQty ? "DONE" : "RUNNING"

    domainLog.event("mes.work-order.report", {
      workOrderId: input.workOrderId,
      outputQty: input.outputQty,
      scrapQty: input.scrapQty,
    })
    domainLog.audit("mes.work-order.report", {
      targetType: "MES_WORK_ORDER",
      targetId: input.workOrderId,
      outputQty: input.outputQty,
      scrapQty: input.scrapQty,
    })

    return {
      workOrderId: workOrder.id,
      status: workOrder.status,
      doneQty: workOrder.doneQty,
      outputQty: input.outputQty,
      scrapQty: input.scrapQty,
      note: input.note ?? null,
    }
  }
}
