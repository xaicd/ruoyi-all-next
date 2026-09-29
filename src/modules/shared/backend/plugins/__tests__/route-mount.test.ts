import path from "node:path"
import { describe, expect, it } from "vitest"

import { MergedPlugin } from "../merged-runtime"
import { PLUGIN_ROUTE_PREFIX, pluginRoutePath, resolvePluginRoute } from "../route-mount"
import type { PluginManifest } from "../types"

const EXAMPLE_DIR = path.resolve(process.cwd(), "packages/plugins/examples/hello-world")
const MERGED_ENTRY = path.join(EXAMPLE_DIR, "merged.js")
const KEY = "ruoyi.hello-world"

const manifest = {
  id: KEY,
  apiVersion: 1,
  version: "0.1.0",
  displayName: "Hello World",
  description: "d",
  author: "a",
  categories: ["automation"],
  capabilities: ["api.routes.register"],
  entrypoints: { worker: "./worker.js", merged: "./merged.js" },
  apiRoutes: [{ routeKey: "hello", method: "GET", path: "/hello", auth: "operator" }],
} as unknown as PluginManifest

function resolve(overrides: Partial<Parameters<typeof resolvePluginRoute>[0]> = {}) {
  return resolvePluginRoute({
    manifest,
    capabilities: manifest.capabilities,
    method: "GET",
    pathname: `${PLUGIN_ROUTE_PREFIX}/${KEY}/api/hello`,
    pluginKey: KEY,
    runtimeMode: "merged",
    ...overrides,
  })
}

describe("宿主挂载插件声明的 apiRoutes", () => {
  it("挂载路径按约定拼装", () => {
    expect(pluginRoutePath(KEY, "/hello")).toBe("/api/v1/admin/plugins/ruoyi.hello-world/api/hello")
  })

  it("已声明 + 有 api.routes.register 能力 + merged 形态 -> 放行", () => {
    const result = resolve()
    expect(result.ok).toBe(true)
    expect(result.declaration?.routeKey).toBe("hello")
  })

  it("插件不存在 -> 404", () => {
    expect(resolve({ manifest: null }).status).toBe(404)
  })

  it("未声明 api.routes.register 能力 -> 403", () => {
    expect(resolve({ capabilities: ["plugin.state.read"] }).status).toBe(403)
  })

  it("未声明的路由 -> 404（不静默通配）", () => {
    expect(resolve({ pathname: `${PLUGIN_ROUTE_PREFIX}/${KEY}/api/nope` }).status).toBe(404)
  })

  it("方法不匹配也算未声明", () => {
    expect(resolve({ method: "POST" }).status).toBe(404)
  })

  it("isolated 形态 -> 501 并说明原因（不假装支持）", () => {
    const result = resolve({ runtimeMode: "isolated" })
    expect(result.status).toBe(501)
    expect(result.error).toContain("isolated")
  })

  it("auth 非 operator -> 501 并说明原因（不假装支持）", () => {
    const withPublic = { ...manifest, apiRoutes: [{ routeKey: "hello", method: "GET", path: "/hello", auth: "public" }] } as unknown as PluginManifest
    const result = resolve({ manifest: withPublic })
    expect(result.status).toBe(501)
    expect(result.error).toContain("public")
  })

  it("真插件的 merged 形态能被直接调用（路由处理器在包内，不在 app/）", async () => {
    const plugin = new MergedPlugin(KEY, MERGED_ENTRY, EXAMPLE_DIR)
    await plugin.start({
      manifest,
      config: {},
      hostApiVersion: 1,
      instance: { pluginKey: KEY, packagePath: EXAMPLE_DIR },
      mode: "merged",
    })

    const result = await plugin.invokeRoute("hello", {
      method: "GET",
      path: "/api/v1/admin/plugins/ruoyi.hello-world/api/hello",
      query: { who: "test" },
      body: undefined,
      headers: {},
      pluginKey: KEY,
    })
    expect(result.status).toBe(200)
    expect((result.body as { pluginKey: string }).pluginKey).toBe(KEY)
    expect((result.body as { query: Record<string, string> }).query.who).toBe("test")

    // 未导出的 routeKey 明确报错
    await expect(
      plugin.invokeRoute("missing", { method: "GET", path: "/", query: {}, body: undefined, headers: {}, pluginKey: KEY }),
    ).rejects.toThrow(/未导出路由处理器/)

    await plugin.stop()
  })
})
