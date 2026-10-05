/**
 * 侧边栏「组件标识 -> 本仓路由」的映射（**单一真源**）。
 *
 * 两个消费方:
 *   1. `menu.service.ts` 的 getSidebarNav —— 决定菜单点下去去哪
 *   2. `scripts/seed-postgresql.ts` —— 判断哪些菜单**没有落地页**（component 映射不到、
 *      path 又不是绝对路由），把它们隐藏，避免侧边栏出现点不动的死条目
 *
 * 为什么必须共用一份: 种子里的菜单来资源框架的 SQL，其中只有一部分在本仓有页面。
 * 如果两边各写一份判断，迟早漂移成"服务认为能点、种子认为该藏"。
 */
export const SIDEBAR_COMPONENT_ROUTES: Record<string, string> = {
      "system/user/index": "/admin/system/users", "system/role/index": "/admin/system/roles", "system/menu/index": "/admin/system/menus",
      "system/dept/index": "/admin/system/depts", "system/post/index": "/admin/system/posts", "system/dict/index": "/admin/system/dicts",
      "system/tenant/index": "/admin/system/tenants", "system/tenantPackage/index": "/admin/system/tenant-packages", "system/notice/index": "/admin/system/notices",
      "system/loginlog/index": "/admin/system/login-logs", "system/operatelog/index": "/admin/system/operate-logs", "system/oauth2/client/index": "/admin/system/oauth2-clients",
      "system/oauth2/token/index": "/admin/system/oauth2-tokens", "system/sms/channel/index": "/admin/system/sms-channels", "system/sms/log/index": "/admin/system/sms-logs",
      "system/mail/account/index": "/admin/system/mail-accounts", "system/mail/log/index": "/admin/system/mail-logs", "infra/config/index": "/admin/infra/configs",
      "infra/job/index": "/admin/infra/job-center", "infra/file/index": "/admin/infra/files", "infra/dataSourceConfig/index": "/admin/infra/db-configs", "infra/codegen/index": "/admin/infra/codegen",
      "infra/build/index": "/admin/infra/page-builder", "infra/online-definition/index": "/admin/infra/online-definitions", "infra/online-test/index": "/admin/infra/online-test", "infra/apiAccessLog/index": "/admin/infra/api-access-log", "infra/apiErrorLog/index": "/admin/infra/api-error-logs",
      "pay/order/index": "/admin/pay/orders", "pay/refund/index": "/admin/pay/refunds", "crm/customer/index": "/admin/crm/customers", "crm/clue/index": "/admin/crm/clues",
      "aigw/workbench/index": "/admin/aigw/workbench", "aigw/dashboard/index": "/admin/aigw/dashboard",
      "aigw/isv-apps/index": "/admin/aigw/isv-apps", "aigw/mcp-hub/index": "/admin/aigw/mcp-hub",
      "aigw/tenant-members/index": "/admin/aigw/tenant-members",
      "aigw/channels/index": "/admin/aigw/channels", "aigw/models/index": "/admin/aigw/models", "aigw/tokens/index": "/admin/aigw/tokens",
      "aigw/usages/index": "/admin/aigw/usages", "aigw/playground/index": "/admin/aigw/playground", "aigw/chats/index": "/admin/aigw/chats",
      "aigw/enterprises/index": "/admin/aigw/enterprises", "aigw/seats/index": "/admin/aigw/seats", "aigw/quotas/index": "/admin/aigw/quotas",
      "aigw/tariffs/index": "/admin/aigw/tariffs", "aigw/skus/index": "/admin/aigw/skus", "aigw/pipelines/index": "/admin/aigw/pipelines",
      "aigw/contracts/index": "/admin/aigw/contracts", "aigw/invoices/index": "/admin/aigw/invoices",
      "ai/enterprises/index": "/admin/aigw/enterprises", "ai/seats/index": "/admin/aigw/seats", "ai/quotas/index": "/admin/aigw/quotas",
      "ai/tariffs/index": "/admin/aigw/tariffs", "ai/skus/index": "/admin/aigw/skus", "ai/pipelines/index": "/admin/aigw/pipelines",
      "ai/contracts/index": "/admin/aigw/contracts", "ai/invoices/index": "/admin/aigw/invoices",
      "ai/chat-conversation/index": "/admin/ai/ai-chat-conversation", "ai/chat-role/index": "/admin/ai/ai-chat-role",
      "ai/knowledge/index": "/admin/ai/ai-knowledge", "ai/image/index": "/admin/ai/ai-image",
      "ai/mind-map/index": "/admin/ai/ai-mind-map", "ai/write/index": "/admin/ai/ai-write",
      "ai/workflow/index": "/admin/ai/ai-workflow",
    }
