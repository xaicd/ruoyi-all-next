import { NextResponse } from "next/server"

import { listPluginCatalog, listPluginUiSlots } from "./_lib/plugin-catalog"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { PluginRegistryService } from "@/modules/shared/backend/plugins/plugin-registry.service"
import { resolvePluginDir } from "@/modules/shared/backend/plugins/package-scanner"

/**
 * 插件管理 API（§6.2 可安装插件；与 Platform Module 的 /api/v1/admin/modules 是两套东西）。
 *
 *   GET  /api/v1/admin/plugins  → **统一视图**：内置插件(builtin, 各业务域) + 已安装插件(installed)
 *   POST /api/v1/admin/plugins  → 扫描插件目录 → 落库 → 启停 worker（终态 ready/error）
 *
 * GET 返回统一视图是 P1「统一扩展模型」的落地：域作为 `kind: "builtin"` 的插件出现在同一张表里，
 * 与已安装插件共用 status / runtimeMode / capabilities 字段。业务代码零改动 ——
 * builtin 由域契约派生、不落库（给域也建安装记录会造成两处真源）。
 *
 * POST 走 `reconcile` 而不是 `syncFromDisk`：只同步不启 worker 的话，插件会永远停在
 * `installed`，装配出来的 worker 运行时形同虚设 —— 安装动作的语义本就包含"让它跑起来"。
 *
 * 挂在 /api/v1/admin 下以复用既有 proxy 默认鉴权与路由保护基线。
 */
export const GET = withAdminRoute(
  async () => {
    return NextResponse.json({
      success: true,
      data: {
        pluginDir: resolvePluginDir(),
        plugins: await listPluginCatalog(),
        // 插件声明的 UI 槽位（宿主页面经 PluginSlotHost 挂载）
        uiSlots: await listPluginUiSlots(),
      },
    })
  },
  { permission: PERMISSIONS.PLATFORM_PLUGIN_QUERY },
)

export const POST = withAdminRoute(
  async () => {
    const result = await PluginRegistryService.reconcile()
    // 被拒的包一并返回：它们的校验错误是操作员唯一能看到的诊断面
    return NextResponse.json({ success: true, data: result })
  },
  { permission: PERMISSIONS.PLATFORM_PLUGIN_MANAGE },
)
