import { describe, expect, it } from "vitest"
import { ReportService } from ".."

describe("ReportService module baseline", () => {
  it("listBoards 返回分页结果", async () => {
    const result = await ReportService.listBoards({ page: 1, pageSize: 20 })
    expect(result.total).toBeGreaterThan(0)
  })

  it("listBoards 关键词过滤生效", async () => {
    const result = await ReportService.listBoards({ page: 1, pageSize: 20, keyword: "销售" })
    expect(result.items.every((b) => b.name.includes("销售") || (b.description ?? "").includes("销售"))).toBe(true)
  })

  it("exportBoard 不存在时抛出错误", async () => {
    await expect(
      ReportService.exportBoard({ boardId: "not-exist", format: "EXCEL" }),
    ).rejects.toThrow("报表不存在")
  })

  it("exportBoard 禁用报表抛出错误", async () => {
    await expect(
      ReportService.exportBoard({ boardId: "report-board-003", format: "PDF" }),
    ).rejects.toThrow("报表已禁用")
  })

  it("exportBoard 成功返回下载链接", async () => {
    const result = await ReportService.exportBoard({ boardId: "report-board-001", format: "EXCEL" })
    expect(result.downloadUrl).toContain("report-board-001")
    expect(result.format).toBe("EXCEL")
  })
})
