import { createRequire } from "node:module"

import { describe, expect, it } from "vitest"

const require = createRequire(import.meta.url)
const { TOOLS, TOOL_NAMES } = require("../ruoyi-mcp-server.cjs") as {
  TOOLS: { name: string; run: (args: Record<string, unknown>) => unknown }[]
  TOOL_NAMES: string[]
}

/**
 * 示例域从 **catalog 取**，不写死。
 * 写死 "mall"/"pay" 会让本文件在裁剪过的工程（孵化 profile/bundle）里必然失败 ——
 * 而那正是"基座能不能拿来开新项目"的检验点。取第一个插件域，任何 profile 下都成立。
 */
function samplePluginDomain(): string {
  const catalog = call("ruoyi_domain_list")
  const plugin = catalog.layers.plugin?.[0]
  if (!plugin) throw new Error("该工程没有插件域，本用例不适用")
  return plugin
}

/** 平台地基（system/infra）永远在，与 profile 无关。 */
function platformDomain(): string {
  const catalog = call("ruoyi_domain_list")
  return catalog.layers.platform?.[0] ?? "system"
}

function call(name: string, args: Record<string, unknown> = {}): any {
  const tool = TOOLS.find((entry) => entry.name === name)
  if (!tool) throw new Error(`unknown tool ${name}`)
  return tool.run(args)
}

/**
 * MCP 是**给 AI 消费的面** —— 它给错信息的后果比脚本出错更重（AI 会照着错信息干活，
 * 而且不会怀疑）。所以这些工具必须有测试，尤其是"域目录"这类容易被写死的东西。
 */
describe("MCP: 域与插件工具", () => {
  it("工具名唯一且可枚举", () => {
    expect(new Set(TOOL_NAMES).size).toBe(TOOL_NAMES.length)
    expect(TOOL_NAMES.length).toBeGreaterThan(10)
  })

  describe("ruoyi_domain_list", () => {
    it("暴露 plugin 层（只给 business 会让调用方以为这些域不存在）", () => {
      const result = call("ruoyi_domain_list")
      expect(Array.isArray(result.layers.plugin)).toBe(true)
      expect(result.layers.plugin.length).toBeGreaterThan(0)
      expect(result.layers.plugin.length).toBeGreaterThan(0)
    })

    it("每个域都带真实目录（否则调用方只能猜，而猜错通常不报错）", () => {
      const result = call("ruoyi_domain_list")
      for (const domain of result.domains) {
        expect(domain.dir, `${domain.name} 缺 dir`).toBeTruthy()
      }
      const pluginDomain = samplePluginDomain()
      const someone = result.domains.find((d: any) => d.name === pluginDomain)
      const platform = result.domains.find((d: any) => d.name === platformDomain())
      expect(someone.dir).toBe(`packages/plugins/plugin-${pluginDomain}`)
      expect(platform.dir.startsWith("packages/domains/")).toBe(true)
    })
  })

  describe("ruoyi_domain_resolve", () => {
    it("插件域 -> 插件目录，且标明 kind=plugin", () => {
      const domain = samplePluginDomain()
      const result = call("ruoyi_domain_resolve", { domain })
      expect(result.isPlugin).toBe(true)
      expect(result.dir).toBe(`packages/plugins/plugin-${domain}`)
      expect(result.pluginId).toBe(`ruoyi.${domain}`)
      expect(result.kind).toBe("plugin")
    })

    it("平台地基仍在地基目录，不算插件", () => {
      const result = call("ruoyi_domain_resolve", { domain: platformDomain() })
      expect(result.isPlugin).toBe(false)
      expect(result.dir.startsWith("packages/domains/")).toBe(true)
      expect(result.kind).toBe("platform")
    })

    it("缺参数直接报错，不静默返回空", () => {
      expect(() => call("ruoyi_domain_resolve", {})).toThrow(/domain is required/)
    })
  })

  describe("ruoyi_plugin_list", () => {
    it("列出全部插件，且都带真实声明（不是空壳）", () => {
      const result = call("ruoyi_plugin_list")
      expect(result.count).toBeGreaterThanOrEqual(15)
      for (const plugin of result.plugins) {
        expect(plugin.routeCount, `${plugin.id} 没有路由声明`).toBeGreaterThan(0)
        expect(plugin.capabilities).toContain("api.routes.register")
        expect(plugin.dir.startsWith("packages/plugins/plugin-")).toBe(true)
      }
      const pay = result.plugins.find((p: any) => p.id === "ruoyi.pay")
      expect(pay.authSurfaces).toContain("operator")
      // 域级特征必须在（拆分代理与治理门禁都靠它）
      expect(pay.domainTraits.publicPrefixes.length).toBeGreaterThan(0)
    })
  })

  describe("ruoyi_codegen_targets", () => {
    it("低代码落点按真实目录解析（插件域不能落到 packages/domains）", () => {
      const domain = samplePluginDomain()
      const result = call("ruoyi_codegen_targets", { domain })
      expect(result.base).toBe(`packages/plugins/plugin-${domain}`)
      expect(result.paths.backend).toBe(`packages/plugins/plugin-${domain}/backend`)
      expect(result.importAlias).toBe(`@/modules/${domain}`)
    })

    it("地基域仍指向 packages/domains", () => {
      const result = call("ruoyi_codegen_targets", { domain: "infra" })
      expect(result.base).toBe("packages/domains/infra")
    })

    it("未知域报错并指路，而不是默默给个路径", () => {
      expect(() => call("ruoyi_codegen_targets", { domain: "nope" })).toThrow(/unknown domain/)
    })
  })
})
