import { randomUUID } from "node:crypto"

export interface AigwMemberAllocationRow {
  id: string
  tenantId: string
  phone: string
  name: string
  deptName: string
  monthlyTokenCap: number
  usedTokens: number
  momaBeansBalance: number
  allowedApps: string[]
  status: "ACTIVE" | "DISABLED"
  lastLoginAt?: string
  createdAt: string
  updatedAt?: string
}

export const SEED_MEMBER_ALLOCATIONS: AigwMemberAllocationRow[] = [
  {
    id: "mem-001",
    tenantId: "1",
    phone: "13800000001",
    name: "李总 (政企信息化主管)",
    deptName: "数智创新部",
    monthlyTokenCap: 10_000_000,
    usedTokens: 2_450_000,
    momaBeansBalance: 7550,
    allowedApps: ["workbuddy", "qoder", "trae"],
    status: "ACTIVE",
    lastLoginAt: "2026-08-24T10:30:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "mem-002",
    tenantId: "1",
    phone: "13911112222",
    name: "张工 (核心研发架构师)",
    deptName: "技术研发中心",
    monthlyTokenCap: 20_000_000,
    usedTokens: 14_800_000,
    momaBeansBalance: 5200,
    allowedApps: ["qoder", "trae"],
    status: "ACTIVE",
    lastLoginAt: "2026-08-24T11:15:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "mem-003",
    tenantId: "1",
    phone: "13766668888",
    name: "王主任 (政务综合办)",
    deptName: "行政综合部",
    monthlyTokenCap: 5_000_000,
    usedTokens: 860_000,
    momaBeansBalance: 4140,
    allowedApps: ["workbuddy"],
    status: "ACTIVE",
    lastLoginAt: "2026-08-24T09:20:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
]

const MEMORY_STORE: AigwMemberAllocationRow[] = [...SEED_MEMBER_ALLOCATIONS]

export const AigwMemberAllocationRepository = {
  async findAll(params?: { tenantId?: string; keyword?: string; status?: string }): Promise<AigwMemberAllocationRow[]> {
    let list = [...MEMORY_STORE]
    if (params?.tenantId) list = list.filter((r) => r.tenantId === params.tenantId)
    if (params?.status) list = list.filter((r) => r.status === params.status)
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter((r) => r.name.toLowerCase().includes(kw) || r.phone.includes(kw) || r.deptName.toLowerCase().includes(kw))
    }
    return list
  },

  async findByPhone(phone: string): Promise<AigwMemberAllocationRow | null> {
    return MEMORY_STORE.find((r) => r.phone === phone) ?? null
  },

  async findById(id: string): Promise<AigwMemberAllocationRow | null> {
    return MEMORY_STORE.find((r) => r.id === id) ?? null
  },

  async create(data: Omit<AigwMemberAllocationRow, "id" | "createdAt" | "usedTokens">): Promise<AigwMemberAllocationRow> {
    const row: AigwMemberAllocationRow = {
      ...data,
      id: `mem-${Date.now().toString(36)}-${randomUUID().slice(0, 4)}`,
      usedTokens: 0,
      createdAt: new Date().toISOString(),
    }
    MEMORY_STORE.unshift(row)
    return row
  },

  async update(id: string, data: Partial<AigwMemberAllocationRow>): Promise<AigwMemberAllocationRow | null> {
    const idx = MEMORY_STORE.findIndex((r) => r.id === id)
    if (idx === -1) return null
    MEMORY_STORE[idx] = { ...MEMORY_STORE[idx], ...data, updatedAt: new Date().toISOString() }
    return MEMORY_STORE[idx]
  },

  async recordUsage(phone: string, deltaTokens: number): Promise<boolean> {
    const mem = MEMORY_STORE.find((r) => r.phone === phone)
    if (!mem) return false
    mem.usedTokens += deltaTokens
    // 每 1000 Token 折合消耗 1 移动豆
    const deltaBeans = Math.ceil(deltaTokens / 1000)
    mem.momaBeansBalance = Math.max(0, mem.momaBeansBalance - deltaBeans)
    mem.lastLoginAt = new Date().toISOString()
    return true
  },

  async delete(id: string): Promise<boolean> {
    const idx = MEMORY_STORE.findIndex((r) => r.id === id)
    if (idx === -1) return false
    MEMORY_STORE.splice(idx, 1)
    return true
  },
}

export const aigwMemberAllocationRepository = AigwMemberAllocationRepository
