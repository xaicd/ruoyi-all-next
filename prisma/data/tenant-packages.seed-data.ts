export type TenantPackageSeed = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  menuIds: string[]
  remark: string | null
  createdAt: string
  updatedAt: string
}

const CREATED_AT = "2026-01-01T00:00:00.000Z"

export const SEED_TENANT_PACKAGES: TenantPackageSeed[] = [
  { id: "1", name: "基础版", status: "ACTIVE", menuIds: ["1", "100", "101", "102", "103", "104", "105", "1001", "1002", "1003"], remark: "基础系统管理功能", createdAt: CREATED_AT, updatedAt: CREATED_AT },
  { id: "2", name: "专业版", status: "ACTIVE", menuIds: ["1", "2", "100", "101", "102", "103", "104", "105", "1001", "1002", "1003"], remark: "系统管理 + 基础设施", createdAt: CREATED_AT, updatedAt: CREATED_AT },
  { id: "3", name: "旗舰版", status: "ACTIVE", menuIds: [], remark: "全部功能（未配置菜单即为全部）", createdAt: CREATED_AT, updatedAt: CREATED_AT },
]
