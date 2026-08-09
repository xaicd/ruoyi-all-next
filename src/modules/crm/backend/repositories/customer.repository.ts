/**
 * CRM Customer Repository
 */

import type { PageResult } from "@/modules/shared/backend/lib/database"

export type CrmCustomerRow = {
  id: string
  name: string
  phone: string | null
  email: string | null
  industry: string | null
  level: string // A | B | C | D
  source: string | null
  ownerUserId: string | null
  ownerUserName: string | null
  status: string // ACTIVE | LOCKED | POOL
  remark: string | null
  dealStatus: string // PENDING | DEALING | DONE | LOST
  contactLastTime: string | null
  createdAt: string
  updatedAt: string
}

export type CreateCustomerData = { name: string; phone?: string; email?: string; industry?: string; level?: string; source?: string; ownerUserId?: string; remark?: string }
export type UpdateCustomerData = Partial<CreateCustomerData> & { status?: string; dealStatus?: string }
export type CustomerListParams = { page: number; pageSize: number; keyword?: string; level?: string; status?: string; ownerUserId?: string }

const MEMORY_STORE: CrmCustomerRow[] = [
  { id: "1", name: "深圳腾讯科技", phone: "0755-12345678", email: "contact@tencent.test", industry: "互联网", level: "A", source: "官网注册", ownerUserId: "1", ownerUserName: "管理员", status: "ACTIVE", remark: null, dealStatus: "DEALING", contactLastTime: "2026-08-01T10:00:00.000Z", createdAt: "2026-01-15T08:00:00.000Z", updatedAt: "2026-08-01T10:00:00.000Z" },
  { id: "2", name: "杭州阿里巴巴", phone: "0571-87654321", email: "biz@alibaba.test", industry: "电商", level: "A", source: "销售拜访", ownerUserId: "1", ownerUserName: "管理员", status: "ACTIVE", remark: "重点客户", dealStatus: "DONE", contactLastTime: "2026-07-20T14:00:00.000Z", createdAt: "2026-02-01T09:00:00.000Z", updatedAt: "2026-07-20T14:00:00.000Z" },
  { id: "3", name: "北京字节跳动", phone: "010-88888888", email: null, industry: "互联网", level: "B", source: "转介绍", ownerUserId: "2", ownerUserName: "测试用户", status: "ACTIVE", remark: null, dealStatus: "PENDING", contactLastTime: null, createdAt: "2026-03-10T11:00:00.000Z", updatedAt: "2026-03-10T11:00:00.000Z" },
  { id: "4", name: "上海华为技术", phone: null, email: "sales@huawei.test", industry: "通信", level: "A", source: "展会获客", ownerUserId: "1", ownerUserName: "管理员", status: "ACTIVE", remark: null, dealStatus: "DEALING", contactLastTime: "2026-07-28T09:30:00.000Z", createdAt: "2026-04-05T10:00:00.000Z", updatedAt: "2026-07-28T09:30:00.000Z" },
  { id: "5", name: "成都小米科技", phone: "028-66666666", email: null, industry: "智能硬件", level: "C", source: "官网注册", ownerUserId: null, ownerUserName: null, status: "POOL", remark: "公海客户", dealStatus: "PENDING", contactLastTime: null, createdAt: "2026-05-20T15:00:00.000Z", updatedAt: "2026-05-20T15:00:00.000Z" },
]
let memoryIdSeq = 100

export const CrmCustomerRepository = {
  async findList(params: CustomerListParams): Promise<PageResult<CrmCustomerRow>> {
    let filtered = [...MEMORY_STORE]
    if (params.keyword) { const kw = params.keyword.toLowerCase(); filtered = filtered.filter((c) => c.name.toLowerCase().includes(kw) || (c.phone ?? "").includes(kw)) }
    if (params.level) filtered = filtered.filter((c) => c.level === params.level)
    if (params.status) filtered = filtered.filter((c) => c.status === params.status)
    if (params.ownerUserId) filtered = filtered.filter((c) => c.ownerUserId === params.ownerUserId)
    filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<CrmCustomerRow | null> {
    return MEMORY_STORE.find((c) => c.id === id) ?? null
  },

  async create(data: CreateCustomerData): Promise<CrmCustomerRow> {
    const now = new Date().toISOString()
    const row: CrmCustomerRow = { id: String(++memoryIdSeq), name: data.name, phone: data.phone ?? null, email: data.email ?? null, industry: data.industry ?? null, level: data.level ?? "C", source: data.source ?? null, ownerUserId: data.ownerUserId ?? null, ownerUserName: null, status: data.ownerUserId ? "ACTIVE" : "POOL", remark: data.remark ?? null, dealStatus: "PENDING", contactLastTime: null, createdAt: now, updatedAt: now }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: UpdateCustomerData): Promise<CrmCustomerRow> {
    const idx = MEMORY_STORE.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error(`客户不存在: ${id}`)
    const customer = MEMORY_STORE[idx]
    const updated: CrmCustomerRow = { ...customer, name: data.name ?? customer.name, phone: data.phone !== undefined ? (data.phone ?? null) : customer.phone, email: data.email !== undefined ? (data.email ?? null) : customer.email, industry: data.industry !== undefined ? (data.industry ?? null) : customer.industry, level: data.level ?? customer.level, source: data.source !== undefined ? (data.source ?? null) : customer.source, status: data.status ?? customer.status, dealStatus: data.dealStatus ?? customer.dealStatus, remark: data.remark !== undefined ? (data.remark ?? null) : customer.remark, updatedAt: new Date().toISOString() }
    MEMORY_STORE[idx] = updated
    return updated
  },

  async delete(id: string): Promise<void> {
    const idx = MEMORY_STORE.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error(`客户不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },
}
