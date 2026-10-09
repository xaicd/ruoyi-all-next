import { describe, expect, it } from "vitest"
import { WmsService } from ".."

describe("WmsService plugin baseline", () => {
  it("has list capability", async () => {
    const result = await WmsService.listWarehouses({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
  })
})
