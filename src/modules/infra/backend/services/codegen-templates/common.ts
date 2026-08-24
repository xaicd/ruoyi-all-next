// Common types and helpers for codegen templates

export interface ConfiguredColumn {
  name: string
  type: string
  tsType: string
  nullable: boolean
  comment: string
  isPk?: boolean
  isAutoIncrement?: boolean
  columnKey?: string
  extra?: string
  maxLength?: number
  precision?: number
  scale?: number
  enumValues?: string[]
  defaultValueTyped?: unknown
  formValidation?: "required" | "optional"
  widget?: string
  queryType?: string
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    ruleKeys?: string[]
  }
  query?: {
    required?: boolean
    operator?: string
    defaultValue?: unknown
  }
}

export interface CodegenMasterDetailChild {
  code: string
  tableName: string
  foreignKeyField: string
  fields: Array<ConfiguredColumn & { readOnly?: boolean; uiComponent?: string }>
}

export type CodegenTemplateType = "CRUD" | "TREE" | "MASTER_DETAIL"

export interface CodegenConfig {
  table: {
    name: string
    comment: string
    columns: ConfiguredColumn[]
  }
  moduleName: string
  businessName: string
  className: string
  parentMenuId?: string
  template?: CodegenTemplateType
  submodule?: string
  packagePath?: string
  author?: string
  permissionPrefix?: string
  advanced?: {
    model?: {
      tree?: {
        parentField: string
        nameField: string
      }
      masterDetail?: {
        children: CodegenMasterDetailChild[]
      }
    }
  }
  onlineRuntime?: {
    storageKind?: "MANAGED_TABLE" | "PHYSICAL_TABLE"
    domain?: string
    tableId?: string
  }
}

export interface CodegenOutput {
  path: string
  content: string
  type: "type" | "validator" | "repository" | "service" | "rpc" | "route" | "api" | "component" | "page" | "appPage" | "test" | "sql"
}

export function toPascal(str: string): string {
  return str.replace(/(?:^|[_\s-])(\w)/g, (_, c) => c.toUpperCase())
}

export function toCamel(str: string): string {
  const p = toPascal(str)
  return p.charAt(0).toLowerCase() + p.slice(1)
}

export function toKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_]/g, "-")
    .toLowerCase()
}

export function toConstant(str: string): string {
  return toKebab(str).replace(/-/g, "_").toUpperCase()
}

export function getBackendPath(config: CodegenConfig): string {
  const { moduleName, submodule } = config
  const sub = submodule ? `/${submodule}` : ""
  return `src/modules/${moduleName}${sub}/backend`
}

export function getFrontendPath(config: CodegenConfig): string {
  const { moduleName, submodule } = config
  const sub = submodule ? `/${submodule}` : ""
  return `src/modules/${moduleName}${sub}/frontend`
}

const MANAGED_COLUMNS = new Set([
  "id", "tenant_id", "created_by", "creator", "updated_by", "updater",
  "created_at", "create_time", "updated_at", "update_time", "deleted",
])

export function isManagedColumn(column: ConfiguredColumn): boolean {
  return MANAGED_COLUMNS.has(column.name.toLowerCase())
}

export function configuredColumns(config: CodegenConfig): ConfiguredColumn[] {
  return config.table.columns
}

export function formColumns(config: CodegenConfig): ConfiguredColumn[] {
  return config.table.columns.filter((c) => !isManagedColumn(c))
}

export function queryColumns(config: CodegenConfig): ConfiguredColumn[] {
  return config.table.columns.filter((c) => !isManagedColumn(c) && c.queryType && c.queryType !== "NONE")
}

export function hasTableColumn(config: CodegenConfig, name: string): boolean {
  return config.table.columns.some((c) => c.name.toLowerCase() === name.toLowerCase())
}

export function persistOrderColumn(config: CodegenConfig): string {
  const columns = config.table.columns.map((c) => c.name.toLowerCase())
  if (columns.includes("sort")) return "sort"
  if (columns.includes("create_time")) return "create_time"
  if (columns.includes("created_at")) return "created_at"
  return "id"
}
