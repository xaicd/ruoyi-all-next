import type { ReportPageQueryInput, ReportExportInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type ReportBoard = {
  id: string
  name: string
  type: "DASHBOARD" | "SCREEN" | "ANALYSIS"
  description?: string
  enabled: boolean
  createdAt: string
}

const MOCK_BOARDS: ReportBoard[] = [
  {
    id: "report-board-001",
    name: "运营数据大屏",
    type: "SCREEN",
    description: "实时展示核心运营指标",
    enabled: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "report-board-002",
    name: "销售分析报表",
    type: "ANALYSIS",
    description: "按周期统计销售业绩",
    enabled: true,
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "report-board-003",
    name: "系统监控仪表盘",
    type: "DASHBOARD",
    description: "服务运行健康状态",
    enabled: false,
    createdAt: "2026-05-01T00:00:00.000Z",
  },
]

export class ReportService {
  static async listBoards(input: ReportPageQueryInput) {
    domainLog.event("report.board.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    let filtered = [...MOCK_BOARDS]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter(
        (b) => b.name.toLowerCase().includes(kw) || (b.description ?? "").toLowerCase().includes(kw),
      )
    }

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async exportBoard(input: ReportExportInput) {
    const board = MOCK_BOARDS.find((b) => b.id === input.boardId)
    if (!board) throw new Error("报表不存在")
    if (!board.enabled) throw new Error("报表已禁用，无法导出")

    domainLog.event("report.board.export", {
      boardId: input.boardId,
      format: input.format,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
    })
    domainLog.audit("report.board.export", {
      targetType: "REPORT_BOARD",
      targetId: input.boardId,
      format: input.format,
    })

    return {
      boardId: board.id,
      boardName: board.name,
      format: input.format,
      downloadUrl: `/api/admin/report/download/${board.id}?format=${input.format}`,
      exportedAt: new Date().toISOString(),
    }
  }
}
