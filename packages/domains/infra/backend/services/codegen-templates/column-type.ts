/**
 * 低代码列类型 → PostgreSQL 类型。
 *
 * **单一真源**：codegen 的建表迁移模板与 `scripts/generate-table-migration.ts`
 * 都用这份映射。此前只有脚本里有；若 codegen 侧另写一份，两边迟早漂移
 * —— 而类型映射漂移的后果是建出来的表与代码期望不一致（静默、且只在真实库暴露）。
 *
 * `precision`/`scale`/`maxLength` 若在元数据里声明了就**照用**，不能一律给默认值:
 * 例如 10 亿量级的计数字段落到 INTEGER 会**溢出**，必须 BIGINT。
 */
export function pgType(column: {
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

/** 字面量默认值 -> SQL 片段（字符串加引号；null 显式写出）。 */
export function defaultFromLiteral(value: unknown): string | null {
  if (value === undefined) return null
  if (value === null) return "NULL"
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  return `'${String(value).replace(/'/g, "''")}'`
}

/** 单列 DDL 片段。 */
export function columnLine(column: {
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
  const sqlDefault = column.defaultSql ?? defaultFromLiteral(column.defaultValueTyped)
  if (sqlDefault !== null) parts.push(`DEFAULT ${sqlDefault}`)
  return parts.join(" ")
}

/** 单表 CREATE TABLE 语句（含主键与 tenant_id 索引）。 */
export function tableDdl(table: {
  name: string
  comment?: string
  columns: Array<{
    name: string
    type: string
    nullable: boolean
    isPk?: boolean
    defaultValueTyped?: unknown
    defaultSql?: string
    maxLength?: number
    precision?: number
    scale?: number
  }>
}): string {
  const columns = table.columns ?? []
  const pk = columns.filter((column) => column.isPk).map((column) => column.name)
  const lines = columns.map(columnLine)
  if (pk.length > 0) {
    lines.push(`    CONSTRAINT "${table.name}_pkey" PRIMARY KEY (${pk.map((name) => `"${name}"`).join(", ")})`)
  }
  const statements = [`CREATE TABLE "${table.name}" (\n${lines.join(",\n")}\n);`]
  // 多租户过滤（AGENTS §4.8）几乎总是按 tenant_id 走，补索引。
  if (columns.some((column) => column.name === "tenant_id")) {
    statements.push(`CREATE INDEX "${table.name}_tenant_id_idx" ON "${table.name}"("tenant_id");`)
  }
  return `-- ${table.comment ?? table.name}\n${statements.join("\n")}`
}
