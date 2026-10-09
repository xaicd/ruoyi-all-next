/**
 * SystemRole Types and Definitions
 */

export type SystemRoleRow = {
  id: string
  name: string
  code: string
  sort: number
  status: string
  dataScope: string
  remark: string | null
  tenantId: string | null
  createdAt: string
  updatedAt: string
}

export type CreateRoleData = {
  name: string
  code: string
  sort?: number
  status?: string
  dataScope?: string
  remark?: string
}

export type UpdateRoleData = Partial<CreateRoleData>

export type RoleListParams = {
  page: number
  pageSize: number
  keyword?: string
  status?: string
}
