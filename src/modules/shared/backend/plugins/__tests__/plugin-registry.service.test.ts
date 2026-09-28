import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterAll, afterEach, beforeEach, describe, expect, it } from "vitest"

import { ruoyiPrisma } from "@/modules/shared/backend/prisma"

import { PluginRegistryService } from "../plugin-registry.service"
import { PLUGIN_API_VERSION } from "../types"

// 本文件是 PostgreSQL 集成测试（plugin 表走 Prisma），依赖真实数据库。
// 未配置 DATABASE_URL 时跳过，否则在默认本地环境下必然红灯（并非真实缺陷）。
// 运行方式: DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db> npm test
const describeWithDatabase = process.env.DATABASE_URL ? describe : describe.skip

const TEST_PREFIX = "itest.plugin."

function writePackage(root: string, dirName: string, pluginId: string): string {
  const packageDir = path.join(root, dirName)
  fs.mkdirSync(path.join(packageDir, "dist"), { recursive: true })
  fs.writeFileSync(
    path.join(packageDir, "package.json"),
    JSON.stringify({
      name: `@itest/${dirName}`,
      ruoyiPlugin: { manifest: "./plugin.manifest.json", worker: "./dist/worker.js" },
    }),
  )
  fs.writeFileSync(
    path.join(packageDir, "plugin.manifest.json"),
    JSON.stringify({
      id: pluginId,
      apiVersion: PLUGIN_API_VERSION,
      version: "0.1.0",
      displayName: "ITest",
      description: "integration test plugin",
      author: "tests",
      categories: ["automation"],
      capabilities: ["plugin.state.read"],
      entrypoints: { worker: "./dist/worker.js" },
    }),
  )
  fs.writeFileSync(path.join(packageDir, "dist", "worker.js"), "export default {}\n")
  return packageDir
}

describeWithDatabase("PluginRegistryService", () => {
  let root: string

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "ruoyi-plugin-sync-"))
  })

  afterEach(async () => {
    fs.rmSync(root, { recursive: true, force: true })
    await ruoyiPrisma.plugin.deleteMany({ where: { pluginKey: { startsWith: TEST_PREFIX } } })
  })

  afterAll(async () => {
    await ruoyiPrisma.$disconnect()
  })

  it("合法包落库为 installed（不谎报 ready —— worker 运行时尚未落地）", async () => {
    writePackage(root, "alpha", `${TEST_PREFIX}alpha`)
    const result = await PluginRegistryService.syncFromDisk(root)

    expect(result.installed).toBe(1)
    expect(result.rejected).toEqual([])

    const record = await PluginRegistryService.get(`${TEST_PREFIX}alpha`)
    expect(record?.status).toBe("installed")
    expect(record?.version).toBe("0.1.0")
  })

  it("校验不过的包不落库，且拒绝原因被回传", async () => {
    const packageDir = writePackage(root, "bad", `${TEST_PREFIX}bad`)
    // 制造非法：能力不在白名单内
    const manifestFile = path.join(packageDir, "plugin.manifest.json")
    const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"))
    fs.writeFileSync(manifestFile, JSON.stringify({ ...manifest, capabilities: ["made.up"] }))

    const result = await PluginRegistryService.syncFromDisk(root)
    expect(result.installed).toBe(0)
    expect(result.rejected).toHaveLength(1)
    expect(result.rejected[0].errors.join()).toContain("白名单")
    expect(await PluginRegistryService.get(`${TEST_PREFIX}bad`)).toBeNull()
  })

  it("包从磁盘消失 → 逻辑删除并标 error", async () => {
    writePackage(root, "gamma", `${TEST_PREFIX}gamma`)
    await PluginRegistryService.syncFromDisk(root)

    fs.rmSync(path.join(root, "gamma"), { recursive: true, force: true })
    const result = await PluginRegistryService.syncFromDisk(root)

    expect(result.removed).toBe(1)
    // 默认查询按 deleted=false 过滤，故先前的查询应查不到
    expect(await PluginRegistryService.get(`${TEST_PREFIX}gamma`)).toBeNull()
  })

  it("插件目录不存在时不得清空注册表（一次挂载失败不该抹掉安装记录）", async () => {
    writePackage(root, "delta", `${TEST_PREFIX}delta`)
    await PluginRegistryService.syncFromDisk(root)
    expect(await PluginRegistryService.get(`${TEST_PREFIX}delta`)).not.toBeNull()

    const missing = path.join(root, "not-mounted")
    const result = await PluginRegistryService.syncFromDisk(missing)

    expect(result.installed).toBe(0)
    expect(result.removed).toBe(0)
    expect(await PluginRegistryService.get(`${TEST_PREFIX}delta`)).not.toBeNull()
  })
})
