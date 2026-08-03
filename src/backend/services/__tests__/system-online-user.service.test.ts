import { describe, expect, it } from "vitest"
import { SystemOnlineUserService } from "../system-online-user.service"

describe("SystemOnlineUserService", () => {
  it("returns paged list shape", async () => {
    const result = await SystemOnlineUserService.list({ page: 1, pageSize: 20, keyword: "" })
    expect(result).toHaveProperty("items")
    expect(result).toHaveProperty("total")
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(20)
  })

  it("forceLogout returns session id", async () => {
    const result = await SystemOnlineUserService.forceLogout("SYSTEM", { sessionId: "s-1" })
    expect(result.success).toBe(true)
    expect(result.sessionId).toBe("s-1")
  })
})
