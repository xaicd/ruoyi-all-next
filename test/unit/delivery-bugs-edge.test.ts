import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"

const ROOT = path.resolve(__dirname, "../..")
const DIR = path.join(ROOT, "docs", "features", "__edge__")

/** 用一份 bugs.md 跑检查器，返回 bugs 段。 */
function inspect(bugs: string) {
  fs.mkdirSync(DIR, { recursive: true })
  fs.writeFileSync(path.join(DIR, "feature.json"), JSON.stringify({ name: "__edge__", domain: "x" }))
  fs.writeFileSync(path.join(DIR, "bugs.md"), bugs)
  const out = execFileSync("node", ["scripts/check-delivery.cjs", "--feature", "__edge__", "--json"], { cwd: ROOT, encoding: "utf8" })
  return JSON.parse(out).bugs as { present: boolean; open: number; malformed: number; unknown: number }
}

const header = ["| ID | 现象 | 复现命令 | 验证命令 | 状态 |", "|---|---|---|---|---|"]

afterEach(() => fs.rmSync(DIR, { recursive: true, force: true }))

describe("缺陷清单的边界情况", () => {
  it("空表合法: 表头 + 分隔线 = 无缺陷", () => {
    const bugs = inspect(header.join("\n") + "\n")
    expect(bugs.present).toBe(true)
    expect(bugs.open).toBe(0)
    expect(bugs.malformed).toBe(0)
  })

  it("状态写错字（未休 / 已修改）→ 必须被标出来，不能静默忽略", () => {
    const bugs = inspect([...header, "| B1 | 现象 | cmd | cmd | 未休 |", "| B2 | 现象 | cmd | cmd | 已修改 |"].join("\n") + "\n")
    expect(bugs.unknown).toBe(2)
    expect(bugs.malformed).toBe(2)
  })

  it("英文状态 Fixed / OPEN → 也算不认识的状态", () => {
    const bugs = inspect([...header, "| B1 | 现象 | cmd | cmd | Fixed |", "| B2 | 现象 | cmd | cmd | OPEN |"].join("\n") + "\n")
    expect(bugs.unknown).toBe(2)
  })

  it("少列（只有 ID 和现象）→ 标为格式不对，不能当没看见", () => {
    const bugs = inspect([...header, "| B1 | 现象 |"].join("\n") + "\n")
    expect(bugs.malformed).toBe(1)
  })

  it("状态为空 → 算未修（记录没写完）", () => {
    const bugs = inspect([...header, "| B1 | 现象 | cmd | cmd | |"].join("\n") + "\n")
    expect(bugs.open).toBe(1)
  })

  it("分隔线带空格、状态列有前后空格 → 解析不受影响", () => {
    const bugs = inspect(["| ID | 现象 | 复现命令 | 验证命令 | 状态 |", "| --- | --- | --- | --- | --- |", "| B1 | 现象 | cmd | cmd |  已修  |"].join("\n") + "\n")
    expect(bugs.open).toBe(0)
    expect(bugs.malformed).toBe(0)
    expect(bugs.unknown).toBe(0)
  })
})
