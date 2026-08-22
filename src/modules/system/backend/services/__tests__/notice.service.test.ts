import { describe, expect, it } from "vitest"
import { NoticeService } from "../notice.service"

describe("NoticeService persistence", () => {
  it("creates, pages, and deletes without MOCK_DATA", async () => {
    const created = await NoticeService.create({ title: `notice-${Date.now()}`, content: "body", type: "INFO" })
    expect(created.id).toBeTruthy()
    const page = await NoticeService.page({ page: 1, pageSize: 50, keyword: "notice-" })
    expect(page.items.some((item) => item.id === created.id)).toBe(true)
    await NoticeService.delete(created.id)
    await expect(NoticeService.get(created.id)).rejects.toThrow("通知不存在")
  })
})
