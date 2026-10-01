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

/**
 * ⚠️ 本文件与 test/integration/plugin-lifecycle.integration.test.ts 之间有一个**跨文件竞态**，
 * 已知、尚未修（不是本用例的缺陷）:
 *
 * 两个文件并行运行，各自调用 `syncFromDisk(自己的临时目录)`；而 syncFromDisk 会**逻辑删除**
 * "本次扫描不到"的插件 —— 包括另一个测试刚装进去的。集成测试那次 sync 会把本文件的
 * `@itest/alpha` 一并删掉，于是这里读出来是 undefined（全量跑时偶发；单独跑必过）。
 *
 * syncFromDisk 的行为本身是**对的**（包没了就该清记录），错的是"并行测试共享同一份注册表"。
 * 两种修法（都需产品/测试策略决定，未擅自选）:
 *   a) 让这两个文件串行（vitest 跨文件串行需要配置，会影响整体耗时）；
 *   b) 让 syncFromDisk 只清理**来自同一扫描根**的插件，不跨根删除 —— 属产品行为变更。
 */
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

    // 断言**状态**而不是全局计数: syncFromDisk 会同时扫描第一方插件根
    // （packages/plugins/*，当前 16 个），所以 installed 是全域聚合值，
    // 不是"本次测试造了几个包"。计数写死会让测试随插件数量漂移。
    expect(result.rejected.filter((item) => item.packageName === "@itest/alpha")).toEqual([])

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
    // packageName 来自 package.json 的 name 字段（见 writePackage），不是插件 id。
    const rejected = result.rejected.filter((item) => item.packageName === "@itest/bad")
    expect(rejected).toHaveLength(1)
    expect(rejected[0].errors.join()).toContain("白名单")
    expect(await PluginRegistryService.get(`${TEST_PREFIX}bad`)).toBeNull()
  })

  it("包从磁盘消失 → 逻辑删除并标 error", async () => {
    writePackage(root, "gamma", `${TEST_PREFIX}gamma`)
    await PluginRegistryService.syncFromDisk(root)

    fs.rmSync(path.join(root, "gamma"), { recursive: true, force: true })
    await PluginRegistryService.syncFromDisk(root)

    // 同上: removed 是全域聚合值，用状态断言（第一方插件也在这次扫描里，不受影响）
    expect(await PluginRegistryService.get(`${TEST_PREFIX}gamma`)).toBeNull()
  })

  it("插件目录不存在时不得清空注册表（一次挂载失败不该抹掉安装记录）", async () => {
    writePackage(root, "delta", `${TEST_PREFIX}delta`)
    await PluginRegistryService.syncFromDisk(root)
    expect(await PluginRegistryService.get(`${TEST_PREFIX}delta`)).not.toBeNull()

    const missing = path.join(root, "not-mounted")
    await PluginRegistryService.syncFromDisk(missing)

    // 目录不存在时不得清空注册表 —— 断言记录还在（而不是断言全局计数为 0，
    // 那会让"第一方插件也没了"和"本次没有新增"变得不可区分）
    expect(await PluginRegistryService.get(`${TEST_PREFIX}delta`)).not.toBeNull()
  })
})
