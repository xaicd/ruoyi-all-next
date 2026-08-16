import type { SystemMenuRow } from "@/modules/system/backend/repositories/menu.repository"

export const ONLINE_MENU_ID = "114"
export const ONLINE_TEST_MENU_ID = "online-114-test-page"
export const ONLINE_MENU_PERMISSION = "infra:online-definition:query"

export const ONLINE_MENU_ENTRIES: SystemMenuRow[] = [
  { id: ONLINE_MENU_ID, name: "业务建模（Online）", permission: ONLINE_MENU_PERMISSION, type: "MENU", parentId: "2", path: "online-definitions", component: "infra/online-definition/index", icon: "fa:wpforms", sort: 2, status: "ACTIVE", visible: true, keepAlive: true, createdAt: "2026-08-26T00:00:00.000Z", updatedAt: "2026-08-26T00:00:00.000Z" },
  // AUTO报表是租户套餐内可授权功能；租户管理员与运营角色按角色菜单授权使用。
  { id: ONLINE_TEST_MENU_ID, name: "AUTO报表", permission: "report:custom-sql:execute", type: "MENU", parentId: "2", path: "online-test", component: "infra/online-test/index", icon: "ep:aim", sort: 3, status: "ACTIVE", visible: true, keepAlive: true, createdAt: "2026-08-29T00:00:00.000Z", updatedAt: "2026-08-29T00:00:00.000Z" },
  { id: "online-114-query", name: "Online 定义查询", permission: "infra:online-definition:query", type: "BUTTON", parentId: ONLINE_MENU_ID, path: null, component: null, icon: null, sort: 1, status: "ACTIVE", visible: true, keepAlive: true, createdAt: "2026-08-26T00:00:00.000Z", updatedAt: "2026-08-26T00:00:00.000Z" },
  { id: "online-114-create", name: "Online 定义新增", permission: "infra:online-definition:create", type: "BUTTON", parentId: ONLINE_MENU_ID, path: null, component: null, icon: null, sort: 2, status: "ACTIVE", visible: true, keepAlive: true, createdAt: "2026-08-26T00:00:00.000Z", updatedAt: "2026-08-26T00:00:00.000Z" },
  { id: "online-114-update", name: "Online 定义修改", permission: "infra:online-definition:update", type: "BUTTON", parentId: ONLINE_MENU_ID, path: null, component: null, icon: null, sort: 3, status: "ACTIVE", visible: true, keepAlive: true, createdAt: "2026-08-26T00:00:00.000Z", updatedAt: "2026-08-26T00:00:00.000Z" },
  { id: "online-114-delete", name: "Online 定义删除", permission: "infra:online-definition:delete", type: "BUTTON", parentId: ONLINE_MENU_ID, path: null, component: null, icon: null, sort: 4, status: "ACTIVE", visible: true, keepAlive: true, createdAt: "2026-08-26T00:00:00.000Z", updatedAt: "2026-08-26T00:00:00.000Z" },
  { id: "online-114-publish", name: "Online 定义发布", permission: "infra:online-definition:publish", type: "BUTTON", parentId: ONLINE_MENU_ID, path: null, component: null, icon: null, sort: 5, status: "ACTIVE", visible: true, keepAlive: true, createdAt: "2026-08-26T00:00:00.000Z", updatedAt: "2026-08-26T00:00:00.000Z" },
  { id: "online-114-test", name: "Online 在线测试", permission: "infra:online-definition:test", type: "BUTTON", parentId: ONLINE_MENU_ID, path: null, component: null, icon: null, sort: 6, status: "ACTIVE", visible: true, keepAlive: true, createdAt: "2026-08-26T00:00:00.000Z", updatedAt: "2026-08-26T00:00:00.000Z" },
  { id: "online-114-generate", name: "Online 生成代码", permission: "infra:online-definition:generate", type: "BUTTON", parentId: ONLINE_MENU_ID, path: null, component: null, icon: null, sort: 7, status: "ACTIVE", visible: true, keepAlive: true, createdAt: "2026-08-26T00:00:00.000Z", updatedAt: "2026-08-26T00:00:00.000Z" },
  { id: "online-114-migrate", name: "Online 执行迁移", permission: "infra:online-definition:migrate", type: "BUTTON", parentId: ONLINE_MENU_ID, path: null, component: null, icon: null, sort: 8, status: "ACTIVE", visible: true, keepAlive: true, createdAt: "2026-08-26T00:00:00.000Z", updatedAt: "2026-08-26T00:00:00.000Z" },
]

export function withOnlineMenuCatalog(menus: SystemMenuRow[]): SystemMenuRow[] {
  const onlineIds = new Set(ONLINE_MENU_ENTRIES.map((entry) => entry.id))
  return [...menus.filter((menu) => !onlineIds.has(menu.id)), ...ONLINE_MENU_ENTRIES]
}

export function withOnlinePackageMenuIds(menuIds: Iterable<string>): string[] {
  const result = new Set(menuIds)
  if (result.has(ONLINE_MENU_ID)) for (const entry of ONLINE_MENU_ENTRIES) result.add(entry.id)
  return [...result]
}
