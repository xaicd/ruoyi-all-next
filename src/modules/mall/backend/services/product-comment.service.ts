import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ProductCommentItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ProductCommentCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ProductCommentUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ProductCommentPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ProductCommentItem[] = [
  { id: "product-comment-001", name: "ProductComment 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "product-comment-002", name: "ProductComment 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ProductCommentService {
  /** 分页查询 */
  static async page(input: ProductCommentPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mall.productComment.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ProductComment不存在")
    domainLog.event("mall.productComment.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ProductCommentCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `product-comment-${++nextId}`
    const item: ProductCommentItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mall.productComment.create", { id })
    domainLog.audit("mall.productComment.create", { targetType: "MALL_PRODUCTCOMMENT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: ProductCommentUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("ProductComment不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mall.productComment.update", { id: input.id })
    domainLog.audit("mall.productComment.update", { targetType: "MALL_PRODUCTCOMMENT", targetId: input.id })
    return true
  }
}
