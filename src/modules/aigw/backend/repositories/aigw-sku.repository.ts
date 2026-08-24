import { getCurrentTenantId, isTenantRequired, isPlatformContext } from "@/modules/shared/backend/lib/biz-tenant"

function currentTenantId(explicit?: string): string | undefined {
  if (explicit) return explicit
  const tenantId = getCurrentTenantId()
  if (tenantId) return tenantId
  if (isTenantRequired() && !isPlatformContext()) throw new Error("算力包数据访问缺少租户上下文")
  return undefined
}

export type SkuCategory = "TOKEN_RECHARGE" | "MODEL_DEDICATED" | "SEAT_BUNDLE" | "GPU_HOURS"

export interface AigwSkuRow {
  id: string
  tenantId: string
  code: string
  name: string
  category: SkuCategory
  tokens: number
  price: number
  originalPrice?: number
  validityDays: number // 有效期（天），0 表示永久
  modelScope: string[] // 适用模型范围，如 ["deepseek-r1", "deepseek-v3"] 或 ["*"]
  qpsLimit?: number // 并发保障限制
  tpmLimit?: number // 每分钟 Token 吞吐保障
  badge?: string // 营销标签，如 HOT / PROMO / ENTERPRISE
  specs?: Record<string, string> // 动态自定义扩展规格矩阵
  features?: string[] // 特性卖点清单
  status: "ACTIVE" | "DISABLED"
  remark?: string
  createdAt: string
  updatedAt: string
}

export const MEMORY_SKUS: AigwSkuRow[] = [
  {
    id: "sku-1",
    tenantId: "1",
    code: "DEEPSEEK_R1_50M",
    name: "DeepSeek-R1 满血推理算力包 (5,000万 Token)",
    category: "MODEL_DEDICATED",
    tokens: 50_000_000,
    price: 199,
    originalPrice: 299,
    validityDays: 90,
    modelScope: ["deepseek-r1", "deepseek-v3"],
    qpsLimit: 50,
    tpmLimit: 400_000,
    badge: "HOT",
    specs: {
      "contextWindow": "64K 超长上下文",
      "priorityQueue": "VIP 推理极速通道",
      "slaGuarantee": "99.95% 专网可用性保障",
    },
    features: [
      "首字时延 < 250ms 极速体验",
      "支持深度思维链 CoT 输出",
      "专享高并发独立队列",
      "开具数电专票与增值税发票",
    ],
    status: "ACTIVE",
    remark: "适用于政企智能体深度思考与复杂代码生成场景",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sku-2",
    tenantId: "1",
    code: "QWEN_MAX_100M",
    name: "通义千问 Qwen-Max 旗舰算力包 (1亿 Token)",
    category: "MODEL_DEDICATED",
    tokens: 100_000_000,
    price: 388,
    originalPrice: 588,
    validityDays: 180,
    modelScope: ["qwen-max", "qwen-plus", "qwen2.5-coder"],
    qpsLimit: 80,
    tpmLimit: 800_000,
    badge: "PROMO",
    specs: {
      "contextWindow": "128K 超长上下文",
      "toolCallSupport": "支持原生 Function Calling / MCP 插件",
      "slaGuarantee": "99.99% 金融级可用性",
    },
    features: [
      "支持复杂工具调用与智能体规划",
      "支持超长文档解析与知识库检索",
      "按 Token 精准计费无最低消费",
    ],
    status: "ACTIVE",
    remark: "Qwen 旗舰大模型，赋能多智能体协同与复杂业务编排",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sku-3",
    tenantId: "1",
    code: "GENERAL_RECHARGE_10M",
    name: "全模型通用 体验加油包 (1,000万 Token)",
    category: "TOKEN_RECHARGE",
    tokens: 10_000_000,
    price: 49,
    originalPrice: 69,
    validityDays: 30,
    modelScope: ["*"],
    qpsLimit: 20,
    tpmLimit: 150_000,
    badge: "NEW",
    specs: {
      "modelCompatibility": "全平台模型任意调用",
      "billingMode": "统一动态折算扣费",
    },
    features: [
      "全平台 10+ 款大模型任意调用",
      "低门槛尝鲜，支持多端 IDE",
      "即充即用，毫秒级生效",
    ],
    status: "ACTIVE",
    remark: "轻量开发与原型调优首选特惠包",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sku-4",
    tenantId: "1",
    code: "GOV_ENT_ENTERPRISE_1B",
    name: "政企尊享 10亿 Token 独享算力包",
    category: "SEAT_BUNDLE",
    tokens: 1_000_000_000,
    price: 29800,
    originalPrice: 39800,
    validityDays: 365,
    modelScope: ["*"],
    qpsLimit: 500,
    tpmLimit: 5_000_000,
    badge: "ENTERPRISE",
    specs: {
      "dedicatedSeats": "赠送 50 个政企席位许可",
      "isolatedNetwork": "专属独立 VPC 专线接入",
      "slaGuarantee": "99.999% 专网级 SLA",
      "supportLevel": "7x24小时 专属架构师团队驻场响应",
    },
    features: [
      "赠送 50 个 WorkBuddy / Qoder 席位授权",
      "支持对公打款、框架合同签署与按月结算",
      "支持政务内网物理机专网部署",
      "具备完整的操作审计与敏感词风控拦截",
    ],
    status: "ACTIVE",
    remark: "面向厅局级单位、大型央国企的专属大型算力套餐",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
]

export class AigwSkuRepository {
  async findPage(tenantId?: string, page = 1, pageSize = 20, category?: string) {
    const activeTenantId = currentTenantId(tenantId)
    let filtered = MEMORY_SKUS.filter((item) => !activeTenantId || item.tenantId === activeTenantId)
    if (category) {
      filtered = filtered.filter((item) => item.category === category)
    }
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }

  async findById(id: string, tenantId?: string): Promise<AigwSkuRow | null> {
    const activeTenantId = currentTenantId(tenantId)
    return MEMORY_SKUS.find((item) => item.id === id && (!activeTenantId || item.tenantId === activeTenantId)) ?? null
  }

  async create(dataOrTenant: any, maybeData?: any): Promise<AigwSkuRow> {
    const activeTenantId = typeof dataOrTenant === "string" ? currentTenantId(dataOrTenant) : currentTenantId()
    const data = typeof dataOrTenant === "string" ? maybeData : dataOrTenant
    const now = new Date().toISOString()
    const record: AigwSkuRow = {
      id: `sku-${Date.now()}`,
      tenantId: activeTenantId || "1",
      code: data.code || `SKU_${Date.now()}`,
      name: data.name || "算力加油包",
      category: data.category || "TOKEN_RECHARGE",
      tokens: Number(data.tokens || 10_000_000),
      price: Number(data.price || 99),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      validityDays: Number(data.validityDays ?? 90),
      modelScope: Array.isArray(data.modelScope) ? data.modelScope : (data.modelScope ? String(data.modelScope).split(",").map((s: string) => s.trim()).filter(Boolean) : ["*"]),
      qpsLimit: data.qpsLimit ? Number(data.qpsLimit) : undefined,
      tpmLimit: data.tpmLimit ? Number(data.tpmLimit) : undefined,
      badge: data.badge || undefined,
      specs: data.specs && typeof data.specs === "object" ? data.specs : {},
      features: Array.isArray(data.features) ? data.features : [],
      status: data.status || "ACTIVE",
      remark: data.remark || "",
      createdAt: now,
      updatedAt: now,
    }
    MEMORY_SKUS.unshift(record)
    return record
  }

  async update(id: string, data: Partial<AigwSkuRow>): Promise<AigwSkuRow | null> {
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

  async delete(id: string): Promise<boolean> {
    const idx = MEMORY_SKUS.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_SKUS.splice(idx, 1)
      return true
    }
    return false
  }
}

export const AigwSkuRepositorySingleton = new AigwSkuRepository()
export const aigwSkuRepository = AigwSkuRepositorySingleton
export { AigwSkuRepositorySingleton as AigwSkuRepo }
