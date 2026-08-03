import { describe, expect, it } from "vitest"
import { CrmService } from "../crm.service"

describe("CrmService", () => {
  it("lists customers", async () => {
    const result = await CrmService.listCustomers({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("lists clues", async () => {
    const result = await CrmService.listClues({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("creates followup", async () => {
    const result = await CrmService.createFollowup({ customerId: "cus-001", content: "已电话跟进" })
    expect(result.status).toBe("RECORDED")
  })
})
