#!/usr/bin/env node
/**
 * 安全渗透（轻量）—— 对着**跑起来的应用**打真实请求，检查本仓自己承诺过的东西。
 *
 * 为什么要有: 全流程交付链里，压测与渗透是**唯一两处没有工具**的环节。
 *   * §3.3 第 6 条要求「容量目标须由 SLO、**压测**和资源预算确定」——但没有压测工具；
 *   * §8 只要求「权限边界必须有**拒绝路径**测试」——没有越权/伪造/泄露检查。
 *
 * 本脚本检查的都是**仓里有明文承诺**的项，不是通用清单:
 *   §4.8 禁止信任调用方伪造的 tenant（`x-tenant-id`）
 *   §4.4 新增 API 必须使用 permission code
 *   §3.2.1 插件挂载按 manifest 的 auth 声明守卫（operator / company / public）
 *   §4.5 日志禁止输出密码、密钥、token
 *   路由保护基线: /api/v1/admin/** 必须落到 requireAdminAuth
 *
 * 用法:
 *   node scripts/security-scan.cjs                # 自管理环境，跑完清场
 *   node scripts/security-scan.cjs --keep
 *   node scripts/security-scan.cjs --base http://localhost:3200   # 对已有实例跑
 */
const { spawnSync, spawn } = require("node:child_process")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")

const ROOT = path.resolve(__dirname, "..")
const KEEP = process.argv.includes("--keep")
const arg = (flag) => { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : undefined }
const BASE = arg("--base") || "http://localhost:3200"
const DB = "ruoyi_secscan"
const URL = `postgresql://ruoyi:ruoyi123@localhost:5433/${DB}?schema=public`
const PASSWORD = "SecScan@123456"
const SALT = "secscan-salt"

const findings = []
const step = (name, ok, detail = "") => {
  findings.push({ name, ok, detail })
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? `  ${detail}` : ""}`)
}
const sh = (cmd, args, env = {}) => spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", env: { ...process.env, ...env } })
const psql = (db, sql) => sh("docker", ["exec", "ruoyi-dev-postgres-1", "psql", "-U", "ruoyi", "-d", db, "-t", "-A", "-c", sql])

let app = null
let startedPostgres = false
let envLocalBackup = null

const cleanup = async () => {
  if (KEEP) { console.log(`\n[sec] --keep: 服务留在 ${BASE}`); return }
  if (app) app.kill("SIGTERM")
  const envLocal = path.join(ROOT, ".env.local")
  if (envLocalBackup === null) fs.rmSync(envLocal, { force: true })
  else fs.writeFileSync(envLocal, envLocalBackup)
  psql("postgres", `DROP DATABASE IF EXISTS ${DB}`)
  if (startedPostgres) sh("pnpm", ["run", "db:down"])
}

/** 发一个请求，返回 {status, body, headers}。 */
async function probe(pathname, init = {}) {
  const response = await fetch(`${BASE}${pathname}`, { redirect: "manual", signal: AbortSignal.timeout(20000), ...init })
  const body = await response.text()
  return { status: response.status, body, headers: Object.fromEntries(response.headers) }
}

async function main() {
  console.log(`\n=== 安全扫描（${BASE}）===\n`)

  if (!arg("--base")) {
    const healthy = sh("docker", ["inspect", "--format={{.State.Health.Status}}", "ruoyi-dev-postgres-1"]).stdout?.trim() === "healthy"
    if (!healthy) { startedPostgres = true; sh("pnpm", ["run", "db:up"]) }
    for (let i = 0; i < 20; i += 1) {
      if (sh("docker", ["inspect", "--format={{.State.Health.Status}}", "ruoyi-dev-postgres-1"]).stdout?.trim() === "healthy") break
      await new Promise((r) => setTimeout(r, 3000))
    }
    psql("postgres", `DROP DATABASE IF EXISTS ${DB}`)
    psql("postgres", `CREATE DATABASE ${DB}`)
    sh("npx", ["prisma", "migrate", "deploy"], { DATABASE_URL: URL })
    // **必须检查种子自己的退出码** —— 它可能建完 admin 之后才失败，
    // 那样 admin-count 会通过而登录永远 401（实测踩到，整整查了一轮）
    const seed = sh("npx", ["tsx", "scripts/seed-postgresql.ts"], { DATABASE_URL: URL, DB_DRIVER: "postgresql", ADMIN_BOOTSTRAP_USERNAME: "admin", ADMIN_BOOTSTRAP_PASSWORD: PASSWORD, ADMIN_BOOTSTRAP_SALT: SALT })
    if (seed.status !== 0) {
      step("种子执行成功", false, "见下方日志尾部")
      console.log((seed.stdout + seed.stderr).split("\n").slice(-12).map((l) => `      ${l}`).join("\n"))
      return
    }
    step("种子执行成功", true)
    sh("npx", ["tsx", "scripts/register-plugins.ts"], { DATABASE_URL: URL })

    const envLocal = path.join(ROOT, ".env.local")
    envLocalBackup = fs.existsSync(envLocal) ? fs.readFileSync(envLocal, "utf8") : null
    fs.writeFileSync(envLocal, `DATABASE_URL=${URL}\nDB_DRIVER=postgresql\nTENANT_MODE=disabled\nTENANT_PLATFORM_USERNAMES=admin\nADMIN_BOOTSTRAP_USERNAME=admin\nADMIN_BOOTSTRAP_PASSWORD=${PASSWORD}\nADMIN_BOOTSTRAP_SALT=${SALT}\n`)
    const logFile = path.join(os.tmpdir(), "security-scan-app.log")
    fs.writeFileSync(logFile, "") // 每轮截断
    app = spawn("pnpm", ["run", "dev"], {
      cwd: ROOT, stdio: ["ignore", fs.openSync(logFile, "w"), fs.openSync(logFile, "w")],
      env: { ...process.env, DATABASE_URL: URL, DB_DRIVER: "postgresql", TENANT_MODE: "disabled", TENANT_PLATFORM_USERNAMES: "admin", ADMIN_BOOTSTRAP_USERNAME: "admin", ADMIN_BOOTSTRAP_PASSWORD: PASSWORD, ADMIN_BOOTSTRAP_SALT: SALT },
    })
    let ready = false
    for (let i = 0; i < 40; i += 1) {
      try { if ((await fetch(`${BASE}/`, { signal: AbortSignal.timeout(2000) })).status < 500) { ready = true; break } } catch { /* 未就绪 */ }
      await new Promise((r) => setTimeout(r, 3000))
    }
    if (!ready) { step("起服务", false); console.log(fs.readFileSync(logFile, "utf8").slice(-600)); return }
    // 先确认种子真的建了 admin —— 否则 401 时无从判断是种子失败还是鉴权失败
    const seeded = psql("ruoyi_secscan", "SELECT count(*) FROM \"system_user\" WHERE username='admin'")
    step("种子建出 admin（表名须加引号：system_user 是保留字）", seeded.stdout?.trim() === "1", `count=${seeded.stdout?.trim()}`)
    step("起服务", true, BASE)
  }

  // ---- 1. 未认证访问 admin API 必须被拒（§3.2.1 路由保护基线）----
  const adminPaths = ["/api/v1/admin/system/users", "/api/v1/admin/system/menus", "/api/v1/admin/infra/configs", "/api/v1/admin/modules"]
  const openPaths = []
  for (const p of adminPaths) {
    const r = await probe(p)
    if (![401, 403].includes(r.status)) openPaths.push(`${p} → ${r.status}`)
  }
  step("未认证访问 admin API 全部被拒（401/403）", openPaths.length === 0, openPaths.join(", "))

  // ---- 2. 伪造 Bearer token 必须被拒 ----
  const forged = await probe("/api/v1/admin/system/users", { headers: { Authorization: "Bearer forged.not.a.real.token" } })
  step("伪造 token 被拒（401）", [401, 403].includes(forged.status), `HTTP ${forged.status}`)

  // ---- 3. 伪造 tenant 头不得越权（§4.8 禁止信任调用方伪造的 tenant）----
  const forgedTenant = await probe("/api/v1/admin/system/users", { headers: { "x-tenant-id": "999", "x-tenant-code": "999" } })
  step("伪造 x-tenant-id 不得放行", [401, 403].includes(forgedTenant.status), `HTTP ${forgedTenant.status}`)

  // ---- 4. 插件挂载点: 未认证访问 operator 插件必须 401 ----
  const plugin = await probe("/api/v1/plugins/ruoyi.system/api/ping")
  step("插件挂载点未认证被拒（或 404 未挂载，均非 200）", plugin.status !== 200, `HTTP ${plugin.status}`)

  // ---- 5. 错误响应不得泄露栈/内部路径（§4.5）----
  const bad = await probe("/api/v1/admin/system/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" })
  const leaks = /at\s+\w+\s+\(|node_modules|\.ts:\d+|stack/i.test(bad.body)
  step("错误响应不泄露栈/内部路径", !leaks, leaks ? `HTTP ${bad.status} 且响应里出现栈特征` : `HTTP ${bad.status}`)

  // ---- 6. 通用安全响应头 ----
  const head = await probe("/")
  const missing = ["x-content-type-options", "x-frame-options", "content-security-policy"].filter((h) => !head.headers[h])
  step("基础安全响应头存在", missing.length === 0, missing.length ? `缺: ${missing.join(", ")}` : "齐全")

  // ---- 7. 登录接口对错误口令必须 401（不是 200/500）----
  const wrongPassword = await probe("/api/v1/admin/system/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "admin", password: "wrong-password-123" }) })
  step("错误口令返回 401", wrongPassword.status === 401, `HTTP ${wrongPassword.status}`)

  // ---- 8. 正常登录可用（阴性对照: 免得"全拒"被当成安全）----
  const login = await probe("/api/v1/admin/system/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "admin", password: PASSWORD }) })
  let token = null
  try { token = JSON.parse(login.body)?.data?.token } catch { /* 交给断言 */ }
  step("阴性对照: 正确口令能登录（避免「全拒」冒充安全）", Boolean(token), `HTTP ${login.status}`)

  // ---- 9. 带合法 token 访问受保护接口应 200（证明上面不是"全都被拒"）----
  if (token) {
    const ok = await probe("/api/v1/admin/system/menus/sidebar", { headers: { Authorization: `Bearer ${token}` } })
    step("阴性对照: 合法 token 能访问受保护接口", ok.status === 200, `HTTP ${ok.status}`)
  }
}

main()
  .catch((error) => { console.error(`  ✗ 扫描异常: ${error.message}`); findings.push({ name: "扫描异常", ok: false, detail: error.message }) })
  .finally(async () => {
    const failed = findings.filter((f) => !f.ok)
    const report = { scannedAt: new Date().toISOString(), base: BASE, total: findings.length, failed: failed.length, findings }
    const out = path.join(ROOT, "docs", "architecture", "artifacts", "security-scan-result.json")
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, JSON.stringify(report, null, 2) + "\n")
    if (failed.length > 0) {
    const logFile = path.join(os.tmpdir(), "security-scan-app.log")
    if (fs.existsSync(logFile)) console.log(`[sec] 应用日志尾部（失败时必看）:\n` + fs.readFileSync(logFile, "utf8").split("\n").slice(-12).join("\n"))
  }
  console.log(`\n[sec] ${findings.length - failed.length}/${findings.length} 通过 —— 结果落盘 ${path.relative(ROOT, out)}`)
    await cleanup()
    process.exit(failed.length === 0 ? 0 : 1)
  })
