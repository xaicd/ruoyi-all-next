/**
 * Schema Reader - 数据库表结构读取器
 *
 * 能力：
 * - 读取数据库所有表/视图
 * - 读取表字段信息（名称/类型/注释/约束）
 * - 自动推断字段对应的前端组件类型
 * - 支持多数据库方言（PostgreSQL / MySQL）
 *
 * 用途：代码生成器的数据源
 */

import { domainLog } from "@/modules/shared/backend/lib/domain-log"

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
  /** 推断的前端组件类型 */
  uiComponent: UiComponentType
}

export type UiComponentType =
  | "INPUT"         // 普通文本
  | "TEXTAREA"     // 多行文本
  | "NUMBER"       // 数字
  | "SELECT"       // 下拉选择
  | "RADIO"        // 单选
  | "CHECKBOX"     // 多选
  | "SWITCH"       // 开关
  | "DATE"         // 日期
  | "DATETIME"     // 日期时间
  | "UPLOAD"       // 文件上传
  | "RICH_TEXT"    // 富文本
  | "TREE_SELECT"  // 树选择
  | "HIDDEN"       // 隐藏字段

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
  int4: { tsType: "number", uiComponent: "NUMBER" },
  int8: { tsType: "number", uiComponent: "NUMBER" },
  int2: { tsType: "number", uiComponent: "NUMBER" },
  float4: { tsType: "number", uiComponent: "NUMBER" },
  float8: { tsType: "number", uiComponent: "NUMBER" },
  numeric: { tsType: "number", uiComponent: "NUMBER" },
  bool: { tsType: "boolean", uiComponent: "SWITCH" },
  boolean: { tsType: "boolean", uiComponent: "SWITCH" },
  date: { tsType: "string", uiComponent: "DATE" },
  timestamp: { tsType: "string", uiComponent: "DATETIME" },
  timestamptz: { tsType: "string", uiComponent: "DATETIME" },
  json: { tsType: "Record<string, unknown>", uiComponent: "TEXTAREA" },
  jsonb: { tsType: "Record<string, unknown>", uiComponent: "TEXTAREA" },
  uuid: { tsType: "string", uiComponent: "HIDDEN" },
}

function inferUiComponent(column: { name: string; type: string; maxLength?: number; enumValues?: string[] }): UiComponentType {
  // 枚举字段
  if (column.enumValues && column.enumValues.length > 0) {
    return column.enumValues.length <= 5 ? "RADIO" : "SELECT"
  }
  // 按名称推断
  const nameLower = column.name.toLowerCase()
  if (nameLower.includes("status") || nameLower.includes("type") || nameLower.includes("level")) return "SELECT"
  if (nameLower.includes("content") || nameLower.includes("description") || nameLower.includes("remark")) return "TEXTAREA"
  if (nameLower.includes("avatar") || nameLower.includes("image") || nameLower.includes("file")) return "UPLOAD"
  if (nameLower.includes("parent_id") || nameLower.includes("dept_id")) return "TREE_SELECT"
  if (nameLower.includes("created_at") || nameLower.includes("updated_at")) return "DATETIME"
  if (nameLower === "id") return "HIDDEN"
  // 按类型推断
  const mapping = PG_TYPE_MAP[column.type]
  if (mapping) return mapping.uiComponent
  return "INPUT"
}

// ============ Service ============

export class SchemaReaderService {
  /**
   * 获取所有表信息（Mock 实现）
   * 阶段B：接入真实 Prisma introspection
   */
  static async listTables(schema = "public"): Promise<TableInfo[]> {
    domainLog.event("infra.schema.listTables", { schema })

    // Mock: 返回示例表结构
    return MOCK_TABLES
  }

  /**
   * 获取单表详细信息
   */
  static async getTable(tableName: string, schema = "public"): Promise<TableInfo | null> {
    domainLog.event("infra.schema.getTable", { tableName, schema })
    return MOCK_TABLES.find((t) => t.name === tableName) || null
  }

  /**
   * 根据表结构推断前端组件配置
   */
  static inferFormConfig(table: TableInfo): { field: string; label: string; component: UiComponentType; required: boolean }[] {
    return table.columns
      .filter((c) => !c.isPrimary && !c.isAutoIncrement && c.name !== "created_at" && c.name !== "updated_at" && c.name !== "deleted")
      .map((c) => ({
        field: c.name,
        label: c.comment || c.name,
        component: c.uiComponent,
        required: !c.nullable,
      }))
  }
}

// ============ Mock Data ============

const MOCK_TABLES: TableInfo[] = [
  {
    name: "system_user",
    comment: "系统用户",
    schema: "public",
    type: "TABLE",
    primaryKey: ["id"],
    indexes: [{ name: "idx_user_username", columns: ["username"], unique: true }],
    columns: [
      { name: "id", type: "uuid", tsType: "string", nullable: false, isPrimary: true, isAutoIncrement: false, uiComponent: "HIDDEN" },
      { name: "username", type: "varchar", tsType: "string", comment: "用户名", nullable: false, isPrimary: false, isAutoIncrement: false, maxLength: 50, uiComponent: "INPUT" },
      { name: "nickname", type: "varchar", tsType: "string", comment: "昵称", nullable: false, isPrimary: false, isAutoIncrement: false, maxLength: 50, uiComponent: "INPUT" },
      { name: "email", type: "varchar", tsType: "string", comment: "邮箱", nullable: true, isPrimary: false, isAutoIncrement: false, uiComponent: "INPUT" },
      { name: "mobile", type: "varchar", tsType: "string", comment: "手机号", nullable: true, isPrimary: false, isAutoIncrement: false, uiComponent: "INPUT" },
      { name: "sex", type: "int2", tsType: "number", comment: "性别", nullable: false, isPrimary: false, isAutoIncrement: false, enumValues: ["1", "2"], uiComponent: "RADIO" },
      { name: "avatar", type: "varchar", tsType: "string", comment: "头像", nullable: true, isPrimary: false, isAutoIncrement: false, uiComponent: "UPLOAD" },
      { name: "status", type: "varchar", tsType: "string", comment: "状态", nullable: false, isPrimary: false, isAutoIncrement: false, enumValues: ["ACTIVE", "DISABLED"], uiComponent: "SELECT" },
      { name: "dept_id", type: "uuid", tsType: "string", comment: "部门", nullable: true, isPrimary: false, isAutoIncrement: false, uiComponent: "TREE_SELECT" },
      { name: "remark", type: "text", tsType: "string", comment: "备注", nullable: true, isPrimary: false, isAutoIncrement: false, uiComponent: "TEXTAREA" },
      { name: "created_at", type: "timestamptz", tsType: "string", comment: "创建时间", nullable: false, isPrimary: false, isAutoIncrement: false, uiComponent: "DATETIME" },
    ],
  },
]
