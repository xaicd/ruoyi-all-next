import { randomUUID } from "node:crypto"
import { getKyselyDb } from "@/modules/shared/backend/lib/database"
import { hasRealDatabase } from "@/modules/shared/backend/lib/database"

export type SystemPartnerRow = {
  id: string
  partnerCode: string
  name: string
  level: "GOLD" | "SILVER" | "BRONZE" | "STRATEGIC"
  registeredCapital?: number
  creditCode: string
  contactName: string
  contactPhone: string
  region: string
  commissionRate: number // 如 0.20 代表 20%
  promoCode: string
  balance: number // 当前收益钱包 (元)
  totalCommission: number
  allowedTenantIds: string[] // 所辖企业租户授权数据范围
  masterPoolTokens: number // 批发算力采购总池 (如 10 亿)
  status: "ACTIVE" | "DISABLED"
  tenantId: string
  createdAt: string
  updatedAt: string
}

export type CreatePartnerData = Omit<SystemPartnerRow, "id" | "createdAt" | "updatedAt">
export type UpdatePartnerData = Partial<CreatePartnerData>
export type PartnerListParams = { page: number; pageSize: number; keyword?: string; level?: string; status?: string }
export type PageResult<T> = { items: T[]; total: number; page: number; pageSize: number }

const MEMORY_STORE: SystemPartnerRow[] = [
  {
    id: "partner-1",
    partnerCode: "PT-GD-001",
    name: "广东数字智算科技有限公司",
    level: "GOLD",
    registeredCapital: 2000,
    creditCode: "91440101MA9U888888",
    contactName: "陈总",
    contactPhone: "18600186000",
    region: "广东省-广州市",
    commissionRate: 0.20,
    promoCode: "GD9921",
    balance: 15200.00,
    totalCommission: 76000.00,
    allowedTenantIds: ["2", "3", "4"],
    masterPoolTokens: 1000000000,
    status: "ACTIVE",
    tenantId: "1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "partner-2",
    partnerCode: "PT-SZ-002",
    name: "深圳前海数智算力网络有限公司",
    level: "SILVER",
    registeredCapital: 1000,
    creditCode: "91440300MA5F999999",
    contactName: "林总",
    contactPhone: "13588886666",
    region: "广东省-深圳市",
    commissionRate: 0.18,
    promoCode: "SZ8832",
    balance: 8900.00,
    totalCommission: 45000.00,
    allowedTenantIds: ["2"],
    masterPoolTokens: 500000000,
    status: "ACTIVE",
    tenantId: "1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
]

export const SystemPartnerRepository = {
  async findList(params: PartnerListParams): Promise<PageResult<SystemPartnerRow>> {
    if (hasRealDatabase()) return findListFromDb(params)
    let filtered = [...MEMORY_STORE]
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.partnerCode.toLowerCase().includes(kw) ||
          p.name.toLowerCase().includes(kw) ||
          p.contactName.toLowerCase().includes(kw) ||
          p.contactPhone.includes(kw)
      )
    }
    if (params.level) filtered = filtered.filter((p) => p.level === params.level)
    if (params.status) filtered = filtered.filter((p) => p.status === params.status)

    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return {
      items: filtered.slice(start, start + params.pageSize),
      total,
      page: params.page,
      pageSize: params.pageSize,
    }
  },

  async findById(id: string): Promise<SystemPartnerRow | null> {
    if (hasRealDatabase()) return findByIdFromDb(id)
    return MEMORY_STORE.find((p) => p.id === id) ?? null
  },

  async findByPhone(phone: string): Promise<SystemPartnerRow | null> {
    if (hasRealDatabase()) return findByPhoneFromDb(phone)
    return MEMORY_STORE.find((p) => p.contactPhone === phone) ?? null
  },

  async create(data: CreatePartnerData): Promise<SystemPartnerRow> {
    if (hasRealDatabase()) return createInDb(data)
    const now = new Date().toISOString()
    const row: SystemPartnerRow = {
      ...data,
      id: `partner-${randomUUID().slice(0, 8)}`,
      createdAt: now,
      updatedAt: now,
    }
    MEMORY_STORE.unshift(row)
    return row
  },

  async update(id: string, data: UpdatePartnerData): Promise<SystemPartnerRow> {
    if (hasRealDatabase()) return updateInDb(id, data)
    const idx = MEMORY_STORE.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error(`合伙人不存在: ${id}`)
    const current = MEMORY_STORE[idx]
    if (!current) throw new Error(`合伙人不存在: ${id}`)
    const updated: SystemPartnerRow = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    }
    MEMORY_STORE[idx] = updated
    return updated
  },

  async findByPromoCode(promoCode: string): Promise<SystemPartnerRow | null> {
    const list = await this.findList({ page: 1, pageSize: 100 })
    return list.items.find((p) => p.promoCode === promoCode || p.partnerCode === promoCode) ?? null
  },

  /**
   * 企业客户通过邀请码注册开户时，合规绑定到该合伙人名下 (终身锁定归属)
   */
  async bindTenantByPromoCode(promoCode: string, tenantId: string): Promise<SystemPartnerRow> {
    const partner = await this.findByPromoCode(promoCode)
    if (!partner) throw new Error(`无效的合伙人邀请码: ${promoCode}`)
    const allowed = Array.from(new Set([...(partner.allowedTenantIds || []), tenantId]))
    return this.update(partner.id, { allowedTenantIds: allowed })
  },

  /**
   * 查询合伙人邀请战报台账 (合法单层企业客户 + 单层下级分销伙伴)
   */
  async getReferralLedger(partnerId: string) {
    const partner = await this.findById(partnerId)
    if (!partner) throw new Error("合伙人不存在")
    return {
      partnerId: partner.id,
      name: partner.name,
      promoCode: partner.promoCode,
      inviteUrl: `https://roma.link/i/${partner.promoCode}`,
      totalTenantsCount: partner.allowedTenantIds?.length || 0,
      totalCommission: partner.totalCommission,
      balance: partner.balance,
      complianceNote: "严格遵守《禁止传销条例》，仅支持合法单层客户佣金(20%)与单层管理津贴，无入门费、无多级层级计酬。",
    }
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) return deleteInDb(id)
    const idx = MEMORY_STORE.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error(`合伙人不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },
}

export const systemPartnerRepository = SystemPartnerRepository

// === Kysely 真实数据库持久化驱动 ===
async function findListFromDb(params: PartnerListParams): Promise<PageResult<SystemPartnerRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_partner" as any)
  if (params.keyword) {
    const kw = `%${params.keyword}%`
    query = query.where((eb: any) =>
      eb.or([
        eb("name", "like", kw),
        eb("partner_code", "like", kw),
        eb("contact_name", "like", kw),
        eb("contact_phone", "like", kw),
      ])
    )
  }
  if (params.level) query = query.where("level", "=", params.level)
  if (params.status) query = query.where("status", "=", params.status)

  const countRes = await query.select((eb: any) => eb.fn.countAll().as("count")).executeTakeFirst()
  const total = Number((countRes as any)?.count ?? 0)
  const offset = (params.page - 1) * params.pageSize
  const rows = await query.selectAll().orderBy("created_at", "desc").offset(offset).limit(params.pageSize).execute()
  return { items: (rows as any[]).map(mapPartnerRow), total, page: params.page, pageSize: params.pageSize }
}

async function findByIdFromDb(id: string): Promise<SystemPartnerRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("system_partner" as any).selectAll().where("id", "=", id).executeTakeFirst()
  return row ? mapPartnerRow(row) : null
}

async function findByPhoneFromDb(phone: string): Promise<SystemPartnerRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("system_partner" as any).selectAll().where("contact_phone", "=", phone).executeTakeFirst()
  return row ? mapPartnerRow(row) : null
}

async function createInDb(data: CreatePartnerData): Promise<SystemPartnerRow> {
  const db = await getKyselyDb()
  const now = new Date()
  const row = await db
    .insertInto("system_partner" as any)
    .values({
      id: randomUUID(),
      partner_code: data.partnerCode,
      name: data.name,
      level: data.level,
      registered_capital: data.registeredCapital ?? null,
      credit_code: data.creditCode,
      contact_name: data.contactName,
      contact_phone: data.contactPhone,
      region: data.region,
      commission_rate: data.commissionRate,
      promo_code: data.promoCode,
      balance: data.balance,
      total_commission: data.totalCommission,
      allowed_tenant_ids: JSON.stringify(data.allowedTenantIds),
      master_pool_tokens: data.masterPoolTokens,
      status: data.status,
      tenant_id: data.tenantId,
      created_at: now,
      updated_at: now,
    } as any)
    .returningAll()
    .executeTakeFirstOrThrow()
  return mapPartnerRow(row)
}

async function updateInDb(id: string, data: UpdatePartnerData): Promise<SystemPartnerRow> {
  const db = await getKyselyDb()
  const u: Record<string, any> = { updated_at: new Date() }
  if (data.name !== undefined) u.name = data.name
  if (data.level !== undefined) u.level = data.level
  if (data.commissionRate !== undefined) u.commission_rate = data.commissionRate
  if (data.balance !== undefined) u.balance = data.balance
  if (data.status !== undefined) u.status = data.status
  if (data.allowedTenantIds !== undefined) u.allowed_tenant_ids = JSON.stringify(data.allowedTenantIds)
  const row = await db
    .updateTable("system_partner" as any)
    .set(u)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow()
  return mapPartnerRow(row)
}

async function deleteInDb(id: string): Promise<void> {
  const db = await getKyselyDb()
  await db.deleteFrom("system_partner" as any).where("id", "=", id).execute()
}

function mapPartnerRow(row: any): SystemPartnerRow {
  return {
    id: row.id,
    partnerCode: row.partner_code,
    name: row.name,
    level: row.level,
    registeredCapital: row.registered_capital,
    creditCode: row.credit_code,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    region: row.region,
    commissionRate: Number(row.commission_rate),
    promoCode: row.promo_code,
    balance: Number(row.balance),
    totalCommission: Number(row.total_commission),
    allowedTenantIds: typeof row.allowed_tenant_ids === "string" ? JSON.parse(row.allowed_tenant_ids) : row.allowed_tenant_ids || [],
    masterPoolTokens: Number(row.master_pool_tokens),
    status: row.status,
    tenantId: row.tenant_id,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  }
}
