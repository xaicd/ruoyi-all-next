/**
 * Schema Reader - 数据库表结构读取器
 *
 * 三种数据源模式：
 * 1. Prisma Schema 文件解析（离线模式，不需要数据库连接）
 * 2. Kysely Introspection（在线模式，从真实数据库读取）
 * 3. Mock 数据（开发/演示模式）
 *
 * 用途：代码生成器的数据源
 */

import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { hasRealDatabase, getKyselyDb, getDataSourceConfig } from "@/modules/shared/backend/lib/database"
import * as fs from "fs"
import * as path from "path"

// ============ Types ============

export type DbDialect = "postgresql" | "mysql"

export type TableInfo = {
  name: string
  comment?: string
  schema: string
  type: "TABLE" | "VIEW"
  columns: ColumnInfo[]
  primaryKey: string[]
  indexes: IndexInfo[]
}

export type ColumnInfo = {
  name: string
  type: string
  tsType: string
  comment?: string
  nullable: boolean
  defaultValue?: string
  isPrimary: boolean
  isAutoIncrement: boolean
  maxLength?: number
  enumValues?: string[]
  uiComponent: UiComponentType
}

export type UiComponentType =
  | "INPUT" | "TEXTAREA" | "NUMBER" | "SELECT" | "RADIO"
  | "CHECKBOX" | "SWITCH" | "DATE" | "DATETIME"
  | "UPLOAD" | "RICH_TEXT" | "TREE_SELECT" | "HIDDEN"

export type IndexInfo = {
  name: string
  columns: string[]
  unique: boolean
}

// ============ Type Mapping ============

const PG_TYPE_MAP: Record<string, { tsType: string; uiComponent: UiComponentType }> = {
  varchar: { tsType: "string", uiComponent: "INPUT" },
  text: { tsType: "string", uiComponent: "TEXTAREA" },
  char: { tsType: "string", uiComponent: "INPUT" },
  integer: { tsType: "number", uiComponent: "NUMBER" },
  int4: { tsType: "number", uiComponent: "NUMBER" },
  int8: { tsType: "number", uiComponent: "NUMBER" },
  int2: { tsType: "number", uiComponent: "NUMBER" },
  float4: { tsType: "number", uiComponent: "NUMBER" },
  float8: { tsType: "number", uiComponent: "NUMBER" },
  numeric: { tsType: "number", uiComponent: "NUMBER" },
  decimal: { tsType: "number", uiComponent: "NUMBER" },
  bool: { tsType: "boolean", uiComponent: "SWITCH" },
  boolean: { tsType: "boolean", uiComponent: "SWITCH" },
  date: { tsType: "string", uiComponent: "DATE" },
  timestamp: { tsType: "string", uiComponent: "DATETIME" },
  timestamptz: { tsType: "string", uiComponent: "DATETIME" },
  json: { tsType: "Record<string, unknown>", uiComponent: "TEXTAREA" },
  jsonb: { tsType: "Record<string, unknown>", uiComponent: "TEXTAREA" },
  uuid: { tsType: "string", uiComponent: "HIDDEN" },
}

const MYSQL_TYPE_MAP: Record<string, { tsType: string; uiComponent: UiComponentType }> = {
  varchar: { tsType: "string", uiComponent: "INPUT" },
  text: { tsType: "string", uiComponent: "TEXTAREA" },
  longtext: { tsType: "string", uiComponent: "RICH_TEXT" },
  char: { tsType: "string", uiComponent: "INPUT" },
  int: { tsType: "number", uiComponent: "NUMBER" },
  bigint: { tsType: "number", uiComponent: "NUMBER" },
  smallint: { tsType: "number", uiComponent: "NUMBER" },
  tinyint: { tsType: "number", uiComponent: "NUMBER" },
  float: { tsType: "number", uiComponent: "NUMBER" },
  double: { tsType: "number", uiComponent: "NUMBER" },
  decimal: { tsType: "number", uiComponent: "NUMBER" },
  bit: { tsType: "boolean", uiComponent: "SWITCH" },
  date: { tsType: "string", uiComponent: "DATE" },
  datetime: { tsType: "string", uiComponent: "DATETIME" },
  timestamp: { tsType: "string", uiComponent: "DATETIME" },
  json: { tsType: "Record<string, unknown>", uiComponent: "TEXTAREA" },
}

function inferUiComponent(column: { name: string; type: string; maxLength?: number; enumValues?: string[] }): UiComponentType {
  if (column.enumValues && column.enumValues.length > 0) {
    return column.enumValues.length <= 5 ? "RADIO" : "SELECT"
  }
  const n = column.name.toLowerCase()
  if (n.includes("status") || n.includes("type") || n.includes("level")) return "SELECT"
  if (n.includes("content") || n.includes("description") || n.includes("remark")) return "TEXTAREA"
  if (n.includes("avatar") || n.includes("image") || n.includes("file") || n.includes("url")) return "UPLOAD"
  if (n.includes("parent_id") || n.includes("dept_id")) return "TREE_SELECT"
  if (n === "created_at" || n === "updated_at" || n === "deleted_at") return "HIDDEN"
  if (n === "deleted") return "HIDDEN"
  if (n === "id") return "HIDDEN"
  return PG_TYPE_MAP[column.type]?.uiComponent ?? MYSQL_TYPE_MAP[column.type]?.uiComponent ?? "INPUT"
}

function mapColumnType(dbType: string, dialect: DbDialect): string {
  const map = dialect === "mysql" ? MYSQL_TYPE_MAP : PG_TYPE_MAP
  const baseType = dbType.replace(/\(.*\)/, "").toLowerCase().trim()
  return map[baseType]?.tsType ?? "string"
}

// ============ Prisma Schema 文件解析器 ============

function parsePrismaSchema(): TableInfo[] {
  const schemaPath = path.resolve(process.cwd(), "prisma/schema.prisma")
  if (!fs.existsSync(schemaPath)) return []

  const content = fs.readFileSync(schemaPath, "utf-8")
  const tables: TableInfo[] = []

  // 匹配 model 块
  const modelRegex = /\/\/\/\s*(.+?)\n\s*model\s+(\w+)\s*\{([^}]+)\}/g
  let match

  while ((match = modelRegex.exec(content)) !== null) {
    const comment = match[1].trim()
    const modelName = match[2]
    const body = match[3]

    // 提取 @@map 得到真实表名
    const mapMatch = body.match(/@@map\("([^"]+)"\)/)
    const tableName = mapMatch ? mapMatch[1] : toSnakeCase(modelName)

    const columns: ColumnInfo[] = []
    const primaryKey: string[] = []

    // 解析字段
    const lines = body.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("//") && !l.startsWith("@@"))

    for (const line of lines) {
      // 跳过关系字段和注解
      if (line.includes("@relation") || line.startsWith("@@")) continue

      // 字段格式: fieldName Type? @xxx
      const fieldMatch = line.match(/^(\w+)\s+(\w+)(\?)?(.*)$/)
      if (!fieldMatch) continue

      const [, fieldName, fieldType, isOptional, attrs] = fieldMatch

      // 跳过关系类型（首字母大写且非基础类型）
      const baseTypes = ["String", "Int", "Float", "Boolean", "DateTime", "BigInt", "Decimal", "Json", "Bytes"]
      if (!baseTypes.includes(fieldType) && fieldType[0] === fieldType[0].toUpperCase()) continue

      const nullable = Boolean(isOptional)
      const isPrimary = attrs.includes("@id")
      const isAutoIncrement = attrs.includes("@default(autoincrement()") || attrs.includes("@default(cuid()") || attrs.includes("@default(uuid()")

      // 提取 @map 得到数据库列名
      const colMapMatch = attrs.match(/@map\("([^"]+)"\)/)
      const colName = colMapMatch ? colMapMatch[1] : toSnakeCase(fieldName)

      // 提取 @db.VarChar(n)
      const dbTypeMatch = attrs.match(/@db\.(\w+)\((\d+)\)/)
      const maxLength = dbTypeMatch ? Number(dbTypeMatch[2]) : undefined
      const dbType = dbTypeMatch ? dbTypeMatch[1].toLowerCase() : prismaTypeToDbType(fieldType)

      // 提取 @default
      const defaultMatch = attrs.match(/@default\(([^)]+)\)/)
      const defaultValue = defaultMatch ? defaultMatch[1].replace(/"/g, "") : undefined

      if (isPrimary) primaryKey.push(colName)

      const tsType = prismaTypeToTsType(fieldType)
      const col: ColumnInfo = {
        name: colName,
        type: dbType,
        tsType,
        comment: undefined, // Prisma schema 没有字段级注释
        nullable,
        defaultValue,
        isPrimary,
        isAutoIncrement,
        maxLength,
        uiComponent: "INPUT",
      }
      col.uiComponent = inferUiComponent(col)
      columns.push(col)
    }

    tables.push({
      name: tableName,
      comment,
      schema: "public",
      type: "TABLE",
      columns,
      primaryKey,
      indexes: [],
    })
  }

  return tables
}

function prismaTypeToTsType(prismaType: string): string {
  const map: Record<string, string> = {
    String: "string",
    Int: "number",
    Float: "number",
    Boolean: "boolean",
    DateTime: "string",
    BigInt: "number",
    Decimal: "number",
    Json: "Record<string, unknown>",
    Bytes: "string",
  }
  return map[prismaType] ?? "string"
}

function prismaTypeToDbType(prismaType: string): string {
  const map: Record<string, string> = {
    String: "varchar",
    Int: "integer",
    Float: "float8",
    Boolean: "boolean",
    DateTime: "timestamptz",
    BigInt: "int8",
    Decimal: "numeric",
    Json: "jsonb",
    Bytes: "bytea",
  }
  return map[prismaType] ?? "varchar"
}

function toSnakeCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()
}

// ============ Kysely Introspection（真实数据库） ============

async function introspectFromDatabase(): Promise<TableInfo[]> {
  const db = await getKyselyDb()
  const config = getDataSourceConfig()
  const dialect: DbDialect = config.protocolFamily === "mysql" ? "mysql" : "postgresql"

  if (dialect === "postgresql") {
    return introspectPostgres(db)
  }
  return introspectMysql(db)
}

async function introspectPostgres(db: any): Promise<TableInfo[]> {
  // 查询 information_schema 获取表和列信息
  const tablesResult = await db.selectFrom("information_schema.tables" as any)
    .select(["table_name", "table_type"])
    .where("table_schema", "=", "public")
    .where("table_type", "in", ["BASE TABLE", "VIEW"])
    .execute()

  const tables: TableInfo[] = []

  for (const tableRow of tablesResult) {
    const columnsResult = await db.selectFrom("information_schema.columns" as any)
      .select(["column_name", "data_type", "is_nullable", "column_default", "character_maximum_length"])
      .where("table_schema", "=", "public")
      .where("table_name", "=", tableRow.table_name)
      .orderBy("ordinal_position", "asc")
      .execute()

    const columns: ColumnInfo[] = columnsResult.map((col: any) => {
      const c: ColumnInfo = {
        name: col.column_name,
        type: col.data_type,
        tsType: mapColumnType(col.data_type, "postgresql"),
        nullable: col.is_nullable === "YES",
        defaultValue: col.column_default ?? undefined,
        isPrimary: false, // 需要额外查询
        isAutoIncrement: (col.column_default ?? "").includes("nextval"),
        maxLength: col.character_maximum_length ?? undefined,
        uiComponent: "INPUT",
      }
      c.uiComponent = inferUiComponent(c)
      return c
    })

    tables.push({
      name: tableRow.table_name,
      schema: "public",
      type: tableRow.table_type === "VIEW" ? "VIEW" : "TABLE",
      columns,
      primaryKey: [],
      indexes: [],
    })
  }

  return tables
}

async function introspectMysql(db: any): Promise<TableInfo[]> {
  const tablesResult = await db.selectFrom("information_schema.tables" as any)
    .select(["table_name", "table_type", "table_comment"])
    .where("table_schema", "=", db.raw("DATABASE()"))
    .execute()

  const tables: TableInfo[] = []

  for (const tableRow of tablesResult) {
    const columnsResult = await db.selectFrom("information_schema.columns" as any)
      .select(["column_name", "data_type", "is_nullable", "column_default", "character_maximum_length", "column_comment", "extra"])
      .where("table_schema", "=", db.raw("DATABASE()"))
      .where("table_name", "=", tableRow.table_name)
      .orderBy("ordinal_position", "asc")
      .execute()

    const columns: ColumnInfo[] = columnsResult.map((col: any) => {
      const c: ColumnInfo = {
        name: col.column_name,
        type: col.data_type,
        tsType: mapColumnType(col.data_type, "mysql"),
        comment: col.column_comment || undefined,
        nullable: col.is_nullable === "YES",
        defaultValue: col.column_default ?? undefined,
        isPrimary: false,
        isAutoIncrement: (col.extra ?? "").includes("auto_increment"),
        maxLength: col.character_maximum_length ?? undefined,
        uiComponent: "INPUT",
      }
      c.uiComponent = inferUiComponent(c)
      return c
    })

    tables.push({
      name: tableRow.table_name,
      comment: tableRow.table_comment || undefined,
      schema: "public",
      type: tableRow.table_type === "VIEW" ? "VIEW" : "TABLE",
      columns,
      primaryKey: [],
      indexes: [],
    })
  }

  return tables
}

// ============ Service ============

export class SchemaReaderService {
  /**
   * 获取所有表信息
   * 优先级：真实数据库 > Prisma Schema 文件 > Mock
   */
  static async listTables(schema = "public"): Promise<TableInfo[]> {
    domainLog.event("infra.schema.listTables", { schema })

    // 1. 有真实数据库连接时，从 DB introspect
    if (hasRealDatabase()) {
      try {
        return await introspectFromDatabase()
      } catch (e) {
        domainLog.event("infra.schema.introspectFailed", { error: String(e) })
      }
    }

    // 2. 解析 Prisma Schema 文件
    const prismaResult = parsePrismaSchema()
    if (prismaResult.length > 0) {
      return prismaResult
    }

    // 3. Fallback: Mock 数据
    return MOCK_TABLES
  }

  /**
   * 获取单表详细信息
   */
  static async getTable(tableName: string, schema = "public"): Promise<TableInfo | null> {
    domainLog.event("infra.schema.getTable", { tableName, schema })
    const tables = await SchemaReaderService.listTables(schema)
    return tables.find((t) => t.name === tableName) ?? null
  }

  /**
   * 根据表结构推断前端组件配置
   */
  static inferFormConfig(table: TableInfo): { field: string; label: string; component: UiComponentType; required: boolean }[] {
    return table.columns
      .filter((c) => c.uiComponent !== "HIDDEN")
      .map((c) => ({
        field: c.name,
        label: c.comment || c.name,
        component: c.uiComponent,
        required: !c.nullable,
      }))
  }

  /**
   * 获取当前数据源模式说明
   */
  static getSourceMode(): { mode: string; description: string } {
    if (hasRealDatabase()) {
      const config = getDataSourceConfig()
      return { mode: "database", description: `从 ${config.driver} 数据库实时读取` }
    }
    const prismaPath = path.resolve(process.cwd(), "prisma/schema.prisma")
    if (fs.existsSync(prismaPath)) {
      return { mode: "prisma-schema", description: "从 prisma/schema.prisma 文件解析" }
    }
    return { mode: "mock", description: "演示数据（内存模式）" }
  }
}

// ============ Mock Data（最小 fallback） ============

const MOCK_TABLES: TableInfo[] = [
  {
    name: "system_user",
    comment: "系统用户",
    schema: "public",
    type: "TABLE",
    primaryKey: ["id"],
    indexes: [{ name: "idx_user_username", columns: ["username"], unique: true }],
    columns: [
      { name: "id", type: "varchar", tsType: "string", nullable: false, isPrimary: true, isAutoIncrement: false, uiComponent: "HIDDEN" },
      { name: "username", type: "varchar", tsType: "string", comment: "用户名", nullable: false, isPrimary: false, isAutoIncrement: false, maxLength: 30, uiComponent: "INPUT" },
      { name: "nickname", type: "varchar", tsType: "string", comment: "昵称", nullable: false, isPrimary: false, isAutoIncrement: false, maxLength: 30, uiComponent: "INPUT" },
      { name: "password", type: "varchar", tsType: "string", comment: "密码", nullable: false, isPrimary: false, isAutoIncrement: false, maxLength: 100, uiComponent: "HIDDEN" },
      { name: "phone", type: "varchar", tsType: "string", comment: "手机号", nullable: true, isPrimary: false, isAutoIncrement: false, maxLength: 20, uiComponent: "INPUT" },
      { name: "email", type: "varchar", tsType: "string", comment: "邮箱", nullable: true, isPrimary: false, isAutoIncrement: false, maxLength: 50, uiComponent: "INPUT" },
      { name: "status", type: "varchar", tsType: "string", comment: "状态", nullable: false, isPrimary: false, isAutoIncrement: false, maxLength: 10, enumValues: ["ACTIVE", "DISABLED"], uiComponent: "SELECT" },
      { name: "dept_id", type: "varchar", tsType: "string", comment: "部门", nullable: true, isPrimary: false, isAutoIncrement: false, uiComponent: "TREE_SELECT" },
      { name: "remark", type: "varchar", tsType: "string", comment: "备注", nullable: true, isPrimary: false, isAutoIncrement: false, maxLength: 500, uiComponent: "TEXTAREA" },
      { name: "created_at", type: "timestamptz", tsType: "string", comment: "创建时间", nullable: false, isPrimary: false, isAutoIncrement: false, uiComponent: "HIDDEN" },
      { name: "updated_at", type: "timestamptz", tsType: "string", comment: "更新时间", nullable: false, isPrimary: false, isAutoIncrement: false, uiComponent: "HIDDEN" },
    ],
  },
]
