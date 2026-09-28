import { NextResponse } from "next/server"

import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { applyActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import { invokeAction } from "@/modules/shared/backend/lib/broker-invoke"
import { ensureContractActions } from "@/modules/shared/backend/lib/contract-actions"
import { getModuleByDomain, resolveModuleDispatch } from "../_lib/module-registry"

/**
 * 模块 API 网关。
 *
 * 注: 派发对象是 **Platform Module 的 facade**(Paperclip PLUGIN_SPEC §6.1),
 * 不是 §6.2 的可安装 Plugin —— 故路径与方法一律用 module/域 语义。
 *
 *   GET  /api/v1/admin/modules/<domain>             → 该模块的 manifest
 *   POST /api/v1/admin/modules/<domain>/<method>    → 派发到该域 facade 方法
 *
 * 为什么挂在 /api/v1/admin 下：复用既有 proxy 默认鉴权与 admin 路由保护基线。
 * 新开一个前缀会落在保护面之外（proxy matcher 只覆盖 /api/v1/**），
 * 反而制造未受保护的新攻击面。
 *
 * 派发复用既有原语，不新造调用链：
 *   ensureContractActions(domain) 注册该域 action schema
 *   applyActionSchema(<domain>.<method>) 按声明校验入参（§4.3 写接口必须有 schema）
 *   invokeAction(domain, method) 走既有的同进程 SDK / 跨进程 RPC 双模
 */
type RouteContext = { params: Promise<{ path: string[] }> }

export const GET = withAdminRoute(
  async (_request, _auth, context: RouteContext) => {
    const segments = (await context.params).path ?? []
    if (segments.length !== 1) {
      return NextResponse.json(
        { success: false, error: "GET 仅支持 <domain>，用于读取该模块 manifest" },
        { status: 400 },
      )
    }
    const manifest = getModuleByDomain(segments[0])
    if (!manifest) {
      return NextResponse.json({ success: false, error: `未登记的域: ${segments[0]}` }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: manifest })
  },
  { permission: PERMISSIONS.PLATFORM_PLUGIN_QUERY },
)

export const POST = withAdminRoute(
  async (request, _auth, context: RouteContext) => {
    const resolved = resolveModuleDispatch((await context.params).path ?? [])
    if (!resolved.ok) {
      return NextResponse.json({ success: false, error: resolved.error }, { status: resolved.status })
    }

    const { manifest, method } = resolved.target
    try {
      await ensureContractActions(manifest.domain)
      const body = await request.json().catch(() => ({}))
      const payload = applyActionSchema(`${manifest.domain}.${method}`, body)
      const data = await invokeAction(manifest.domain, method, payload)
      return NextResponse.json({ success: true, data })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      // 校验失败是调用方问题(400)；其余按错误文本粗分，与仓库既有路由的处置一致
      const status = message.includes("ValidationError") || message.includes("必须") ? 400 : 500
      return NextResponse.json({ success: false, error: message }, { status })
    }
  },
  { permission: PERMISSIONS.PLATFORM_PLUGIN_QUERY },
)
