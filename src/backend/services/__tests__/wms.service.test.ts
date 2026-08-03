import { describe, expect, it } from "vitest"
import { WmsService } from "../wms.service"

describe("WmsService", () => {
  it("lists warehouses", async () => {
    const result = await WmsService.listWarehouses({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("checkins goods", async () => {
    const result = await WmsService.checkin({ warehouseId: "wms-wh-001", quantity: 10, note: "测试入库" })
    expect(result.warehouseId).toBe("wms-wh-001")
    expect(result.quantity).toBe(10)
  })
})
