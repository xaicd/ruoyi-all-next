export const AI_APP_DIR_ID = "ai-app-dir"
export const AI_CHAT_CONVERSATION_MENU_ID = "ai-app-chat-conversation"
export const AI_CHAT_ROLE_MENU_ID = "ai-app-chat-role"
export const AI_KNOWLEDGE_MENU_ID = "ai-app-knowledge"
export const AI_IMAGE_MENU_ID = "ai-app-image"
export const AI_MIND_MAP_MENU_ID = "ai-app-mind-map"
export const AI_WRITE_MENU_ID = "ai-app-write"
export const AI_WORKFLOW_MENU_ID = "ai-app-workflow"

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
    id: AI_APP_DIR_ID,
    name: "AI 智汇应用",
    permission: "ai:chat-conversation:query",
    type: "DIR",
    parentId: null,
    path: "/admin/ai",
    component: null,
    icon: "ep:cpu",
    sort: 15,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_CHAT_CONVERSATION_MENU_ID,
    name: "对话聊天",
    permission: "ai:chat-conversation:query",
    type: "MENU",
    parentId: AI_APP_DIR_ID,
    path: "ai-chat-conversation",
    component: "ai/chat-conversation/index",
    icon: "ep:chat-dot-round",
    sort: 1,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_CHAT_ROLE_MENU_ID,
    name: "角色智能体",
    permission: "ai:chat-role:query",
    type: "MENU",
    parentId: AI_APP_DIR_ID,
    path: "ai-chat-role",
    component: "ai/chat-role/index",
    icon: "ep:user",
    sort: 2,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_KNOWLEDGE_MENU_ID,
    name: "知识库 (RAG)",
    permission: "ai:knowledge:query",
    type: "MENU",
    parentId: AI_APP_DIR_ID,
    path: "ai-knowledge",
    component: "ai/knowledge/index",
    icon: "ep:reading",
    sort: 3,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_IMAGE_MENU_ID,
    name: "AI 绘画",
    permission: "ai:image:query",
    type: "MENU",
    parentId: AI_APP_DIR_ID,
    path: "ai-image",
    component: "ai/image/index",
    icon: "ep:picture",
    sort: 4,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_MIND_MAP_MENU_ID,
    name: "AI 脑图",
    permission: "ai:mind-map:query",
    type: "MENU",
    parentId: AI_APP_DIR_ID,
    path: "ai-mind-map",
    component: "ai/mind-map/index",
    icon: "ep:share",
    sort: 5,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_WRITE_MENU_ID,
    name: "AI 写作",
    permission: "ai:write:query",
    type: "MENU",
    parentId: AI_APP_DIR_ID,
    path: "ai-write",
    component: "ai/write/index",
    icon: "ep:edit-pen",
    sort: 6,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AI_WORKFLOW_MENU_ID,
    name: "工作流编排",
    permission: "ai:workflow:query",
    type: "MENU",
    parentId: AI_APP_DIR_ID,
    path: "ai-workflow",
    component: "ai/workflow/index",
    icon: "ep:operation",
    sort: 7,
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
