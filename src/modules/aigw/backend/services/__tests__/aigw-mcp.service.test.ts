import { describe, expect, it } from "vitest"
import { AigwMcpRepository } from "../../repositories/aigw-mcp.repository"

describe("AIGW 政企私有 MCP 资产库仓储与业务测试", () => {
  it("预置 MCP 资产库分页查询正常返回", async () => {
    const res = await AigwMcpRepository.page({ page: 1, pageSize: 10 })
    expect(res.list.length).toBeGreaterThan(0)
    expect(res.total).toBeGreaterThanOrEqual(5)
    expect(res.list.some((item) => item.mcpCode === "mcp-gov-document")).toBe(true)
  })

  it("支持新增自定义私有 MCP 资产", async () => {
    const newItem = await AigwMcpRepository.create({
      mcpCode: `mcp-test-custom-${Date.now()}`,
      name: "测试专属医保核验 MCP",
      category: "CUSTOM",
      icon: "🏥",
      version: "v1.0.0",
      description: "测试政企私有医保核验连接器",
      endpoint: "http://127.0.0.1:8090/mcp/medical/sse",
    })
    expect(newItem.id).toBeDefined()
    expect(newItem.name).toBe("测试专属医保核验 MCP")
    expect(newItem.status).toBe("ACTIVE")

    const fetched = await AigwMcpRepository.get(newItem.id)
    expect(fetched).not.toBeNull()
    expect(fetched?.name).toBe("测试专属医保核验 MCP")
  })

  it("支持更新 MCP 资产状态与属性", async () => {
    const list = await AigwMcpRepository.page({ page: 1, pageSize: 1 })
    const target = list.list[0]
    expect(target).toBeDefined()

    const updated = await AigwMcpRepository.update({
      id: target.id,
      status: "DISABLED",
    })
    expect(updated.status).toBe("DISABLED")
  })

  it("支持按关键字与分类多维度过滤", async () => {
    const govDocs = await AigwMcpRepository.page({ category: "GOV_DOC" })
    expect(govDocs.list.every((i) => i.category === "GOV_DOC")).toBe(true)

    const keywordRes = await AigwMcpRepository.page({ keyword: "公文" })
    expect(keywordRes.list.length).toBeGreaterThan(0)
  })
})
