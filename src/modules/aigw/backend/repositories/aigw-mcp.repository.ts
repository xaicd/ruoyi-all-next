import { AigwMcpAsset, CreateMcpAssetInput, UpdateMcpAssetInput, McpAssetPageQuery } from "../types/aigw-mcp.types"

const MEMORY_MCP_STORE: AigwMcpAsset[] = [
  {
    id: "mcp-01",
    mcpCode: "mcp-gov-document",
    name: "国家标准红头公文排版与合规审查 MCP",
    category: "GOV_DOC",
    icon: "📕",
    version: "v2.6.0",
    description: "内置《党政机关公文格式》(GB/T 9704-2012) 国家标准，排查涉密与政策合规风险。",
    endpoint: "http://127.0.0.1:8090/mcp/gov-doc/sse",
    authorizedCount: 45,
    status: "ACTIVE",
    isOfficial: true,
    tenantId: "0",
    createdBy: "admin",
    updatedBy: "admin",
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
    deleted: false,
  },
  {
    id: "mcp-02",
    mcpCode: "mcp-meeting-wework",
    name: "腾讯会议速记与企业微信待办任务派发 MCP",
    category: "MEETING_OA",
    icon: "🎙️",
    version: "v1.8.4",
    description: "2小时长会议录音秒级提炼核心决议，自动拆解责任人并调用企微机器人推送待办。",
    endpoint: "http://127.0.0.1:8090/mcp/meeting-wework/sse",
    authorizedCount: 38,
    status: "ACTIVE",
    isOfficial: true,
    tenantId: "0",
    createdBy: "admin",
    updatedBy: "admin",
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
    deleted: false,
  },
  {
    id: "mcp-03",
    mcpCode: "mcp-bidding-audit",
    name: "政府采购与招投标方案比对审查 MCP",
    category: "BIDDING",
    icon: "📊",
    version: "v3.1.0",
    description: "批量解析 PDF 标书，自动生成技术规格响应与报价对比矩阵表，识别废标风险。",
    endpoint: "http://127.0.0.1:8090/mcp/bidding/sse",
    authorizedCount: 22,
    status: "ACTIVE",
    isOfficial: true,
    tenantId: "0",
    createdBy: "admin",
    updatedBy: "admin",
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
    deleted: false,
  },
  {
    id: "mcp-04",
    mcpCode: "mcp-gitlab-audit",
    name: "国央企内网 GitLab 源码安全审计与单测 MCP",
    category: "DEV_SECURITY",
    icon: "💻",
    version: "v2.4.1",
    description: "内网沙箱运行，排查高并发竞态条件与 SQL 注入漏洞，补齐 Vitest 单元测试。",
    endpoint: "http://127.0.0.1:8090/mcp/code-audit/sse",
    authorizedCount: 29,
    status: "ACTIVE",
    isOfficial: true,
    tenantId: "0",
    createdBy: "admin",
    updatedBy: "admin",
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
    deleted: false,
  },
  {
    id: "mcp-05",
    mcpCode: "mcp-12345-hotline",
    name: "12345 市民热线工单智能分类与政策答复 MCP",
    category: "HOTLINE",
    icon: "🏛️",
    version: "v1.5.0",
    description: "秒级识别加装电梯、公积金补贴诉求，调取最新法规答复口径并派单至责任科室。",
    endpoint: "http://127.0.0.1:8090/mcp/12345/sse",
    authorizedCount: 16,
    status: "ACTIVE",
    isOfficial: true,
    tenantId: "0",
    createdBy: "admin",
    updatedBy: "admin",
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
    deleted: false,
  },
]

export const AigwMcpRepository = {
  async page(query: McpAssetPageQuery): Promise<{ list: AigwMcpAsset[]; total: number }> {
    let list = [...MEMORY_MCP_STORE]
    if (query.keyword) {
      const kw = query.keyword.toLowerCase()
      list = list.filter((i) => i.name.toLowerCase().includes(kw) || i.mcpCode.toLowerCase().includes(kw) || i.description.toLowerCase().includes(kw))
    }
    if (query.category) {
      list = list.filter((i) => i.category === query.category)
    }
    if (query.status) {
      list = list.filter((i) => i.status === query.status)
    }
    const page = query.page || 1
    const pageSize = query.pageSize || 20
    const start = (page - 1) * pageSize
    return {
      list: list.slice(start, start + pageSize),
      total: list.length,
    }
  },

  async get(id: string): Promise<AigwMcpAsset | null> {
    return MEMORY_MCP_STORE.find((i) => i.id === id || i.mcpCode === id) || null
  },

  async create(input: CreateMcpAssetInput): Promise<AigwMcpAsset> {
    const existing = MEMORY_MCP_STORE.find((i) => i.mcpCode === input.mcpCode)
    if (existing) {
      throw new Error(`MCP代码 ${input.mcpCode} 已存在`)
    }
    const now = new Date().toISOString()
    const item: AigwMcpAsset = {
      id: `mcp-${Date.now().toString(36)}`,
      mcpCode: input.mcpCode,
      name: input.name,
      category: input.category || "CUSTOM",
      icon: input.icon || "⚡",
      version: input.version || "v1.0.0",
      description: input.description || "",
      endpoint: input.endpoint,
      authorizedCount: 0,
      status: "ACTIVE",
      isOfficial: false,
      tenantId: "0",
      createdBy: "admin",
      updatedBy: "admin",
      createdAt: now,
      updatedAt: now,
      deleted: false,
    }
    MEMORY_MCP_STORE.unshift(item)
    return item
  },

  async update(input: UpdateMcpAssetInput): Promise<AigwMcpAsset> {
    const idx = MEMORY_MCP_STORE.findIndex((i) => i.id === input.id)
    if (idx === -1) {
      throw new Error(`未找到ID为 ${input.id} 的MCP资产`)
    }
    const existing = MEMORY_MCP_STORE[idx]
    const updated: AigwMcpAsset = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    }
    MEMORY_MCP_STORE[idx] = updated
    return updated
  },

  async delete(id: string): Promise<boolean> {
    const idx = MEMORY_MCP_STORE.findIndex((i) => i.id === id)
    if (idx === -1) return false
    MEMORY_MCP_STORE.splice(idx, 1)
    return true
  },
}

export const aigwMcpRepository = AigwMcpRepository
