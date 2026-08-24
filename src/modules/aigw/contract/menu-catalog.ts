export const AIGW_DIR_ID = "aigw-dir"
export const AIGW_ROUTING_DIR_ID = "aigw-routing-dir"
export const AIGW_IDENTITY_DIR_ID = "aigw-identity-dir"
export const AIGW_APP_DIR_ID = "aigw-app-dir"
export const AIGW_TARIFF_DIR_ID = "aigw-tariff-dir"
export const AIGW_SETTLEMENT_DIR_ID = "aigw-settlement-dir"

export const AIGW_WORKBENCH_MENU_ID = "aigw-workbench"
export const AIGW_DASHBOARD_MENU_ID = "aigw-dashboard"
export const AIGW_PLAYGROUND_MENU_ID = "aigw-playground"
export const AIGW_CHANNELS_MENU_ID = "aigw-channels"
export const AIGW_MODELS_MENU_ID = "aigw-models"
export const AIGW_TOKENS_MENU_ID = "aigw-tokens"
export const AIGW_USAGES_MENU_ID = "aigw-usages"

export const AIGW_ENTERPRISES_MENU_ID = "aigw-enterprises"
export const AIGW_TENANT_MEMBERS_MENU_ID = "aigw-tenant-members"
export const AIGW_SEATS_MENU_ID = "aigw-seats"
export const AIGW_QUOTAS_MENU_ID = "aigw-quotas"

export const AIGW_ISV_APPS_MENU_ID = "aigw-isv-apps"
export const AIGW_MCP_HUB_MENU_ID = "aigw-mcp-hub"
export const AIGW_CHATS_MENU_ID = "aigw-chats"

export const AIGW_TARIFFS_MENU_ID = "aigw-tariffs"
export const AIGW_SKUS_MENU_ID = "aigw-skus"
export const AIGW_PIPELINES_MENU_ID = "aigw-pipelines"
export const AIGW_CONTRACTS_MENU_ID = "aigw-contracts"
export const AIGW_INVOICES_MENU_ID = "aigw-invoices"
export const AIGW_PARTNER_PORTAL_MENU_ID = "aigw-partner-portal"
export const AIGW_PARTNERS_MENU_ID = "aigw-partners"
export const AIGW_LEADS_MENU_ID = "aigw-leads"

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
  // 1 级主目录：模型中台 (/admin/aigw)
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

  // 2 级分组 1：算力中枢
  {
    id: AIGW_ROUTING_DIR_ID,
    name: "算力中枢",
    permission: "aigw:channel:view",
    type: "DIR",
    parentId: AIGW_DIR_ID,
    path: "routing",
    component: null,
    icon: "ep:guide",
    sort: 1,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_WORKBENCH_MENU_ID,
    name: "体验中心",
    permission: "aigw:usage:view",
    type: "MENU",
    parentId: AIGW_ROUTING_DIR_ID,
    path: "workbench",
    component: "aigw/workbench/index",
    icon: "ep:service",
    sort: 1,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_DASHBOARD_MENU_ID,
    name: "监控大屏",
    permission: "aigw:usage:view",
    type: "MENU",
    parentId: AIGW_ROUTING_DIR_ID,
    path: "dashboard",
    component: "aigw/dashboard/index",
    icon: "ep:data-analysis",
    sort: 2,
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
    parentId: AIGW_ROUTING_DIR_ID,
    path: "playground",
    component: "aigw/playground/index",
    icon: "ep:monitor",
    sort: 3,
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
    parentId: AIGW_ROUTING_DIR_ID,
    path: "channels",
    component: "aigw/channels/index",
    icon: "ep:connection",
    sort: 4,
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
    parentId: AIGW_ROUTING_DIR_ID,
    path: "models",
    component: "aigw/models/index",
    icon: "ep:collection",
    sort: 5,
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
    parentId: AIGW_ROUTING_DIR_ID,
    path: "tokens",
    component: "aigw/tokens/index",
    icon: "fa:key",
    sort: 6,
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
    parentId: AIGW_ROUTING_DIR_ID,
    path: "usages",
    component: "aigw/usages/index",
    icon: "fa:tasks",
    sort: 7,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },

  // 2 级分组 2：企业管理
  {
    id: AIGW_IDENTITY_DIR_ID,
    name: "企业管理",
    permission: "entitlement:enterprise:query",
    type: "DIR",
    parentId: AIGW_DIR_ID,
    path: "identity",
    component: null,
    icon: "ep:avatar",
    sort: 2,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_ENTERPRISES_MENU_ID,
    name: "算力开户",
    permission: "entitlement:enterprise:query",
    type: "MENU",
    parentId: AIGW_IDENTITY_DIR_ID,
    path: "enterprises",
    component: "aigw/enterprises/index",
    icon: "ep:office-building",
    sort: 1,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_TENANT_MEMBERS_MENU_ID,
    name: "成员席位",
    permission: "entitlement:enterprise:query",
    type: "MENU",
    parentId: AIGW_IDENTITY_DIR_ID,
    path: "tenant-members",
    component: "aigw/tenant-members/index",
    icon: "ep:user",
    sort: 2,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_QUOTAS_MENU_ID,
    name: "配额管控",
    permission: "entitlement:quota:query",
    type: "MENU",
    parentId: AIGW_IDENTITY_DIR_ID,
    path: "quotas",
    component: "aigw/quotas/index",
    icon: "ep:pie-chart",
    sort: 4,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },

  // 2 级分组 3：应用生态
  {
    id: AIGW_APP_DIR_ID,
    name: "生态应用",
    permission: "aigw:channel:view",
    type: "DIR",
    parentId: AIGW_DIR_ID,
    path: "app-ecosystem",
    component: null,
    icon: "ep:app",
    sort: 3,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_ISV_APPS_MENU_ID,
    name: "生态应用",
    permission: "aigw:channel:view",
    type: "MENU",
    parentId: AIGW_APP_DIR_ID,
    path: "isv-apps",
    component: "aigw/isv-apps/index",
    icon: "ep:app",
    sort: 1,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_MCP_HUB_MENU_ID,
    name: "私有工具",
    permission: "aigw:channel:view",
    type: "MENU",
    parentId: AIGW_APP_DIR_ID,
    path: "mcp-hub",
    component: "aigw/mcp-hub/index",
    icon: "ep:cpu",
    sort: 2,
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
    parentId: AIGW_APP_DIR_ID,
    path: "chats",
    component: "aigw/chats/index",
    icon: "ep:message",
    sort: 3,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },

  // 2 级分组 4：资费清分
  {
    id: AIGW_SETTLEMENT_DIR_ID,
    name: "资费清分",
    permission: "split:pipeline:query",
    type: "DIR",
    parentId: AIGW_DIR_ID,
    path: "settlement",
    component: null,
    icon: "ep:document",
    sort: 4,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_TARIFFS_MENU_ID,
    name: "阶梯资费",
    permission: "meter:tariff:query",
    type: "MENU",
    parentId: AIGW_SETTLEMENT_DIR_ID,
    path: "tariffs",
    component: "aigw/tariffs/index",
    icon: "ep:price-tag",
    sort: 1,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_SKUS_MENU_ID,
    name: "算力油包",
    permission: "scheme:sku:query",
    type: "MENU",
    parentId: AIGW_SETTLEMENT_DIR_ID,
    path: "skus",
    component: "aigw/skus/index",
    icon: "ep:box",
    sort: 2,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_PIPELINES_MENU_ID,
    name: "渠道清分",
    permission: "split:pipeline:query",
    type: "MENU",
    parentId: AIGW_SETTLEMENT_DIR_ID,
    path: "pipelines",
    component: "aigw/pipelines/index",
    icon: "ep:help",
    sort: 3,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_CONTRACTS_MENU_ID,
    name: "合同账务",
    permission: "settlement:contract:query",
    type: "MENU",
    parentId: AIGW_SETTLEMENT_DIR_ID,
    path: "contracts",
    component: "aigw/contracts/index",
    icon: "ep:files",
    sort: 4,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_INVOICES_MENU_ID,
    name: "对公发票",
    permission: "settlement:invoice:query",
    type: "MENU",
    parentId: AIGW_SETTLEMENT_DIR_ID,
    path: "invoices",
    component: "aigw/invoices/index",
    icon: "ep:wallet",
    sort: 5,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-23T00:00:00.000Z",
    updatedAt: "2026-08-23T00:00:00.000Z",
  },
  {
    id: AIGW_PARTNER_PORTAL_MENU_ID,
    name: "渠道门户",
    permission: "aigw:channel:view",
    type: "MENU",
    parentId: AIGW_SETTLEMENT_DIR_ID,
    path: "partner-portal",
    component: "aigw/partner-portal/index",
    icon: "ep:data-line",
    sort: 6,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  {
    id: AIGW_PARTNERS_MENU_ID,
    name: "代理商户",
    permission: "aigw:partner:view",
    type: "MENU",
    parentId: AIGW_SETTLEMENT_DIR_ID,
    path: "aigw-partner",
    component: "aigw/aigw-partner/index",
    icon: "ep:user",
    sort: 7,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  {
    id: AIGW_LEADS_MENU_ID,
    name: "商机报备",
    permission: "aigw:partner-lead:view",
    type: "MENU",
    parentId: AIGW_SETTLEMENT_DIR_ID,
    path: "aigw-partner-lead",
    component: "aigw/aigw-partner-lead/index",
    icon: "ep:folder-checked",
    sort: 8,
    status: "ACTIVE",
    visible: true,
    keepAlive: true,
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
]

export const AIGW_PACKAGE_MENU_IDS = [
  AIGW_DIR_ID,
  AIGW_ROUTING_DIR_ID,
  AIGW_IDENTITY_DIR_ID,
  AIGW_APP_DIR_ID,
  AIGW_SETTLEMENT_DIR_ID,
  AIGW_WORKBENCH_MENU_ID,
  AIGW_DASHBOARD_MENU_ID,
  AIGW_PLAYGROUND_MENU_ID,
  AIGW_CHANNELS_MENU_ID,
  AIGW_MODELS_MENU_ID,
  AIGW_TOKENS_MENU_ID,
  AIGW_USAGES_MENU_ID,
  AIGW_ENTERPRISES_MENU_ID,
  AIGW_TENANT_MEMBERS_MENU_ID,
  AIGW_SEATS_MENU_ID,
  AIGW_QUOTAS_MENU_ID,
  AIGW_ISV_APPS_MENU_ID,
  AIGW_MCP_HUB_MENU_ID,
  AIGW_CHATS_MENU_ID,
  AIGW_TARIFFS_MENU_ID,
  AIGW_SKUS_MENU_ID,
  AIGW_PIPELINES_MENU_ID,
  AIGW_CONTRACTS_MENU_ID,
  AIGW_INVOICES_MENU_ID,
]

// 历史遗留旧 RuoYi 模型中台树节点全量清除清单
const LEGACY_PURGE_MENU_IDS = [
  "2758", "2759", "2760", "2783", "2792", "2796", "2798", "2915", "5000",
  "9000", "9001", "9002", "9003", "9004", "9005",
  "9100", "9101", "9102", "9103", "9104",
  "9200", "9201", "9202", "9203",
  "9300", "9301",
  "9400", "9401", "9402", "9403",
  "ai-gateway-dir",
]

export function withAigwMenuCatalog<T extends { id: string }>(menus: T[]): T[] {
  const byId = new Map(menus.map((item) => [item.id, item]))
  // 1. 彻底拔除历史老旧模型中台（2758）整棵树与旧 9000 散落节点
  for (const removeId of LEGACY_PURGE_MENU_IDS) {
    byId.delete(removeId)
  }
  // 2. 注入唯一权威的全新 RoMA 模型中台 5 大标准化分组结构
  for (const entry of AIGW_MENU_ENTRIES) {
    byId.set(entry.id, entry as unknown as T)
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
