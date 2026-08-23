export const AIGW_DIR_ID = "aigw-dir"
export const AIGW_CHANNELS_MENU_ID = "aigw-channels"
export const AIGW_MODELS_MENU_ID = "aigw-models"
export const AIGW_TOKENS_MENU_ID = "aigw-tokens"
export const AIGW_USAGES_MENU_ID = "aigw-usages"
export const AIGW_PLAYGROUND_MENU_ID = "aigw-playground"
export const AIGW_CHATS_MENU_ID = "aigw-chats"

export type AigwMenuCatalogRow = {
  id: string
  name: string
  permission: string | null
  type: string
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

export const AIGW_MENU_ENTRIES: AigwMenuCatalogRow[] = [
  {
    id: AIGW_DIR_ID,
    name: "模型中台",
    permission: "aigw:channel:view",
    type: "DIR",
    parentId: null,
    path: "/admin/aigw",
    component: null,
    icon: "ep:aim",
    sort: 14,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_CHANNELS_MENU_ID,
    name: "上游渠道",
    permission: "aigw:channel:view",
    type: "MENU",
    parentId: AIGW_DIR_ID,
    path: "channels",
    component: "aigw/channel/index",
    icon: "ep:connection",
    sort: 1,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_MODELS_MENU_ID,
    name: "模型目录",
    permission: "aigw:model:view",
    type: "MENU",
    parentId: AIGW_DIR_ID,
    path: "models",
    component: "aigw/model/index",
    icon: "ep:collection",
    sort: 2,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_TOKENS_MENU_ID,
    name: "调用令牌",
    permission: "aigw:token:view",
    type: "MENU",
    parentId: AIGW_DIR_ID,
    path: "tokens",
    component: "aigw/token/index",
    icon: "fa:key",
    sort: 3,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_USAGES_MENU_ID,
    name: "用量日志",
    permission: "aigw:usage:view",
    type: "MENU",
    parentId: AIGW_DIR_ID,
    path: "usages",
    component: "aigw/usage/index",
    icon: "fa:tasks",
    sort: 4,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_PLAYGROUND_MENU_ID,
    name: "联调探测",
    permission: "aigw:playground:view",
    type: "MENU",
    parentId: AIGW_DIR_ID,
    path: "playground",
    component: "aigw/playground/index",
    icon: "ep:monitor",
    sort: 5,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_CHATS_MENU_ID,
    name: "对话记录",
    permission: "aigw:chat:view",
    type: "MENU",
    parentId: AIGW_DIR_ID,
    path: "chats",
    component: "aigw/chat/index",
    icon: "ep:message",
    sort: 6,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
]

export const AIGW_PACKAGE_MENU_IDS = [
  AIGW_DIR_ID,
  AIGW_CHANNELS_MENU_ID,
  AIGW_MODELS_MENU_ID,
  AIGW_TOKENS_MENU_ID,
  AIGW_USAGES_MENU_ID,
  AIGW_PLAYGROUND_MENU_ID,
  AIGW_CHATS_MENU_ID,
]

export function withAigwMenuCatalog<T extends { id: string }>(menus: T[]): T[] {
  const byId = new Map(menus.map((item) => [item.id, item]))
  for (const entry of AIGW_MENU_ENTRIES) {
    if (!byId.has(entry.id)) {
      byId.set(entry.id, entry as unknown as T)
    }
  }
  return [...byId.values()]
}

export function withAigwPackageMenuIds(menuIds: Iterable<string>): string[] {
  const set = new Set(menuIds)
  for (const id of AIGW_PACKAGE_MENU_IDS) {
    set.add(id)
  }
  return [...set]
}
