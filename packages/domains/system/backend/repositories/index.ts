/**
 * System 域 Repository 统一导出
 */

export { SystemUserRepository } from "./user.repository"
export type { SystemUserRow, CreateUserData, UpdateUserData, UserListParams } from "./user.repository"

export { SystemRoleRepository } from "./role.repository"
export type { SystemRoleRow, CreateRoleData, UpdateRoleData, RoleListParams } from "./role.repository"

export { SystemDeptRepository } from "./dept.repository"
export type { SystemDeptRow, CreateDeptData, UpdateDeptData } from "./dept.repository"

export { SystemMenuRepository } from "./menu.repository"
export type { SystemMenuRow, CreateMenuData, UpdateMenuData } from "./menu.repository"

export { SystemPostRepository } from "./post.repository"
export type { SystemPostRow, CreatePostData, UpdatePostData, PostListParams } from "./post.repository"

export { SystemDictTypeRepository, SystemDictDataRepository } from "./dict.repository"
export type { SystemDictTypeRow, SystemDictDataRow, CreateDictTypeData, CreateDictDataInput } from "./dict.repository"

export { SystemTenantRepository } from "./tenant.repository"
export type { SystemTenantRow, CreateTenantData, UpdateTenantData, TenantListParams } from "./tenant.repository"
