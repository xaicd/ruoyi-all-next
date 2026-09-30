import { describe, expect, it } from "vitest"

import { MergedPlugin } from "../merged-runtime"
import { scanPluginPackage } from "../package-scanner"
import { resolvePluginRoute } from "../route-mount"

const PLUGIN_DIR = `${process.cwd()}/packages/plugins/plugin-pay`

/**
 * 第一方插件（pay）的**运行时闭环**证明：
 *   发现 -> 合并运行时启动 -> 按 manifest 声明派发 -> 真业务处理器返回真响应。
 *
 * 这条测试取代不了 HTTP 层的端到端（那需要登录态），但它覆盖了插件化真正容易断的环节:
 * 入口加载、初始化、路由声明与处理器的对应、以及"声明→放行"的判定。
 * 挂载点的 HTTP 包装（路径拼装、三种 auth 到守卫的映射）由 route-mount 单测覆盖。
 */
describe("第一方插件: 运行时闭环（pay）", () => {
  it("启动 -> 声明路由可派发到真实处理器 -> 未声明路由被拒", async () => {
    const found = scanPluginPackage(PLUGIN_DIR)
    expect(found?.manifest).toBeTruthy()
    const manifest = found!.manifest!

    const plugin = new MergedPlugin(manifest.id, `${PLUGIN_DIR}/plugin-entry.ts`, PLUGIN_DIR)
    await plugin.start({ config: {}, capabilities: [...manifest.capabilities] } as never)
    expect(plugin.running).toBe(true)

    // 取一条 admin 面（auth: operator）的真实声明
    const declaration = manifest.apiRoutes!.find((route) => route.auth === "operator")!
    const resolution = resolvePluginRoute({
      manifest,
      capabilities: [...manifest.capabilities],
      method: declaration.method,
      pathname: `/api/v1/plugins/${manifest.id}/api${declaration.path}`,
      pluginKey: manifest.id,
    })
    // 声明被接受，且 auth 原样保留（鉴权由挂载点按它执行）
    expect(resolution.ok).toBe(true)
    expect(resolution.declaration!.auth).toBe("operator")

    // 真正派发：拿到的是一个合法 HTTP 响应（不是抛出、不是 undefined）
    const result = await plugin.invokeRoute(declaration.routeKey, {
      method: declaration.method,
      path: declaration.path,
      query: {},
      headers: {},
      pluginKey: manifest.id,
    })
    expect(result).toBeDefined()
    expect(typeof result.status).toBe("number")
  })

  it("未声明的路由被拒绝（不静默通配）", async () => {
    const manifest = scanPluginPackage(PLUGIN_DIR)!.manifest!
    const resolution = resolvePluginRoute({
      manifest,
      capabilities: [...manifest.capabilities],
      method: "GET",
      pathname: `/api/v1/plugins/${manifest.id}/api/definitely-not-declared`,
      pluginKey: manifest.id,
    })
    expect(resolution.ok).toBe(false)
    expect(resolution.status).toBe(404)
  })
})
