import { describe, expect, it } from "vitest"

import {
  getPluginByDomain,
  listPlugins,
  resolvePluginDispatch,
} from "../plugin-registry"

describe("plugin-registry", () => {
  it("注册表由生成物驱动，覆盖全部可打包域", () => {
    const plugins = listPlugins()
    // domain-catalog 共 17 域，其中 online 为 handwritten，故不在插件注册表内
    expect(plugins.length).toBe(16)
    expect(plugins.every((plugin) => typeof plugin.domain === "string")).toBe(true)
    expect(plugins.map((plugin) => plugin.domain)).toContain("pay")
  })

  it("manifest 的声明面来自真实契约，不是空壳", () => {
    const pay = getPluginByDomain("pay")
    expect(pay).toBeDefined()
    expect(pay!.facadeMethods).toContain("listOrders")
    expect(pay!.actions).toContain("pay.listOrders")
    expect(pay!.permissions).toContain("pay:order:query")
    // capability 由声明推导
    expect(pay!.capabilities).toContain("facade.invoke")
  })

  it("未登记的域返回 undefined", () => {
    expect(getPluginByDomain("not-a-domain")).toBeUndefined()
  })

  it("解析 <domain>/<method> 成功", () => {
    const resolved = resolvePluginDispatch(["pay", "listOrders"])
    expect(resolved.ok).toBe(true)
    if (resolved.ok) {
      expect(resolved.target.plugin.domain).toBe("pay")
      expect(resolved.target.method).toBe("listOrders")
    }
  })

  it("空路径与段数不符按 400 拒绝", () => {
    expect(resolvePluginDispatch([])).toMatchObject({ ok: false, status: 400 })
    expect(resolvePluginDispatch(["pay"])).toMatchObject({ ok: false, status: 400 })
    expect(resolvePluginDispatch(["pay", "listOrders", "extra"])).toMatchObject({ ok: false, status: 400 })
  })

  it("未登记域按 404 拒绝", () => {
    expect(resolvePluginDispatch(["not-a-domain", "ping"])).toMatchObject({ ok: false, status: 404 })
  })

  it("未声明的方法按 404 拒绝 —— 不落到动态兜底，避免绕过声明面", () => {
    const resolved = resolvePluginDispatch(["pay", "definitelyNotDeclared"])
    expect(resolved).toMatchObject({ ok: false, status: 404 })
    if (!resolved.ok) expect(resolved.error).toContain("未声明")
  })
})
