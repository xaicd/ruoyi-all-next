import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"

const ROOT = path.resolve(__dirname, "../..")
const DIR = path.join(ROOT, "docs", "features", "__tree__")

/** 造一份 tasks.md 跑检查器，返回 tasks 段。 */
function inspect(tasks: string) {
  fs.mkdirSync(DIR, { recursive: true })
  fs.writeFileSync(path.join(DIR, "feature.json"), JSON.stringify({ name: "__tree__", domain: "x" }))
  fs.writeFileSync(path.join(DIR, "tasks.md"), tasks)
  const out = execFileSync("node", ["scripts/check-delivery.cjs", "--feature", "__tree__", "--json"], { cwd: ROOT, encoding: "utf8" })
  return JSON.parse(out).tasks as { total: number; orphans: string[]; noWhitelist: number; empty?: boolean }
}

const header = ["| ID | 归属 | 任务 | 文件白名单 | 状态 |", "|---|---|---|---|---|"]
const row = (id: string, parent: string, whitelist: string) => `| ${id} | ${parent} | 做点什么 | ${whitelist} | 未开始 |`

afterEach(() => fs.rmSync(DIR, { recursive: true, force: true }))

/**
 * 任务树 —— 对齐 CMMI「主线-支线任务树」。
 * HT: 空表不是"健康"；归属不存在的任务是孤儿单，必须拦下。
 */
describe("任务树", () => {
  it("空任务表被标出来（没有任务树等于没规划）", () => {
    const result = inspect(header.join("\n") + "\n")
    expect(result.empty).toBe(true)
    expect(result.total).toBe(0)
  })

  it("归属不存在的任务 → 孤儿单，必须拦下", () => {
    const result = inspect([...header, row("T1", "main", "a.ts"), row("T2", "T99", "b.ts")].join("\n") + "\n")
    expect(result.orphans).toHaveLength(1)
    expect(result.orphans[0]).toContain("T2")
  })

  it("归属主线的子任务合法（支线挂在主线上）", () => {
    const result = inspect([...header, row("T1", "main", "a.ts"), row("T2", "T1", "b.ts")].join("\n") + "\n")
    expect(result.orphans).toHaveLength(0)
  })

  it("白名单为 `-`（纯验证任务）合法；留空或占位符不合法", () => {
    const ok = inspect([...header, row("T1", "main", "-")].join("\n") + "\n")
    expect(ok.noWhitelist).toBe(0)
    const bad = inspect([...header, "| T1 | main | 做点什么 |  | 未开始 |"].join("\n") + "\n")
    expect(bad.noWhitelist).toBe(1)
  })
})
