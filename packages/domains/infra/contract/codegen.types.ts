import type { ColumnInfo, TableInfo } from "../backend/services/schema-reader.service"

export type CodegenScene = "ADMIN" | "APP" | "MINIPROGRAM"

export type CodegenTemplate =
  | "CRUD"
  | "TREE"
  | "MASTER_CHILD"
  | "MASTER_DETAIL"
  | "WORKFLOW"
  | "SINGLETON"

export type CodegenQueryOperator = "=" | "!=" | "LIKE" | "IN" | ">" | ">=" | "<" | "<=" | "BETWEEN"
export type CodegenWidget = "TEXT" | "TEXTAREA" | "NUMBER" | "SWITCH" | "DATE" | "DATETIME" | "SELECT" | "DICTIONARY" | "REFERENCE" | "JSON"
export type CodegenValidationRule = "EMAIL" | "MOBILE" | "IDENTIFIER"
export type CodegenActionType = "CREATE" | "UPDATE" | "DELETE" | "EXPORT" | "IMPORT" | "SUBMIT_WORKFLOW"
export type CodegenAdvancedField = ColumnInfo & {
  listShow?: boolean
  formShow?: boolean
  queryShow?: boolean
  queryType?: CodegenQueryOperator
  dictType?: string | null
  formValidation?: string | null
  widget?: CodegenWidget
  readOnly?: boolean
  defaultValueTyped?: string | number | boolean | null
  query?: {
    enabled: boolean
    operator?: CodegenQueryOperator
    widget?: CodegenWidget
    defaultValue?: string | number | boolean | null | Array<string | number | boolean | null>
    required?: boolean
  }
  validation?: { ruleKeys?: CodegenValidationRule[]; minLength?: number; maxLength?: number; min?: number; max?: number }
  dictionaryCode?: string
  relation?: { code: string; targetDefinitionCode: string; targetReleaseId?: string; targetField: string; onDelete: "RESTRICT" | "SET_NULL" }
}
export type CodegenMasterDetailChild = {
  code: string
  targetDefinitionCode: string
  targetReleaseId: string
  foreignKeyField: string
  display: "TABLE" | "TABS"
  fields: CodegenAdvancedField[]
}
export type CodegenAdvancedConfig = {
  fields: CodegenAdvancedField[]
  model?: {
    type: "SINGLE" | "TREE" | "MASTER_DETAIL"
    tree?: { parentField: string; sortField?: string; rootValue?: string | number | null }
    masterDetail?: { children: CodegenMasterDetailChild[] }
  }
  actions?: Array<{ code: string; label: string; type: CodegenActionType; placement: "TOOLBAR" | "ROW" | "FORM_FOOTER"; order: number; enabled: boolean }>
}

export type CodegenConfig = {
  moduleName: string
  subModule?: string
  businessName: string
  className: string
  template: CodegenTemplate
  scene: CodegenScene
  table: TableInfo
  author?: string
  generateFrontend: boolean
  generateTest: boolean
  parentMenuId?: string
  permissionPrefix?: string
  advanced?: CodegenAdvancedConfig
  onlineRuntime?: { definitionCode: string; storageKind: "GENERIC_RECORD" | "MANAGED_TABLE"; releaseId: string; schemaRevision: number }
  masterChild?: {
    childTable: TableInfo
    childForeignKey: string
  }
}
