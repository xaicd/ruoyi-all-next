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
import { tableDdl } from "../packages/domains/infra/backend/services/codegen-templates/column-type"

const ROOT = path.resolve(__dirname, "..")
const MIGRATIONS_DIR = path.join(ROOT, "prisma", "migrations")

/**
 * 低代码列类型 → PostgreSQL 类型。与既有迁移的写法保持一致（见 add_plugin_migration）。
 *
 * `precision`/`scale`/`maxLength` 若在元数据里声明了就**照用** —— 不能一律给默认值：
 * 例如 `master_pool_tokens` 是 10 亿量级，落到 INTEGER 会**溢出**，必须 BIGINT。
 */
// 类型映射与 DDL 生成在 codegen 模板侧（**单一真源**）—— 两边各写一份映射迟早漂移。
// 本文件只做编排: 元数据表定义 -> 迁移文件。
function tableSql(table: CodegenConfig): string {
  return tableDdl({ name: table.table.name, comment: table.table.comment, columns: table.table.columns ?? [] })
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
