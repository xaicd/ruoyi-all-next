export const AI_GATEWAY_DIR_ID = "ai-gateway-dir"
export const AI_CHANNELS_MENU_ID = "ai-gateway-channels"
export const AI_MODELS_MENU_ID = "ai-gateway-models"
export const AI_TOKENS_MENU_ID = "ai-gateway-tokens"
export const AI_USAGES_MENU_ID = "ai-gateway-usages"
export const AI_PLAYGROUND_MENU_ID = "ai-gateway-playground"
export const AI_CHATS_MENU_ID = "ai-gateway-chats"

export type AiMenuCatalogRow = {
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

export const AI_MENU_ENTRIES: AiMenuCatalogRow[] = [
  {
    id: AI_GATEWAY_DIR_ID,
    name: "模型中台",
    permission: "ai:channel:view",
    type: "DIR",
    parentId: null,
    path: "/admin/ai",
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
    id: AI_CHANNELS_MENU_ID,
    name: "上游渠道",
    permission: "ai:channel:view",
    type: "MENU",
    parentId: AI_GATEWAY_DIR_ID,
    path: "channels",
    component: "ai/channel/index",
    icon: "ep:connection",
    sort: 1,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_MODELS_MENU_ID,
    name: "模型目录",
    permission: "ai:model:view",
    type: "MENU",
    parentId: AI_GATEWAY_DIR_ID,
    path: "models",
    component: "ai/model/index",
    icon: "ep:collection",
    sort: 2,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_TOKENS_MENU_ID,
    name: "调用令牌",
    permission: "ai:token:view",
    type: "MENU",
    parentId: AI_GATEWAY_DIR_ID,
    path: "tokens",
    component: "ai/token/index",
    icon: "fa:key",
    sort: 3,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_USAGES_MENU_ID,
    name: "用量日志",
    permission: "ai:usage:view",
    type: "MENU",
    parentId: AI_GATEWAY_DIR_ID,
    path: "usages",
    component: "ai/usage/index",
    icon: "fa:tasks",
    sort: 4,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_PLAYGROUND_MENU_ID,
    name: "联调探测",
    permission: "ai:playground:view",
    type: "MENU",
    parentId: AI_GATEWAY_DIR_ID,
    path: "playground",
    component: "ai/playground/index",
    icon: "ep:monitor",
    sort: 5,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_CHATS_MENU_ID,
    name: "对话记录",
    permission: "ai:chat:view",
    type: "MENU",
    parentId: AI_GATEWAY_DIR_ID,
    path: "chats",
    component: "ai/chat/index",
    icon: "ep:message",
    sort: 6,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
]

export function withAiMenuCatalog<T extends { id: string }>(menus: T[]): T[] {
  const aiIds = new Set(AI_MENU_ENTRIES.map((entry) => entry.id))
  return [...menus.filter((menu) => !aiIds.has(menu.id)), ...(AI_MENU_ENTRIES as unknown as T[])]
}

export function withAiPackageMenuIds(menuIds: Iterable<string>): string[] {
  const result = new Set(menuIds)
  for (const entry of AI_MENU_ENTRIES) {
    result.add(entry.id)
  }
  return [...result]
}
