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

const onlyIn = (a, ...others) => [...a].filter((item) => others.every((set) => !set.has(item))).sort()

function main() {
  const prisma = readPrismaTables()
  const migrations = readMigrationTables()
  const sqlite = readSqliteBootstrapTables()
  const union = new Set([...prisma, ...migrations, ...sqlite])

  const report = {
    generatedAt: new Date().toISOString(),
    note: "只报告不设门禁：三份来源互相矛盾，需先确定权威真源，再谈表归属/namespace 隔离。",
    counts: { prisma: prisma.size, migrations: migrations.size, sqliteBootstrap: sqlite.size, union: union.size },
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

  console.log("[table-inventory] 三份表来源对账（只报告，不阻断）")
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

  const target = path.join(ROOT, "docs", "architecture", "artifacts", "table-inventory-report.json")
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`[table-inventory] wrote ${path.relative(ROOT, target).replace(/\\/g, "/")}`)
}

main()
