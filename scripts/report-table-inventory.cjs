/**
 * 表清单对账报告（只报告，不设门禁）。
 *
 * 为什么需要：本仓有三份"表定义"来源，互相矛盾 ——
 *   prisma/schema.prisma 的 @@map
 *   prisma/migrations/__/migration.sql 的 CREATE TABLE
 *   scripts/bootstrap-sqlite.ts 的 CREATE TABLE
 * 在没有公认真源之前，任何"表归属 / namespace 隔离"的治理物都会是部分正确的假象
 * （module→plugin 迁移的 P2b 正卡在这里）。
 *
 * 本脚本只把差异摊开，供人决定哪份是真相；不判定、不阻断 —— 与 AGENTS.md §6.4
 * 的「报告 vs 门禁」分工一致（待真相确定后，再考虑升级为 ratchet 门禁）。
 *
 * 用法：node scripts/report-table-inventory.cjs [--json]
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")

function readPrismaTables() {
  const file = path.join(ROOT, "prisma", "schema.prisma")
  if (!fs.existsSync(file)) return new Set()
  const source = fs.readFileSync(file, "utf8")
  const tables = new Set()
  for (const match of source.matchAll(/@@map\("([a-z0-9_]+)"\)/g)) tables.add(match[1])
  return tables
}

function readMigrationTables() {
  const dir = path.join(ROOT, "prisma", "migrations")
  const tables = new Set()
  if (!fs.existsSync(dir)) return tables
  for (const entry of fs.readdirSync(dir)) {
    const file = path.join(dir, entry, "migration.sql")
    if (!fs.existsSync(file)) continue
    const source = fs.readFileSync(file, "utf8")
    for (const match of source.matchAll(/CREATE TABLE (?:IF NOT EXISTS )?"?([a-z0-9_]+)"?/gi)) {
      tables.add(match[1].toLowerCase())
    }
  }
  return tables
}

function readSqliteBootstrapTables() {
  const file = path.join(ROOT, "scripts", "bootstrap-sqlite.ts")
  if (!fs.existsSync(file)) return new Set()
  const source = fs.readFileSync(file, "utf8")
  const tables = new Set()
  for (const match of source.matchAll(/CREATE TABLE (?:IF NOT EXISTS )?["`]?([a-z0-9_]+)/gi)) {
    tables.add(match[1].toLowerCase())
  }
  return tables
}

/**
 * 第四份来源：**仓储声明的物理表名**（`const TABLE_NAME = "..."`，codegen 产物的固定写法）。
 *
 * 为什么要加这一份：前三份都是"建表的地方"，但真正决定"运行时会不会去查某张表"的是
 * 仓储。若某张表**前三份都没有、仓储却在查**，那么——代码在
 * `hasRealDatabase() === true` 时会去查一张**永远不存在**的表，直接 `relation does not exist`。
 * 这不是理论风险：本地一旦配好 DATABASE_URL，测试就会从 353 全绿变成一片红，
 * 开发者按"常规做法"配库反而踩坑（本仓实测）。
 */
function readRepositoryTables() {
  const roots = [path.join(ROOT, "packages"), path.join(ROOT, "src")]
  const tables = new Set()
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === "__tests__") continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith(".repository.ts")) {
        const source = fs.readFileSync(full, "utf8")
        const match = source.match(/const TABLE_NAME\s*=\s*"([a-z0-9_]+)"/)
        if (match) tables.add(match[1].toLowerCase())
      }
    }
  }
  for (const root of roots) walk(root)
  return tables
}

const onlyIn = (a, ...others) => [...a].filter((item) => others.every((set) => !set.has(item))).sort()

function main() {
  const prisma = readPrismaTables()
  const migrations = readMigrationTables()
  const sqlite = readSqliteBootstrapTables()
  const repositories = readRepositoryTables()
  const union = new Set([...prisma, ...migrations, ...sqlite])

  const report = {
    generatedAt: new Date().toISOString(),
    note: "只报告不设门禁：三份来源互相矛盾，需先确定权威真源，再谈表归属/namespace 隔离。",
    counts: {
      prisma: prisma.size,
      migrations: migrations.size,
      sqliteBootstrap: sqlite.size,
      repositories: repositories.size,
      union: union.size,
    },
    // 仓储在查、但三份建表来源里一张都没定义 —— 这些表在真实库里**永远不存在**。
    queriedButNeverCreated: [...repositories].filter((t) => !union.has(t)).sort(),
    onlyIn: {
      prisma: onlyIn(prisma, migrations, sqlite),
      migrations: onlyIn(migrations, prisma, sqlite),
      sqliteBootstrap: onlyIn(sqlite, prisma, migrations),
    },
    inAllThree: [...union].filter((t) => prisma.has(t) && migrations.has(t) && sqlite.has(t)).sort(),
  }

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log("[table-inventory] 表定义来源对账（只报告，不阻断）")
  console.log(`  prisma/schema.prisma @@map : ${report.counts.prisma}`)
  console.log(`  prisma/migrations          : ${report.counts.migrations}`)
  console.log(`  scripts/bootstrap-sqlite.ts: ${report.counts.sqliteBootstrap}`)
  console.log(`  并集（非"真相"）           : ${report.counts.union}`)
  console.log(`  三份都有                   : ${report.inAllThree.length}`)
  const { prisma: p, migrations: m, sqliteBootstrap: s } = report.onlyIn
  console.log(`  仅 prisma 有               : ${p.length}`)
  console.log(`  仅 migrations 有           : ${m.length}`)
  console.log(`  仅 sqlite bootstrap 有     : ${s.length}`)
  if (m.length > 0) console.log(`    e.g. ${m.slice(0, 8).join(", ")}`)
  if (p.length > 0) console.log(`    prisma 独有 e.g. ${p.slice(0, 8).join(", ")}`)

  // 最要命的一栏：仓储在查、却没有任何地方建它 —— 真实库里必然 relation does not exist。
  const q = report.queriedButNeverCreated
  console.log("")
  console.log(`  仓储声明的物理表           : ${report.counts.repositories}`)
  console.log(`  ⚠ 仓储在查但**无处创建**   : ${q.length}`)
  if (q.length > 0) {
    console.log(`    ${q.slice(0, 10).join(", ")}${q.length > 10 ? ` …(共 ${q.length})` : ""}`)
    console.log("    这些表只在内存回退下可用。一旦配了 DATABASE_URL 走真实库，")
    console.log("    查它们必然报 relation does not exist —— 且是静默陷阱：按常规\"先配库\"反而全红。")
  }

  const target = path.join(ROOT, "docs", "architecture", "artifacts", "table-inventory-report.json")
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`[table-inventory] wrote ${path.relative(ROOT, target).replace(/\\/g, "/")}`)
}

main()
