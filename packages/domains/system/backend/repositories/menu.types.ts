/**
 * SystemMenu Types & Constants
 */

export type SystemMenuRow = {
  id: string
  name: string
  permission: string | null
  type: string // DIR | MENU | BUTTON
  parentId: string | null
  path: string | null
  component: string | null
  icon: string | null
  sort: number
  status: string
  visible: boolean
  keepAlive: boolean
  createdAt: string
  updatedAt: string
}

export type CreateMenuData = {
  name: string
  permission?: string
  type: string
  parentId?: string | null
  path?: string
  component?: string
  icon?: string
  sort?: number
  status?: string
  visible?: boolean
  keepAlive?: boolean
}

export type UpdateMenuData = Partial<CreateMenuData>

// 历史废弃旧菜单 ID 物理隔离黑名单（彻底防御真实数据库或内存遗留）
export const LEGACY_PURGE_IDS = new Set([
  "2758", "2759", "2760", "2783", "2792", "2796", "2798", "2915", "5000",
  "9000", "9001", "9002", "9003", "9004", "9005",
  "9100", "9101", "9102", "9103", "9104",
  "9200", "9201", "9202", "9203",
  "9300", "9301",
  "9400", "9401", "9402", "9403",
  "ai-gateway-dir",
])
