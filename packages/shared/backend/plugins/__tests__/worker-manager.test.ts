import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"

import { PluginWorker, PluginWorkerManager } from "../worker-manager"
import { WORKER_LIMITS, type WorkerInitializeInput } from "../worker-protocol"

/** 真实的示例插件包（packages/plugins/examples/hello-world）—— 不再手搓 fixture。 */
const EXAMPLE_DIR = path.resolve(process.cwd(), "packages/plugins/examples/hello-world")
const EXAMPLE_WORKER = path.join(EXAMPLE_DIR, "worker.js")

function initInput(pluginKey = "ruoyi.hello-world"): WorkerInitializeInput {
  return {
    manifest: { id: pluginKey },
    config: {},
    hostApiVersion: 1,
    instance: { pluginKey, packagePath: EXAMPLE_DIR },
  }
}

const tempDirs: string[] = []
afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

/** 写一个"顽固" worker：只回应 initialize，其余一律不答（用于超时与停机阶梯）。 */
function writeStubbornWorker(options: { ignoreSigterm?: boolean } = {}): { entry: string; dir: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ruoyi-worker-"))
  tempDirs.push(dir)
  const entry = path.join(dir, "stubborn.js")
  fs.writeFileSync(
    entry,
    [
      `process.stdin.setEncoding("utf8")`,
      `let buf = ""`,
      options.ignoreSigterm ? `process.on("SIGTERM", () => {})` : ``,
      `process.stdin.on("data", (chunk) => {`,
      `  buf += chunk`,
      `  for (const line of buf.split("\\n")) {`,
      `    if (!line.trim()) continue`,
      `    const req = JSON.parse(line)`,
      `    // 只回应 initialize；health 与 shutdown 故意不答`,
      `    if (req.method === "initialize") {`,
      `      process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: req.id, result: { ok: true } }) + "\\n")`,
      `    }`,
      `  }`,
      `  buf = ""`,
      `})`,
    ]
      .filter(Boolean)
      .join("\n"),
  )
  return { entry, dir }
}

/** 断言进程是否存活。 */
function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

describe("PluginWorker", () => {
  it("能启动真实示例插件：initialize 成功、health 返回 ok、stop 干净退出", async () => {
    const worker = new PluginWorker("ruoyi.hello-world", EXAMPLE_WORKER, EXAMPLE_DIR)
    await worker.start(initInput())
    expect(worker.running).toBe(true)

    const health = await worker.health()
    expect(health.status).toBe("ok")

    await worker.stop()
    expect(worker.running).toBe(false)
  })

  it("worker 入口不存在时 start 抛出（不静默降级）", async () => {
    const worker = new PluginWorker("missing", path.join(EXAMPLE_DIR, "nope.js"), EXAMPLE_DIR)
    await expect(worker.start(initInput("missing"))).rejects.toThrow(/入口不存在/)
  })

  it("请求超时时拒绝，而不是挂住宿主", async () => {
    const { entry, dir } = writeStubbornWorker()
    const worker = new PluginWorker("stubborn", entry, dir, { gracefulShutdownMs: 150, sigtermGraceMs: 1_000 })
    await worker.start(initInput("stubborn"))

    await expect(worker.request("health", undefined, 250)).rejects.toThrow(/未在 250ms 内响应/)
    await worker.stop()
  })

  it("停机阶梯：不回应 shutdown 时升级到 SIGTERM 并真正退出", async () => {
    const { entry, dir } = writeStubbornWorker()
    const worker = new PluginWorker("stubborn", entry, dir, { gracefulShutdownMs: 150, sigtermGraceMs: 1_000 })
    await worker.start(initInput("stubborn"))
    const pid = worker.diagnostics.pid as number
    expect(isAlive(pid)).toBe(true)

    await worker.stop()
    expect(isAlive(pid)).toBe(false)
  })

  it("阶梯末端：连 SIGTERM 也忽略时升级到 SIGKILL", async () => {
    const { entry, dir } = writeStubbornWorker({ ignoreSigterm: true })
    const worker = new PluginWorker("unkillable", entry, dir, { gracefulShutdownMs: 150, sigtermGraceMs: 250 })
    await worker.start(initInput("unkillable"))
    const pid = worker.diagnostics.pid as number

    await worker.stop()
    expect(isAlive(pid)).toBe(false)
  })
})

describe("PluginWorkerManager", () => {
  it("失败隔离：一个 worker 起不来不影响已启动的其它 worker", async () => {
    const manager = new PluginWorkerManager()
    await manager.start("ok.plugin", EXAMPLE_WORKER, EXAMPLE_DIR, initInput("ok.plugin"))

    await expect(
      manager.start("bad.plugin", path.join(EXAMPLE_DIR, "nope.js"), EXAMPLE_DIR, initInput("bad.plugin")),
    ).rejects.toThrow(/入口不存在/)

    // 关键断言：坏的那个失败之后，好的那个仍然活着且健康
    const stillRunning = manager.get("ok.plugin")
    expect(stillRunning?.running).toBe(true)
    expect((await stillRunning!.health()).status).toBe("ok")

    await manager.stopAll()
    expect(manager.list()).toEqual([])
  })

  it("停机阶梯：stop() 会让 worker 进程真正退出", async () => {
    const manager = new PluginWorkerManager()
    const worker = await manager.start("ruoyi.hello-world", EXAMPLE_WORKER, EXAMPLE_DIR, initInput())
    const pid = worker.diagnostics.pid
    expect(typeof pid).toBe("number")

    await manager.stop("ruoyi.hello-world")

    // 进程应已退出（停机阶梯走完），PID 不再存活
    await new Promise((resolve) => setTimeout(resolve, 100))
    let alive = true
    try {
      process.kill(pid as number, 0)
    } catch {
      alive = false
    }
    expect(alive).toBe(false)
    expect(WORKER_LIMITS.gracefulShutdownMs).toBeGreaterThan(0)
  })
})
