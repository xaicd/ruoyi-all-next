import { describe, expect, it } from "vitest"
import { ImService } from ".."

describe("ImService module baseline", () => {
  it("has list capability", async () => {
    const result = await ImService.listConversations({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
  })
})
