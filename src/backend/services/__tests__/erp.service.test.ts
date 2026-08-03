import { describe, expect, it } from "vitest"
import { ErpService } from "../erp.service"

describe("ErpService", () => {
  it("lists products", async () => {
    const result = await ErpService.listProducts({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("lists orders", async () => {
    const result = await ErpService.listOrders({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("adjusts stock", async () => {
    const result = await ErpService.adjustStock({ productId: "erp-p-001", delta: -5, reason: "盘点差异" })
    expect(result.productId).toBe("erp-p-001")
    expect(result.delta).toBe(-5)
  })
})
