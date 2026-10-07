import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"

const ROOT = path.resolve(__dirname, "../..")
const DIR = path.join(ROOT, "docs", "features", "__rb_test__")

function run(args: string[]): { status: number; output: string } {
  fs.writeFileSync(path.join(DIR, "feature.json"), JSON.stringify({ name: "__rb_test__", domain: "x" }))
  try {
    const output = execFileSync("node", ["scripts/agent/run-runbook.cjs", "--feature", "__rb_test__", ...args], { cwd: ROOT, encoding: "utf8", stdio: "pipe" })
    return { status: 0, output }
  } catch (error) {
    const e = error as { status?: number; stdout?: string; stderr?: string }
    return { status: e.status ?? 1, output: `${e.stdout ?? ""}${e.stderr ?? ""}` }
  }
}

function writeRunbook(body: unknown) {
  fs.mkdirSync(DIR, { recursive: true })
  fs.writeFileSync(path.join(DIR, "runbook.json"), JSON.stringify(body))
}

afterEach(() => fs.rmSync(DIR, { recursive: true, force: true }))

/**
 * 实施轨的可执行 runbook。
 *
 * 守的是实施现场的三个真实事故:
 *  1. **骨架被当成可执行方案**（命令里还是占位符）→ 跑起来必然失败
 *  2. **不可逆步骤没有回滚路径** → 一旦失败就卡死
 *  3. **失败不回滚** → 半割接状态，比不割接更糟
 */
describe("实施轨 runbook", () => {
  it("占位符还在命令里 → 拦下（骨架不是可执行方案）", () => {
    writeRunbook({ window: { minutes: 10 }, steps: [{ id: "S1", name: "跑点什么", command: "echo <!-- 待填 -->" }], rollback: [] })
    expect(run(["--check"]).status).toBe(1)
  })

  it("不可逆步骤没有 rollback → 拦下（失败就卡死）", () => {
    writeRunbook({
      window: { minutes: 10 },
      steps: [{ id: "S1", name: "改数据", command: "exit 0", irreversible: true }],
      rollback: [],
    })
    const result = run(["--check"])
    expect(result.status).toBe(1)
    expect(result.output).toContain("没有 rollback")
  })

  it("没有声明窗口 → 拦下（无法判断是否超时）", () => {
    writeRunbook({ steps: [{ id: "S1", name: "a", command: "exit 0" }], rollback: [] })
    expect(run(["--check"]).status).toBe(1)
  })

  it("失败 → 自动执行回滚，退出码非 0，并报告**实测**回滚耗时", () => {
    writeRunbook({
      window: { minutes: 5 },
      steps: [
        { id: "S1", name: "必过", command: "exit 0" },
        { id: "S2", name: "必失败", command: "exit 3", irreversible: true },
      ],
      rollback: [{ id: "R1", name: "回滚", command: "echo rolled-back" }],
    })
    const result = run(["--run"])
    expect(result.status).toBe(1)
    expect(result.output).toContain("执行回滚")
    expect(result.output).toContain("实测的回滚耗时")
  })

  it("合法的 runbook 不被误伤", () => {
    writeRunbook({
      window: { minutes: 5 },
      steps: [{ id: "S1", name: "跑门禁", command: "exit 0" }],
      rollback: [{ id: "R1", name: "回滚", command: "exit 0" }],
    })
    expect(run(["--check"]).status).toBe(0)
  })
})
