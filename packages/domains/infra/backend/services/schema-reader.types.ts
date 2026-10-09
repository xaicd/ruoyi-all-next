/**
 * Schema Reader Types, Mapping & Fallbacks
 */

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

export const PG_TYPE_MAP: Record<string, { tsType: string; uiComponent: UiComponentType }> = {
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

export const MYSQL_TYPE_MAP: Record<string, { tsType: string; uiComponent: UiComponentType }> = {
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

export function inferUiComponent(column: { name: string; type: string; maxLength?: number; enumValues?: string[] }): UiComponentType {
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

export function mapColumnType(dbType: string, dialect: DbDialect): string {
  const map = dialect === "mysql" ? MYSQL_TYPE_MAP : PG_TYPE_MAP
  const baseType = dbType.replace(/\(.*\)/, "").toLowerCase().trim()
  return map[baseType]?.tsType ?? "string"
}

export const MOCK_TABLES: TableInfo[] = [
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
