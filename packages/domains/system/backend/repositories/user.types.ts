/**
 * SystemUser Types and Definitions
 */

export type SystemUserRow = {
  id: string
  username: string
  nickname: string
  password: string
  salt: string
  phone: string | null
  email: string | null
  avatar: string | null
  status: string
  deptId: string | null
  remark: string | null
  tenantId: string | null
  createdAt: string
  updatedAt: string
}

export type CreateUserData = {
  username: string
  nickname: string
  password: string
  salt: string
  phone?: string
  email?: string
  deptId?: string
  status?: string
  remark?: string
  tenantId?: string
}

export type UpdateUserData = Partial<Omit<CreateUserData, "username">> & {
  username?: string
}

export type UserListParams = {
  page: number
  pageSize: number
  keyword?: string
  status?: string
  deptId?: string
  tenantId?: string
}
