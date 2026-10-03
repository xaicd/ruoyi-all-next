/**
 * 从源框架（ruoyi-vue-pro / yudao）**导入表定义**，转成本仓的低代码元数据。
 *
 * 为什么用工具而不是手抄：源框架一个模块动辄几十上百张表（mes 133、mall 49、hrm 50…），
 * 手抄既慢又必然抄错。而它的实体类里有**权威信息**: `@TableName` 给表名、
 * Java 类型给列类型、字段 javadoc 就是列注释。
 *
 * 产出 `scripts/data/<域>-source-tables.ts`（`CodegenConfig[]`），之后走标准链路:
 *   npm run domain:new <域>        # 建表迁移 + codegen + 注册插件
 *
 * 用法:
 *   git clone --depth 1 --filter=blob:none --sparse https://github.com/YunaiV/ruoyi-vue-pro.git /tmp/yudao
 *   cd /tmp/yudao && git sparse-checkout set --no-cone '/yudao-module-pay'
 *   npx tsx scripts/import-source-tables.ts --source /tmp/yudao --module pay --domain pay --write
 *
 * 说明（边界）:
 *   - 只做"实体 -> 元数据"的机械转换；**不做**业务逻辑移植（那是各域自己的事）
 *   - 列可空按 Java 包装类型/基本类型推断（基本类型非空、包装类型可空），属**启发式**，
 *     生成后应过一遍人眼 —— 所以带 `nullableInferred` 标记，便于复核差异
 *   - 审计底座字段按本仓约定补齐（源框架放在 BaseDO 里，不在实体中）
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(__dirname, "..")
const argv = process.argv.slice(2)
const arg = (flag: string) => {
  const index = argv.indexOf(flag)
  return index >= 0 ? argv[index + 1] : undefined
}
const write = argv.includes("--write")

const sourceRoot = arg("--source")
const moduleName = arg("--module")
const domain = arg("--domain") ?? moduleName

if (!sourceRoot || !moduleName) {
  console.error("用法: npx tsx scripts/import-source-tables.ts --source <yudao 克隆路径> --module <模块名> [--domain <本仓域名>] [--write]")
  process.exit(2)
}
if (!fs.existsSync(sourceRoot)) {
  console.error(`源框架路径不存在: ${sourceRoot}`)
  process.exit(2)
}

/** Java 类型 -> 本仓元数据类型（低代码列类型）。 */
function columnType(javaType: string): { type: string; tsType: string } | null {
  const base = javaType.replace(/<.*>/, "").trim()
  if (base === "String") return { type: "varchar", tsType: "string" }
  if (base === "Integer" || base === "int" || base === "Short" || base === "Byte") return { type: "int", tsType: "number" }
  if (base === "Long" || base === "long") return { type: "bigint", tsType: "number" }
  if (base === "BigDecimal" || base === "Double" || base === "double" || base === "Float") return { type: "decimal", tsType: "number" }
  if (base === "Boolean" || base === "boolean") return { type: "boolean", tsType: "boolean" }
  if (base === "LocalDateTime" || base === "Date" || base === "Timestamp") return { type: "timestamp", tsType: "string" }
  if (base === "LocalDate") return { type: "timestamp", tsType: "string" }
  // 集合/枚举/未知类型 -> 存文本（源框架里多为 JSON 或枚举码）
  if (base === "List" || base === "Set" || base === "Map") return { type: "text", tsType: "string" }
  return { type: "varchar", tsType: "string" }
}

const JAVA_PRIMITIVES = new Set(["int", "long", "double", "float", "boolean", "short", "byte", "char"])

const toSnake = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase()

function walk(dir: string, out: string[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name.endsWith("DO.java")) out.push(full)
  }
}

type ParsedTable = { table: string; comment: string; className: string; columns: Array<Record<string, unknown>> }

function parseEntity(file: string): ParsedTable | null {
  const source = fs.readFileSync(file, "utf8")
  const tableMatch = source.match(/@TableName\(\s*(?:value\s*=\s*)?["']([a-z0-9_]+)["']/)
  if (!tableMatch) return null
  const className = path.basename(file, ".java").replace(/DO$/, "")

  const columns: Array<Record<string, unknown>> = []
  const lines = source.split("\n")
  let javadoc: string[] = []
  let pendingTableId = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("/**")) { javadoc = []; continue }
    if (trimmed.startsWith("*")) { javadoc.push(trimmed.replace(/^\*+\s?/, "").trim()); continue }
    if (trimmed.startsWith("*/")) continue
    if (/^@TableId\b/.test(trimmed) || trimmed.startsWith("@TableId(")) { pendingTableId = true; continue }
    if (!trimmed.startsWith("private ")) continue

    const field = trimmed.replace(/;$/, "").match(/^private\s+([A-Za-z][\w<>, .]*?)\s+(\w+)\s*(?:=.*)?$/)
    if (!field) continue
    const [, javaType, name] = field
    const mapped = columnType(javaType)
    if (!mapped) continue

    const comment = javadoc.filter(Boolean).slice(0, 1).join("") || name
    const isPrimitive = JAVA_PRIMITIVES.has(javaType.trim())
    // 主键判定: 标注了 @TableId，**或者**列名就叫 id —— 后者是稳妥兜底。
    // 漏判的后果不是报错而是"建出来的表没有主键"（实测踩到: 源框架有的实体没写 @TableId）。
    const isPk = pendingTableId || name === "id"
    columns.push({
      name: toSnake(name),
      type: mapped.type,
      tsType: mapped.tsType,
      // 启发式: 主键必然非空；其余按 Java 基本类型/包装类型推断
      nullable: isPk ? false : !isPrimitive,
      comment,
      ...(isPk ? { isPk: true } : {}),
      ...(mapped.type === "decimal" ? { precision: 18, scale: 2 } : {}),
      nullableInferred: true,
    })
    pendingTableId = false
    javadoc = []
  }
  if (columns.length === 0) return null
  return { table: tableMatch[1], comment: `${className}（源框架导入）`, className, columns }
}

function main() {
  const moduleDir = path.join(sourceRoot, `yudao-module-${moduleName}`)
  if (!fs.existsSync(moduleDir)) {
    console.error(`找不到源模块目录: yudao-module-${moduleName}`)
    process.exit(2)
  }
  const files: string[] = []
  walk(moduleDir, files)

  const tables: ParsedTable[] = []
  for (const file of files) {
    const parsed = parseEntity(file)
    if (parsed) tables.push(parsed)
  }
  tables.sort((a, b) => a.table.localeCompare(b.table))

  console.log(`[import-source] 模块 ${moduleName} 解析出 ${tables.length} 张表（共 ${files.length} 个 DO 文件）`)
  if (tables.length === 0) process.exit(1)

  const audit = [
    { name: "tenant_id", type: "varchar", tsType: "string", nullable: false, comment: "租户ID", nullableInferred: false },
    { name: "created_by", type: "varchar", tsType: "string", nullable: true, comment: "创建者", nullableInferred: true },
    { name: "created_at", type: "timestamp", tsType: "string", nullable: false, comment: "创建时间", nullableInferred: true },
    { name: "updated_by", type: "varchar", tsType: "string", nullable: true, comment: "更新者", nullableInferred: true },
    { name: "updated_at", type: "timestamp", tsType: "string", nullable: false, comment: "更新时间", nullableInferred: true },
    { name: "deleted", type: "boolean", tsType: "boolean", nullable: false, defaultValueTyped: false, comment: "逻辑删除", nullableInferred: false },
  ]

  const entries = tables.map((table) => {
    const has = (column: string) => table.columns.some((item) => item.name === column)
    const columns = [...table.columns, ...audit.filter((column) => !has(column.name))]
    return { table, columns }
  })

  const out = `// 由 scripts/import-source-tables.ts 从源框架 yudao-module-${moduleName} 导入，**勿手改**。
// 列可空为启发式推断（Java 基本类型/包装类型），审计底座字段按本仓约定补齐。
import type { CodegenConfig } from "../packages/domains/infra/backend/services/codegen-templates"

export const ${domain.replace(/[^a-z0-9]/gi, "_").toUpperCase()}_TABLES: CodegenConfig[] = [
${entries
  .map(
    ({ table, columns }) => `  {
    moduleName: "${domain}",
    className: "${table.className}",
    businessName: "${table.comment}",
    parentMenuId: "${domain}-dir",
    permissionPrefix: "${domain}:${toSnake(table.className).replace(/-/g, "")}",
    table: {
      name: "${table.table}",
      comment: "${table.comment}",
      columns: [
${columns.map((column) => `        ${JSON.stringify(column)},`).join("\n")}
      ],
    },
  },`,
  )
  .join("\n")}
]
`

  const target = path.join(ROOT, "scripts", "data", `${domain}-source-tables.ts`)
  if (write) {
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, out)
    console.log(`  ✓ 已写 ${path.relative(ROOT, target)}`)
    console.log(`\n  下一步: npm run domain:new ${domain} --tables scripts/data/${domain}-source-tables.ts --export ${domain.toUpperCase()}_TABLES`)
  } else {
    console.log(out.slice(0, 1200))
    console.log(`\n  (dry-run: 未写入。加 --write 落盘到 scripts/data/${domain}-source-tables.ts)`)
  }
}

main()
