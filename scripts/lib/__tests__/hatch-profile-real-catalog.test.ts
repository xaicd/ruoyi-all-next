import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"

import { describe, expect, it } from "vitest"

const require = createRequire(import.meta.url)
const { pruneCatalog, resolveHatchPlan, shouldSkipRelPath } = require("../hatch-profile.cjs")

/**
 * 回归: 孵化计划必须对着**真实 catalog**工作，不能只对着测试 fixture。
 *
 * 曾经的 bug（域全面插件化后暴露）: 业务域清单只读 layers.business，而迁走的域
 * 都进了 layers.plugin —— 于是 standard profile 只剩 system/infra，
 * `npm run project:create` 会孵出一个**没有任何业务域**的工程。
 * 原有测试全绿，因为它自带 fixture，压根没碰真实 catalog。
 *
 * 教训: 这类"登记结构变了、消费方没跟上"的缺陷，只有对着真实真源断言才抓得住。
 */
const REAL_CATALOG = JSON.parse(
  readFileSync(path.join(process.cwd(), "packages/shared/backend/constants/domain-catalog.json"), "utf8"),
)

describe("孵化计划: 对真实 catalog", () => {
  it("standard profile 覆盖全部已登记域（一个都不漏）", () => {
    const plan = resolveHatchPlan(REAL_CATALOG, { profile: "standard" })
    const all = REAL_CATALOG.domains.map((d: { name: string }) => d.name).sort()
    expect([...plan.domains].sort()).toEqual(all)
    expect(plan.excludedDomains).toEqual([])
  })

  it("插件层被当作业务域看待（否则 standard 会退化成只剩地基）", () => {
    const plugins: string[] = REAL_CATALOG.layers.plugin?.domains ?? []
    expect(plugins.length).toBeGreaterThan(0) // 前置条件: 确实存在插件层
    const plan = resolveHatchPlan(REAL_CATALOG, { profile: "standard" })
    for (const name of plugins) expect(plan.domains).toContain(name)
  })

  it("被排除的插件域，其 packages/plugins/plugin-<name> 目录会被跳过", () => {
    const plan = resolveHatchPlan(REAL_CATALOG, { profile: "vertical", bundle: ["mall"] })
    expect(plan.excludedDomains).toContain("pay")
    expect(shouldSkipRelPath("packages/plugins/plugin-pay", plan)).toBe(true)
    expect(shouldSkipRelPath("packages/plugins/plugin-pay/backend/services", plan)).toBe(true)
    // 被选中的域不能被跳过
    expect(shouldSkipRelPath("packages/plugins/plugin-mall", plan)).toBe(false)
    // 地基仍在 packages/domains/ 下，同样不能被误跳
    expect(shouldSkipRelPath("packages/domains/system", plan)).toBe(false)
  })

  it("裁剪后的 catalog 不会留下目录已被删掉的域", () => {
    const plan = resolveHatchPlan(REAL_CATALOG, { profile: "minimal" })
    const pruned = pruneCatalog(REAL_CATALOG, plan)
    const keep = new Set(plan.domains)
    for (const name of pruned.layers.plugin?.domains ?? []) expect(keep.has(name)).toBe(true)
    for (const name of pruned.layers.business?.domains ?? []) expect(keep.has(name)).toBe(true)
    for (const name of pruned.domains.map((d: { name: string }) => d.name)) expect(keep.has(name)).toBe(true)
  })
})
