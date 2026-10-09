import { describe, expect, it } from "vitest"
import { MesService } from ".."

describe("MesService plugin baseline", () => {
  it("has list capability", async () => {
    const result = await MesService.listWorkOrders({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
  })
})
