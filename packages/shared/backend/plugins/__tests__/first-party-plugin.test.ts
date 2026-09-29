import { describe, expect, it } from "vitest"

import { firstPartyPluginEntry } from "../first-party-entries"
import { scanAllPluginPackages } from "../package-scanner"

/**
 * 第一方插件（pay 试点）的**端到端可达性**证明：
 * 被发现 -> manifest 合法 -> 入口能加载 -> 暴露的路由与 manifest 声明一一对应。
 *
 * 这条测试的意义在于：插件系统最容易"看起来完成了"，实际却卡在
 * 「发现得到但加载不了」（仓内 TS 插件不能用运行期 import）或
 * 「声明了几十条路由但处理器没导出」。这里把这两环都钉死。
 */
describe("第一方插件: 发现与加载", () => {
  const discovered = scanAllPluginPackages([
    { dir: "/definitely/missing", reportSkipped: true },
    { dir: `${process.cwd()}/packages/plugins`, reportSkipped: false },
  ])

  it("pay 作为第一方插件被发现，且 manifest 合法", () => {
    const pay = discovered.find((item) => item.manifest?.id === "ruoyi.pay")
    expect(pay).toBeDefined()
    expect(pay!.errors).toEqual([])
    expect(pay!.manifest!.capabilities).toContain("api.routes.register")
    expect(pay!.manifest!.apiRoutes!.length).toBeGreaterThan(0)
  })

  it("入口能加载，并且声明的每条路由都有对应处理器", async () => {
    const pay = discovered.find((item) => item.manifest?.id === "ruoyi.pay")!
    const factory = firstPartyPluginEntry("ruoyi.pay")
    expect(factory).toBeDefined() // 仓内第一方插件必须在静态表里登记

    const loaded = await factory!()
    const plugin = (loaded.default ?? loaded) as { routes?: Record<string, unknown> }
    expect(plugin.routes).toBeDefined()

    const declared = pay.manifest!.apiRoutes!.map((route) => route.routeKey).sort()
    const implemented = Object.keys(plugin.routes!).sort()
    // 声明面与实现面必须一致：少一条说明声明是空壳，多一条说明有未声明的入口
    expect(implemented).toEqual(declared)
  })

  it("每个处理器都是函数（不是占位）", async () => {
    const loaded = await firstPartyPluginEntry("ruoyi.pay")!()
    const plugin = (loaded.default ?? loaded) as { routes?: Record<string, unknown> }
    for (const [key, handler] of Object.entries(plugin.routes!)) {
      expect(typeof handler, `${key} 必须是函数`).toBe("function")
    }
  })
})
