/**
 * SystemTenantPackage Repository - 租户套餐
 * 对标 RuoYi TenantPackage：定义套餐可用菜单范围
 */

import type { PageResult } from "@/modules/shared/backend/lib/database"

export type TenantPackageRow = {
  id: string
  name: string
  status: string
  menuIds: string[] // 该套餐包含的菜单 ID
  remark: string | null
  createdAt: string
  updatedAt: string
}

export type CreateTenantPackageData = { name: string; status?: string; menuIds?: string[]; remark?: string }
export type UpdateTenantPackageData = Partial<CreateTenantPackageData>

const MEMORY_STORE: TenantPackageRow[] = [
  { id: "1", name: "基础版", status: "ACTIVE", menuIds: ["1", "100", "101", "102", "103", "104", "105", "1001", "1002", "1003"], remark: "基础系统管理功能", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", name: "专业版", status: "ACTIVE", menuIds: ["1", "2", "100", "101", "102", "103", "104", "105", "1001", "1002", "1003"], remark: "系统管理 + 基础设施", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "3", name: "旗舰版", status: "ACTIVE", menuIds: [], remark: "全部功能（menuIds 为空表示全部）", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
]
let memoryIdSeq = 100

export const TenantPackageRepository = {
  async findList(params: { page: number; pageSize: number; keyword?: string }): Promise<PageResult<TenantPackageRow>> {
    let filtered = [...MEMORY_STORE]
    if (params.keyword) { const kw = params.keyword.toLowerCase(); filtered = filtered.filter((p) => p.name.toLowerCase().includes(kw)) }
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },

  async findAll(): Promise<TenantPackageRow[]> {
    return [...MEMORY_STORE]
  },

  async findById(id: string): Promise<TenantPackageRow | null> {
    return MEMORY_STORE.find((p) => p.id === id) ?? null
  },

  async create(data: CreateTenantPackageData): Promise<TenantPackageRow> {
    const now = new Date().toISOString()
    const row: TenantPackageRow = { id: String(++memoryIdSeq), name: data.name, status: data.status ?? "ACTIVE", menuIds: data.menuIds ?? [], remark: data.remark ?? null, createdAt: now, updatedAt: now }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: UpdateTenantPackageData): Promise<TenantPackageRow> {
    const idx = MEMORY_STORE.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error(`套餐不存在: ${id}`)
    const pkg = MEMORY_STORE[idx]
    const updated: TenantPackageRow = { ...pkg, name: data.name ?? pkg.name, status: data.status ?? pkg.status, menuIds: data.menuIds ?? pkg.menuIds, remark: data.remark !== undefined ? (data.remark ?? null) : pkg.remark, updatedAt: new Date().toISOString() }
    MEMORY_STORE[idx] = updated
    return updated
  },

  async delete(id: string): Promise<void> {
    const idx = MEMORY_STORE.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error(`套餐不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },
}
