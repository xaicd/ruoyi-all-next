export interface AigwSkuRow {
  id: string
  tenantId: string
  code: string
  name: string
  tokens: number
  price: number
  status: "ACTIVE" | "DISABLED"
  remark?: string
  createdAt: string
  updatedAt: string
}

export const MEMORY_SKUS: AigwSkuRow[] = [
  {
    id: "sku-1",
    tenantId: "1",
    code: "DEEPSEEK_50M",
    name: "DeepSeek 算力加油包 (5,000万 Token)",
    tokens: 50000000,
    price: 199,
    status: "ACTIVE",
    remark: "通用大模型加油包",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sku-2",
    tenantId: "1",
    code: "QWEN_100M",
    name: "通义千问 旗舰算力包 (1亿 Token)",
    tokens: 100000000,
    price: 388,
    status: "ACTIVE",
    remark: "Qwen-Max 高性能包",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sku-3",
    tenantId: "1",
    code: "STARTER_10M",
    name: "小微开发者 体验加油包 (1,000万 Token)",
    tokens: 10000000,
    price: 49,
    status: "ACTIVE",
    remark: "新手体验特惠",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export class AigwSkuRepository {
  async findPage(tenantId: string, page = 1, pageSize = 20) {
    const filtered = MEMORY_SKUS.filter((item) => item.tenantId === tenantId)
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }

  async create(tenantId: string, data: any) {
    const record: AigwSkuRow = {
      id: `sku-${Date.now()}`,
      tenantId,
      code: data.code || `SKU_${Date.now()}`,
      name: data.name || "算力加油包",
      tokens: Number(data.tokens || 10000000),
      price: Number(data.price || 99),
      status: data.status || "ACTIVE",
      remark: data.remark || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MEMORY_SKUS.unshift(record)
    return record
  }

  async update(id: string, data: any) {
    const idx = MEMORY_SKUS.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_SKUS[idx] = {
        ...MEMORY_SKUS[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return MEMORY_SKUS[idx]
    }
    return null
  }

  async delete(id: string) {
    const idx = MEMORY_SKUS.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_SKUS.splice(idx, 1)
      return true
    }
    return false
  }
}

export const aigwSkuRepository = new AigwSkuRepository()
