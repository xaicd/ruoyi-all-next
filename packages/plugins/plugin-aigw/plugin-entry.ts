/**
 * aigw 域的**插件入口**（合并/同进程形态）。由 scripts/scaffold-domain-plugin.cjs 生成。
 *
 * 设计要点: 不重写业务逻辑 —— 处理器仍是包内 routes 目录下那些已被
 * withAdminRoute / withAppRoute 包装过的函数（鉴权/权限码/schema 校验都在里面），
 * 这里只做一层适配: 宿主的 {method,path,query,body,headers} -> Request -> Response -> {status,body}。
 *
 * 为什么用静态 import: 仓内第一方插件是 TS, 宿主无法用运行期 import() 加载（Node 不认 TS）,
 * 而模板字符串动态 import 在 Turbopack 下也无法解析 —— 必须显式列出每条 import。
 */
import { definePlugin } from "@ruoyi/plugin-sdk"

import * as route_admin_auth_agent_verify from "@/modules/aigw/routes/admin/auth/agent-verify/route"
import * as route_admin_carriers from "@/modules/aigw/routes/admin/carriers/route"
import * as route_admin_channels from "@/modules/aigw/routes/admin/channels/route"
import * as route_admin_contracts from "@/modules/aigw/routes/admin/contracts/route"
import * as route_admin_dashboard from "@/modules/aigw/routes/admin/dashboard/route"
import * as route_admin_demo_execute from "@/modules/aigw/routes/admin/demo/execute/route"
import * as route_admin_enterprises from "@/modules/aigw/routes/admin/enterprises/route"
import * as route_admin_invoices from "@/modules/aigw/routes/admin/invoices/route"
import * as route_admin_isv_apps from "@/modules/aigw/routes/admin/isv-apps/route"
import * as route_admin_ledgers from "@/modules/aigw/routes/admin/ledgers/route"
import * as route_admin_mcp_hub from "@/modules/aigw/routes/admin/mcp-hub/route"
import * as route_admin_models from "@/modules/aigw/routes/admin/models/route"
import * as route_admin_pipelines from "@/modules/aigw/routes/admin/pipelines/route"
import * as route_admin_quotas from "@/modules/aigw/routes/admin/quotas/route"
import * as route_admin_seats from "@/modules/aigw/routes/admin/seats/route"
import * as route_admin_skus from "@/modules/aigw/routes/admin/skus/route"
import * as route_admin_tariffs from "@/modules/aigw/routes/admin/tariffs/route"
import * as route_admin_tenant_members from "@/modules/aigw/routes/admin/tenant-members/route"
import * as route_admin_tokens from "@/modules/aigw/routes/admin/tokens/route"
import * as route_admin_usages from "@/modules/aigw/routes/admin/usages/route"
import * as route_open_chat_completions from "@/modules/aigw/routes/open/chat/completions/route"
import * as route_open_embeddings from "@/modules/aigw/routes/open/embeddings/route"
import * as route_open_models from "@/modules/aigw/routes/open/models/route"
import * as route_open_quota from "@/modules/aigw/routes/open/quota/route"

async function invoke(handler: (request: Request, context?: unknown) => Promise<Response> | Response, input: any) {
  const url = new URL(`http://plugin.invalid${input.path}`)
  for (const [key, value] of Object.entries(input.query ?? {})) url.searchParams.set(key, String(value))
  const request = new Request(url, {
    method: input.method,
    headers: input.headers,
    body: input.body === undefined ? undefined : JSON.stringify(input.body),
  })
  const response = await handler(request)
  const text = await response.text()
  let body: unknown = text
  try { body = text ? JSON.parse(text) : null } catch { /* 非 JSON 原样返回 */ }
  return { status: response.status, body }
}

export default definePlugin({
  async setup(ctx) { ctx.logger.info("ready (merged)") },
  async onHealth() { return { status: "ok" } },
  async onShutdown() {},
  routes: {
    "admin:auth/agent-verify:post": (input: any) => invoke(route_admin_auth_agent_verify.POST, input),
    "admin:carriers:get": (input: any) => invoke(route_admin_carriers.GET, input),
    "admin:carriers:post": (input: any) => invoke(route_admin_carriers.POST, input),
    "admin:channels:delete": (input: any) => invoke(route_admin_channels.DELETE, input),
    "admin:channels:get": (input: any) => invoke(route_admin_channels.GET, input),
    "admin:channels:post": (input: any) => invoke(route_admin_channels.POST, input),
    "admin:channels:put": (input: any) => invoke(route_admin_channels.PUT, input),
    "admin:contracts:delete": (input: any) => invoke(route_admin_contracts.DELETE, input),
    "admin:contracts:get": (input: any) => invoke(route_admin_contracts.GET, input),
    "admin:contracts:post": (input: any) => invoke(route_admin_contracts.POST, input),
    "admin:contracts:put": (input: any) => invoke(route_admin_contracts.PUT, input),
    "admin:dashboard:get": (input: any) => invoke(route_admin_dashboard.GET, input),
    "admin:demo/execute:post": (input: any) => invoke(route_admin_demo_execute.POST, input),
    "admin:enterprises:get": (input: any) => invoke(route_admin_enterprises.GET, input),
    "admin:enterprises:post": (input: any) => invoke(route_admin_enterprises.POST, input),
    "admin:invoices:delete": (input: any) => invoke(route_admin_invoices.DELETE, input),
    "admin:invoices:get": (input: any) => invoke(route_admin_invoices.GET, input),
    "admin:invoices:post": (input: any) => invoke(route_admin_invoices.POST, input),
    "admin:invoices:put": (input: any) => invoke(route_admin_invoices.PUT, input),
    "admin:isv-apps:delete": (input: any) => invoke(route_admin_isv_apps.DELETE, input),
    "admin:isv-apps:get": (input: any) => invoke(route_admin_isv_apps.GET, input),
    "admin:isv-apps:post": (input: any) => invoke(route_admin_isv_apps.POST, input),
    "admin:isv-apps:put": (input: any) => invoke(route_admin_isv_apps.PUT, input),
    "admin:ledgers:get": (input: any) => invoke(route_admin_ledgers.GET, input),
    "admin:mcp-hub:delete": (input: any) => invoke(route_admin_mcp_hub.DELETE, input),
    "admin:mcp-hub:get": (input: any) => invoke(route_admin_mcp_hub.GET, input),
    "admin:mcp-hub:post": (input: any) => invoke(route_admin_mcp_hub.POST, input),
    "admin:mcp-hub:put": (input: any) => invoke(route_admin_mcp_hub.PUT, input),
    "admin:models:delete": (input: any) => invoke(route_admin_models.DELETE, input),
    "admin:models:get": (input: any) => invoke(route_admin_models.GET, input),
    "admin:models:post": (input: any) => invoke(route_admin_models.POST, input),
    "admin:models:put": (input: any) => invoke(route_admin_models.PUT, input),
    "admin:pipelines:delete": (input: any) => invoke(route_admin_pipelines.DELETE, input),
    "admin:pipelines:get": (input: any) => invoke(route_admin_pipelines.GET, input),
    "admin:pipelines:post": (input: any) => invoke(route_admin_pipelines.POST, input),
    "admin:pipelines:put": (input: any) => invoke(route_admin_pipelines.PUT, input),
    "admin:quotas:delete": (input: any) => invoke(route_admin_quotas.DELETE, input),
    "admin:quotas:get": (input: any) => invoke(route_admin_quotas.GET, input),
    "admin:quotas:post": (input: any) => invoke(route_admin_quotas.POST, input),
    "admin:quotas:put": (input: any) => invoke(route_admin_quotas.PUT, input),
    "admin:seats:get": (input: any) => invoke(route_admin_seats.GET, input),
    "admin:seats:post": (input: any) => invoke(route_admin_seats.POST, input),
    "admin:skus:delete": (input: any) => invoke(route_admin_skus.DELETE, input),
    "admin:skus:get": (input: any) => invoke(route_admin_skus.GET, input),
    "admin:skus:post": (input: any) => invoke(route_admin_skus.POST, input),
    "admin:skus:put": (input: any) => invoke(route_admin_skus.PUT, input),
    "admin:tariffs:get": (input: any) => invoke(route_admin_tariffs.GET, input),
    "admin:tenant-members:delete": (input: any) => invoke(route_admin_tenant_members.DELETE, input),
    "admin:tenant-members:get": (input: any) => invoke(route_admin_tenant_members.GET, input),
    "admin:tenant-members:post": (input: any) => invoke(route_admin_tenant_members.POST, input),
    "admin:tenant-members:put": (input: any) => invoke(route_admin_tenant_members.PUT, input),
    "admin:tokens:delete": (input: any) => invoke(route_admin_tokens.DELETE, input),
    "admin:tokens:get": (input: any) => invoke(route_admin_tokens.GET, input),
    "admin:tokens:post": (input: any) => invoke(route_admin_tokens.POST, input),
    "admin:tokens:put": (input: any) => invoke(route_admin_tokens.PUT, input),
    "admin:usages:get": (input: any) => invoke(route_admin_usages.GET, input),
    "open:chat/completions:post": (input: any) => invoke(route_open_chat_completions.POST, input),
    "open:embeddings:post": (input: any) => invoke(route_open_embeddings.POST, input),
    "open:models:get": (input: any) => invoke(route_open_models.GET, input),
    "open:quota:get": (input: any) => invoke(route_open_quota.GET, input),
  },
})
