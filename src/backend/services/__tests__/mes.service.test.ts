import { describe, expect, it } from "vitest"
import { MesService } from "../mes.service"

describe("MesService", () => {
  it("lists work orders", async () => {
    const result = await MesService.listWorkOrders({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("reports work", async () => {
    const result = await MesService.reportWork({ workOrderId: "mes-wo-001", outputQty: 20, scrapQty: 1, note: "班次报工" })
    expect(result.workOrderId).toBe("mes-wo-001")
    expect(result.outputQty).toBe(20)
  })
})
