import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

const ROOT = path.resolve(__dirname, "../..")
const FIXTURE = path.join(ROOT, "docs", "features", "__skeleton_fixture__")

/**
 * 交付检查器必须**认得出骨架**。
 *
 * 这条测试守的是一个真实的坑: 生成器产出骨架后，如果检查器只看"文件在不在"，
 * 一个**没写任何内容**的 requirements.md 就会让"需求"阶段变绿 —— 假绿。
 * 所以这里同时钉住两个方向: 骨架必须被标 ⚠️；填好的不能被误伤。
 */
describe("delivery 检查器的骨架判定", () => {
  beforeAll(() => {
    execFileSync("npx", ["tsx", "scripts/create-feature.ts", "--name", "__skeleton_fixture__", "--domain", "fixture", "--title", "骨架夹具"], { cwd: ROOT, stdio: "ignore" })
  })
  afterAll(() => fs.rmSync(FIXTURE, { recursive: true, force: true }))

  it("全新骨架被标记为未完成（不假绿）", () => {
    const out = execFileSync("node", ["scripts/check-delivery.cjs", "--feature", "__skeleton_fixture__", "--json"], { cwd: ROOT, encoding: "utf8" })
    const data = JSON.parse(out)
    const requirement = data.phases.find((phase: { id: string }) => phase.id === "requirement")
    expect(requirement.skeleton).toMatch(/待填/)
    expect(data.missingTotal).toBeGreaterThan(0)
  })

  it("已经填好的特性不被误伤", () => {
    const out = execFileSync("node", ["scripts/check-delivery.cjs", "--feature", "ecommerce", "--json"], { cwd: ROOT, encoding: "utf8" })
    const data = JSON.parse(out)
    const docs = data.phases.filter((phase: { skeleton?: string }) => phase.skeleton)
    expect(docs).toHaveLength(0)
  })
})
