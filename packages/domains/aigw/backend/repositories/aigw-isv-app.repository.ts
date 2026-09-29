import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"

export interface AigwIsvAppRow {
  id: string
  appCode: string
  name: string
  vendor: string
  category: "OFFICE" | "DEV" | "WORKFLOW" | "CUSTOM"
  momaModelTarget: string
  commissionRate: number
  authSecret: string
  activeSeatsCount: number
  status: "ACTIVE" | "DISABLED"
  icon: string
  description: string
  tenantId?: string | null
  createdAt: string
  updatedAt?: string
}

export const SEED_ISV_APPS: AigwIsvAppRow[] = [
  {
    id: "app-jiutian-00",
    appCode: "jiutian-gov",
    name: "中移九天数字政府专属助理",
    vendor: "中国移动通信集团 (原生中枢)",
    category: "OFFICE",
    momaModelTarget: "jiutian-gov-special",
    commissionRate: 0.0,
    authSecret: "sec_isv_jt_100860",
    activeSeatsCount: 2600,
    status: "ACTIVE",
    icon: "🇨🇳",
    description: "中国移动「九天·政务」原生大模型，专为党政机关、公积金、医保热线提供权威政策法规答复与红头公文排版合规审查。",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "app-workbuddy-01",
    appCode: "workbuddy",
    name: "腾讯 WorkBuddy (移动企微政务专版)",
    vendor: "腾讯科技 (战略生态 ISV)",
    category: "OFFICE",
    momaModelTarget: "deepseek-v3-moma",
    commissionRate: 0.3,
    authSecret: "sec_isv_wb_998822",
    activeSeatsCount: 1420,
    status: "ACTIVE",
    icon: "💼",
    description: "深度打通企业微信与腾讯文档，内置国家标准公文格式与会议秒级提炼派单，后端消耗移动 MOMA 算力豆与专线账单统付。",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "app-qoder-02",
    appCode: "qoder",
    name: "阿里 Qoder (国央企内网研发专版)",
    vendor: "阿里巴巴 (研发信创 ISV)",
    category: "DEV",
    momaModelTarget: "deepseek-r1-moma",
    commissionRate: 0.35,
    authSecret: "sec_isv_qd_773311",
    activeSeatsCount: 980,
    status: "ACTIVE",
    icon: "💻",
    description: "通义灵码私有化演进版，专为国企信创研发中心提供高安全内网代码审计、Vitest 自动化单测与韶关智算集群算力调度。",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "app-trae-03",
    appCode: "trae",
    name: "字节 Trae (政企应急指挥工作流)",
    vendor: "北京字跳网络 (流程协同 ISV)",
    category: "WORKFLOW",
    momaModelTarget: "deepseek-v3-moma",
    commissionRate: 0.25,
    authSecret: "sec_isv_tr_554400",
    activeSeatsCount: 650,
    status: "ACTIVE",
    icon: "⚡",
    description: "飞书多维表格与跨部门审批智能编排，秒级处理 12345 市民热线诉求与应急指挥协同派发，专线直连中移智算专网。",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "app-cherry-04",
    appCode: "cherry-studio",
    name: "Cherry Studio (中移专区 BYOK 客户端)",
    vendor: "开源社区 (BYOK 生态)",
    category: "CUSTOM",
    momaModelTarget: "deepseek-r1-moma",
    commissionRate: 0.0,
    authSecret: "sec_isv_cs_332211",
    activeSeatsCount: 3100,
    status: "ACTIVE",
    icon: "🍒",
    description: "政企员工免登录一键下发中移专属 API Key，直接挂载私有 MCP 工具库，支持端侧高并发本地调度。",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
]

const MEMORY_STORE: AigwIsvAppRow[] = [...SEED_ISV_APPS]

export const AigwIsvAppRepository = {
  async findAll(params?: { status?: string; keyword?: string; category?: string }): Promise<AigwIsvAppRow[]> {
    let list = [...MEMORY_STORE]
    if (params?.status) list = list.filter((r) => r.status === params.status)
    if (params?.category) list = list.filter((r) => r.category === params.category)
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter((r) => r.name.toLowerCase().includes(kw) || r.vendor.toLowerCase().includes(kw) || r.appCode.toLowerCase().includes(kw))
    }
    return list
  },

  async findById(id: string): Promise<AigwIsvAppRow | null> {
    return MEMORY_STORE.find((r) => r.id === id) ?? null
  },

  async findByAppCode(appCode: string): Promise<AigwIsvAppRow | null> {
    return MEMORY_STORE.find((r) => r.appCode === appCode) ?? null
  },

  async create(data: Omit<AigwIsvAppRow, "id" | "createdAt">): Promise<AigwIsvAppRow> {
    const row: AigwIsvAppRow = {
      ...data,
      id: `app-${Date.now().toString(36)}-${randomUUID().slice(0, 4)}`,
      createdAt: new Date().toISOString(),
    }
    MEMORY_STORE.unshift(row)
    return row
  },

  async update(id: string, data: Partial<AigwIsvAppRow>): Promise<AigwIsvAppRow | null> {
    const idx = MEMORY_STORE.findIndex((r) => r.id === id)
    if (idx === -1) return null
    MEMORY_STORE[idx] = { ...MEMORY_STORE[idx], ...data, updatedAt: new Date().toISOString() }
    return MEMORY_STORE[idx]
  },

  async delete(id: string): Promise<boolean> {
    const idx = MEMORY_STORE.findIndex((r) => r.id === id)
    if (idx === -1) return false
    MEMORY_STORE.splice(idx, 1)
    return true
  },
}

export const aigwIsvAppRepository = AigwIsvAppRepository
