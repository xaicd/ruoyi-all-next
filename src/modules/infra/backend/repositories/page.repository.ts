/**
 * InfraPage Repository - 低代码页面存储
 * 存储 Puck 页面构建器生成的页面 JSON 数据
 */

export type InfraPageRow = {
  id: string
  name: string
  slug: string // 路由路径标识，如 "dashboard", "report/sales"
  data: string // Puck JSON data (stringified)
  status: string // PUBLISHED | DRAFT
  remark: string | null
  createdAt: string
  updatedAt: string
}

export type CreatePageData = { name: string; slug: string; data: string; status?: string; remark?: string }
export type UpdatePageData = Partial<CreatePageData>

const MEMORY_STORE: InfraPageRow[] = [
  {
    id: "1",
    name: "示例仪表盘",
    slug: "dashboard-demo",
    data: JSON.stringify({ content: [{ type: "StatCard", props: { title: "用户数", value: "1,234", color: "blue", id: "sc1" } }, { type: "StatCard", props: { title: "订单数", value: "567", color: "green", id: "sc2" } }], root: {} }),
    status: "PUBLISHED",
    remark: "低代码页面示例",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
]
let memoryIdSeq = 100

export const InfraPageRepository = {
  async findAll(params?: { status?: string }): Promise<InfraPageRow[]> {
    let filtered = [...MEMORY_STORE]
    if (params?.status) filtered = filtered.filter(p => p.status === params.status)
    return filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  async findById(id: string): Promise<InfraPageRow | null> {
    return MEMORY_STORE.find(p => p.id === id) ?? null
  },

  async findBySlug(slug: string): Promise<InfraPageRow | null> {
    return MEMORY_STORE.find(p => p.slug === slug && p.status === "PUBLISHED") ?? null
  },

  async create(data: CreatePageData): Promise<InfraPageRow> {
    const now = new Date().toISOString()
    const row: InfraPageRow = {
      id: String(++memoryIdSeq),
      name: data.name,
      slug: data.slug,
      data: data.data,
      status: data.status ?? "DRAFT",
      remark: data.remark ?? null,
      createdAt: now,
      updatedAt: now,
    }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: UpdatePageData): Promise<InfraPageRow> {
    const idx = MEMORY_STORE.findIndex(p => p.id === id)
    if (idx === -1) throw new Error(`页面不存在: ${id}`)
    const page = MEMORY_STORE[idx]
    const updated: InfraPageRow = {
      ...page,
      name: data.name ?? page.name,
      slug: data.slug ?? page.slug,
      data: data.data ?? page.data,
      status: data.status ?? page.status,
      remark: data.remark !== undefined ? (data.remark ?? null) : page.remark,
      updatedAt: new Date().toISOString(),
    }
    MEMORY_STORE[idx] = updated
    return updated
  },

  async delete(id: string): Promise<void> {
    const idx = MEMORY_STORE.findIndex(p => p.id === id)
    if (idx === -1) throw new Error(`页面不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },
}
