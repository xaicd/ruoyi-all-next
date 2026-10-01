/**
 * 表定义来源的统一扫描（报告与门禁共用，避免两处实现漂移）。
 *
 * 为什么需要: 本仓的表定义有多个来源（低代码元数据 / prisma migrations /
 * sqlite bootstrap），而**真正决定"运行时会不会去查某张表"的是仓储**。
 * 一旦某个源认为"表存在"、仓储却在查一个"没有任何地方创建"的表，
 * 连真实库就是 `relation "..." does not exist` —— 而且是**静默**的：
 * 内存回退不校验约束，所以本地全绿，配了库反而全红。
 *
 * 真相源的选择见 AGENTS.md §9.4（当前采用: **低代码元数据为唯一真源**）。
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..", "..")

/** 低代码元数据（`CodegenConfig`）里的表名。 */
function readMetadataTables() {
  const dir = path.join(ROOT, "scripts", "data")
  const tables = new Set()
  if (!fs.existsSync(dir)) return tables
  for (const entry of fs.readdirSync(dir)) {
    if (!entry.endsWith(".ts")) continue
    const source = fs.readFileSync(path.join(dir, entry), "utf8")
    // 只认 `table: { name: "..." }` —— 列也是 `name:`，不锚定会把列名当表名。
    for (const match of source.matchAll(/table:\s*\{\s*name:\s*"([a-z0-9_]+)"/g)) {
      tables.add(match[1].toLowerCase())
    }
  }
  return tables
}

/** prisma/migrations 里建的表。 */
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

/** scripts/bootstrap-sqlite.ts 里建的表。 */
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

/** prisma/schema.prisma 的 @@map。 */
function readPrismaTables() {
  const file = path.join(ROOT, "prisma", "schema.prisma")
  if (!fs.existsSync(file)) return new Set()
  const source = fs.readFileSync(file, "utf8")
  const tables = new Set()
  for (const match of source.matchAll(/@@map\("([a-z0-9_]+)"\)/g)) tables.add(match[1])
  return tables
}

/**
 * 仓储/服务**实际查询**的物理表名。
 *
 * 两种写法都要认，否则报告会"看起来完整、实际有洞"：
 *   1. codegen 约定 `const TABLE_NAME = "x"`
 *   2. 手写仓储直接 `db.selectFrom("x")`
 */
function readQueriedTables() {
  const tables = new Set()
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === "__tests__") continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
        continue
      }
      if (!entry.name.endsWith(".repository.ts") && !entry.name.endsWith(".service.ts")) continue
      const source = fs.readFileSync(full, "utf8")
      const named = source.match(/const TABLE_NAME\s*=\s*"([a-z0-9_]+)"/)
      if (named) tables.add(named[1].toLowerCase())
      for (const match of source.matchAll(/\.(?:selectFrom|insertInto|updateTable|deleteFrom|into)\("([a-z0-9_]+)"/g)) {
        tables.add(match[1].toLowerCase())
      }
    }
  }
  walk(path.join(ROOT, "packages"))
  walk(path.join(ROOT, "src"))
  return tables
}

module.exports = {
  ROOT,
  readMetadataTables,
  readMigrationTables,
  readSqliteBootstrapTables,
  readPrismaTables,
  readQueriedTables,
}
