import { describe, expect, it } from "vitest"
import { ImService } from "../im.service"

describe("ImService", () => {
  it("lists conversations", async () => {
    const result = await ImService.listConversations({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
    expect(Array.isArray(result.items)).toBe(true)
  })

  it("audits message", async () => {
    const result = await ImService.auditMessage({
      conversationId: "im-cv-001",
      messageId: "im-msg-001",
      decision: "PASS",
      reason: "内容合规",
    })

    expect(result.messageId).toBe("im-msg-001")
    expect(result.decision).toBe("PASS")
  })
})
