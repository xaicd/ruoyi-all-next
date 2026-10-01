/**
 * 表定义 → Prisma 建表迁移。
 *
 * 为什么需要：本仓的低代码/Codepen 表定义（`CodegenConfig[]`，写在 scaffold 脚本里）
 * 会生成 Repository/Service/页面，但**从不生成建表 SQL** —— 于是会出现
 * "仓储在查、却没有任何地方建它"的表（`node scripts/report-table-inventory.cjs`
 * 的 `queriedButNeverCreated` 一栏）。这类表只在内存回退下可用，一旦连真实库
 * 必然 `relation "..." does not exist`，而且是静默的：看起来像自己改坏了代码。
 *
 * 本工具把那份表定义转成正式迁移，让"定义在哪、表就在哪"重新成立。
 *
 * 用法：
 *   tsx scripts/generate-table-migration.ts --tables scripts/scaffold-wms-domain.ts --export WMS_TABLES --name add_wms_tables
 *   tsx scripts/generate-table-migration.ts ... --write        # 落盘（默认 dry-run）
 *   tsx scripts/generate-table-migration.ts ... --check        # 只校验是否已存在，不写
 */
import fs from "node:fs"
import path from "node:path"

import type { CodegenConfig } from "../packages/domains/infra/backend/services/codegen-templates"

const ROOT = path.resolve(__dirname, "..")
const MIGRATIONS_DIR = path.join(ROOT, "prisma", "migrations")

/**
 * 低代码列类型 → PostgreSQL 类型。与既有迁移的写法保持一致（见 add_plugin_migration）。
 *
 * `precision`/`scale`/`maxLength` 若在元数据里声明了就**照用** —— 不能一律给默认值：
 * 例如 `master_pool_tokens` 是 10 亿量级，落到 INTEGER 会**溢出**，必须 BIGINT。
 */
function pgType(column: {
  name: string
  type: string
  isPk?: boolean
  maxLength?: number
  precision?: number
  scale?: number
}): string {
  // 主键走 TEXT，与仓库既有迁移一致（id 是应用侧生成的字符串，不是自增列）。
  if (column.isPk || column.name === "id") return "TEXT"
  switch (column.type) {
    case "varchar":
      if (column.maxLength) return `VARCHAR(${column.maxLength})`
      // 租户/外键类给窄一点，正文类宽一些；统一 VARCHAR 避免 TEXT 无法建唯一索引的坑。
      return column.name === "tenant_id" ? "VARCHAR(64)" : "VARCHAR(255)"
    case "text":
      return "TEXT"
    case "int":
      return "INTEGER"
    case "bigint":
      return "BIGINT"
    case "timestamp":
      return "TIMESTAMP(3)"
    case "decimal":
      return `DECIMAL(${column.precision ?? 18},${column.scale ?? 4})`
    case "boolean":
      return "BOOLEAN"
    default:
      return "VARCHAR(255)"
  }
}

/** 字面量默认值 -> SQL 片段（字符串要加引号；null 表示 DEFAULT NULL，显式写出）。 */
function defaultFromLiteral(value: unknown): string | null {
  if (value === undefined) return null
  if (value === null) return "NULL"
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return `'${String(value).replace(/'/g, "''")}'`
}

function columnLine(column: {
  name: string
  type: string
  nullable: boolean
  isPk?: boolean
  defaultValueTyped?: unknown
  defaultSql?: string
  maxLength?: number
  precision?: number
  scale?: number
}): string {
  const parts = [`    "${column.name}" ${pgType(column)}`]
  if (column.nullable !== true) parts.push("NOT NULL")
  // 默认值必须一起带上 —— 只建列不建默认值会静默改变语义。
  const literal = defaultFromLiteral(column.defaultValueTyped)
  const sqlDefault = column.defaultSql ?? literal
  if (sqlDefault !== null) parts.push(`DEFAULT ${sqlDefault}`)
  return parts.join(" ")
}

function tableSql(table: CodegenConfig): string {
  const columns = table.table.columns ?? []
  const pk = columns.filter((column) => column.isPk).map((column) => column.name)
  const lines = columns.map(columnLine)
  if (pk.length > 0) {
    lines.push(`    CONSTRAINT "${table.table.name}_pkey" PRIMARY KEY (${pk.map((name) => `"${name}"`).join(", ")})`)
  }
  const statements = [`CREATE TABLE "${table.table.name}" (\n${lines.join(",\n")}\n);`]
  // 多租户过滤（AGENTS §4.8）几乎总是按 tenant_id 走，补索引。
  if (columns.some((column) => column.name === "tenant_id")) {
    statements.push(`CREATE INDEX "${table.table.name}_tenant_id_idx" ON "${table.table.name}"("tenant_id");`)
  }
  return `-- ${table.table.comment ?? table.businessName}\n${statements.join("\n")}`
}

function main() {
  const argv = process.argv.slice(2)
  const arg = (flag: string, fallback?: string) => {
    const index = argv.indexOf(flag)
    return index >= 0 ? argv[index + 1] : fallback
  }
  const tablesModule = arg("--tables")
  const exportName = arg("--export", "default")
  const name = arg("--name")
  const write = argv.includes("--write")

  if (!tablesModule || !name) {
    console.error("用法: --tables <模块> --export <导出名> --name <迁移名> [--write]")
    process.exit(2)
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const loaded = require(path.resolve(ROOT, tablesModule)) as Record<string, CodegenConfig[]>
  const tables = loaded[exportName]
  if (!Array.isArray(tables) || tables.length === 0) {
    console.error(`[table-migration] 导出 "${exportName}" 不是非空数组`)
    process.exit(2)
  }

  const header = [
    `-- 由 scripts/generate-table-migration.ts 生成，请勿手改。`,
    `-- 来源: ${tablesModule}#${exportName}`,
    `-- 背景: 这些表的定义来自低代码 CodegenConfig；此前只生成代码、不生成建表 SQL，`,
    `--       导致"仓储在查但无处创建"。本迁移补齐 DDL。`,
    "",
  ].join("\n")
  const sql = `${header}${tables.map(tableSql).join("\n\n")}\n`

  if (!write) {
    console.log(sql)
    console.log(`[table-migration] dry-run: ${tables.length} 张表；加 --write 落盘`)
    return
  }

  // 幂等: 同名迁移已存在就原地更新（避免每次跑生成器都堆一个目录）。
  // 头部不含时间戳 —— 输出必须**确定**: 定义没变时重跑不改文件, diff 才可信。
  const existing = fs.existsSync(MIGRATIONS_DIR)
    ? fs.readdirSync(MIGRATIONS_DIR).find((entry) => entry.endsWith(`_${name}`))
    : undefined
  if (existing) {
    const file = path.join(MIGRATIONS_DIR, existing, "migration.sql")
    fs.writeFileSync(file, sql)
    console.log(`[table-migration] 已更新 ${path.relative(ROOT, file)}（${tables.length} 张表）`)
    return
  }

  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)
  const dir = path.join(MIGRATIONS_DIR, `${stamp}_${name}`)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, "migration.sql"), sql)
  console.log(`[table-migration] 已创建 prisma/migrations/${stamp}_${name}/migration.sql（${tables.length} 张表）`)
}

main()
