import { describe, expect, it } from "vitest"
import { MpService } from "../mp.service"

describe("MpService", () => {
  it("lists mp accounts", async () => {
    const result = await MpService.listAccounts({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("lists mp fans", async () => {
    const result = await MpService.listFans({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("sends message", async () => {
    const result = await MpService.sendMessage({ accountId: "mp-001", content: "hello" })
    expect(result.status).toBe("QUEUED")
  })
})
