import { readFileSync } from "node:fs"
import path from "node:path"

import { NextResponse } from "next/server"

import { PluginRepository } from "@/modules/shared/backend/plugins/plugin.repository"
import { PLUGIN_UI_PREFIX, resolveBundleFile } from "@/modules/shared/backend/plugins/ui-slots"
import type { PluginManifest } from "@/modules/shared/backend/plugins/types"

/**
 * 插件 UI bundle 的静态投送点：`/api/v1/admin/plugins/<pluginKey>/ui/<path>`
 *
 * 宿主**不编译**插件 UI —— 插件自己产出预构建 bundle，宿主只负责按 URL 投送。
 * 客户端再由 PluginSlotHost 按 manifest 声明的 exportName 动态 import 并挂载。
 *
 * 安全：resolveBundleFile 会确认解析后的路径**没有逃出 bundle 目录**，
 * 因此 URL 里的 `../` 读不走插件包外的文件。
 *
 * 放在 /api/v1/plugins 下（非 admin 前缀）：proxy 不放压，插件的 public 页面也能取到自己的 bundle。
 */
const CONTENT_TYPES: Record<string, string> = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".html": "text/html; charset=utf-8",
}

async function handle(request: Request) {
  const pathname = new URL(request.url).pathname
  const rest = pathname.slice(`${PLUGIN_UI_PREFIX}/`.length)
  const [pluginKey, ...tail] = rest.split("/")
  // tail[0] 固定是 "ui"
  const relative = tail.slice(1).join("/")

  if (!relative) {
    return NextResponse.json({ success: false, error: "缺少 bundle 内路径" }, { status: 400 })
  }

  const record = await PluginRepository.findByKey(pluginKey)
  const manifest = (record?.manifestJson ?? null) as unknown as PluginManifest | null
  const bundleDir = manifest?.entrypoints?.ui
  if (!record?.packagePath || !bundleDir) {
    return NextResponse.json({ success: false, error: `插件未声明 UI bundle: ${pluginKey}` }, { status: 404 })
  }

  const file = resolveBundleFile(record.packagePath, bundleDir, relative)
  if (!file) {
    // 越界与不存在都返回同一个 404，避免用错误差异探测插件包结构
    return NextResponse.json({ success: false, error: "bundle 文件不存在" }, { status: 404 })
  }

  const body = readFileSync(file)
  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": CONTENT_TYPES[path.extname(file)] ?? "application/octet-stream",
      "cache-control": "public, max-age=60",
    },
  })
}

export const GET = handle
