import type { CodegenAdvancedField, CodegenConfig, CodegenQueryOperator, CodegenTemplate } from "@/modules/infra/backend/services/codegen-engine.service"
import type { OnlineRuntimeRelease } from "./online-runtime.contract"

const systemFields = ["id", "creator", "create_time", "updater", "update_time", "deleted", "tenant_id"]
const queryOperators: Record<string, CodegenQueryOperator> = { EQ: "=", NE: "!=", LIKE: "LIKE", IN: "IN", GT: ">", GTE: ">=", LT: "<", LTE: "<=", BETWEEN: "BETWEEN" }
const scalar = {
  string: { type: "varchar", tsType: "string", uiComponent: "INPUT" as const }, text: { type: "text", tsType: "string", uiComponent: "TEXTAREA" as const },
  integer: { type: "integer", tsType: "number", uiComponent: "NUMBER" as const }, decimal: { type: "numeric", tsType: "number", uiComponent: "NUMBER" as const },
  boolean: { type: "boolean", tsType: "boolean", uiComponent: "SWITCH" as const }, date: { type: "date", tsType: "string", uiComponent: "DATE" as const }, datetime: { type: "timestamptz", tsType: "string", uiComponent: "DATETIME" as const }, json: { type: "jsonb", tsType: "unknown", uiComponent: "INPUT" as const },
} as const

function pascal(code: string): string { return code.split("_").map((part) => part.slice(0, 1).toUpperCase() + part.slice(1)).join("") }
function fieldsForRuntime(runtime: OnlineRuntimeRelease): CodegenAdvancedField[] {
  const interactions = new Map(runtime.interaction.fields.map((field) => [field.code, field]))
  const relationByField = new Map(runtime.model.relations.map((relation) => [relation.sourceField, relation]))
  for (const code of systemFields) if (!runtime.model.fields.some((field) => field.code === code && field.systemManaged)) throw new Error(`Published Release 缺少规范系统字段 ${code}`)
  return runtime.model.fields.map((field) => {
    const interaction = interactions.get(field.code)
    if (!interaction) throw new Error(`Published Release 字段 ${field.code} 缺少交互配置`)
    const mapped = scalar[field.type]
    return {
      name: field.code, ...mapped, comment: interaction.label || field.remark || field.code, nullable: field.nullable, defaultValue: typeof field.default === "string" ? field.default : undefined, defaultValueTyped: field.default,
      isPrimary: field.code === "id", isAutoIncrement: false, maxLength: interaction.validation.maxLength ?? field.length, listShow: interaction.visibility.list, formShow: interaction.visibility.form && !field.systemManaged, queryShow: interaction.query.enabled, queryType: interaction.query.operator ? queryOperators[interaction.query.operator] : "=", dictType: interaction.dictionaryCode ?? null, formValidation: field.nullable ? null : "required",
      widget: interaction.widget, readOnly: interaction.readOnly || Boolean(field.systemManaged), query: { enabled: interaction.query.enabled, operator: interaction.query.operator ? queryOperators[interaction.query.operator] : undefined, widget: interaction.query.widget, defaultValue: interaction.query.defaultValue, required: interaction.query.required }, validation: interaction.validation,
      dictionaryCode: interaction.dictionaryCode, relation: relationByField.get(field.code),
    }
  })
}
function templateFor(runtime: OnlineRuntimeRelease): CodegenTemplate { return runtime.modelType === "TREE" ? "TREE" : runtime.modelType === "MASTER_DETAIL" ? "MASTER_DETAIL" : "CRUD" }

/** Losslessly adapts immutable Online Release metadata into the shared Codegen IR. */
export function toOnlineCodegenConfig(runtime: OnlineRuntimeRelease, childRuntimes: OnlineRuntimeRelease[] = []): CodegenConfig {
  const fields = fieldsForRuntime(runtime)
  const childByReleaseId = new Map(childRuntimes.map((child) => [child.releaseId, child]))
  const masterDetail = runtime.interaction.masterDetail ? {
    children: runtime.interaction.masterDetail.children.map((child) => {
      if (!child.targetReleaseId) throw new Error(`Published Release 主子表子定义 ${child.code} 缺少不可变 targetReleaseId`)
      const target = childByReleaseId.get(child.targetReleaseId)
      if (!target || target.definitionCode !== child.targetDefinitionCode) throw new Error(`Published Release 主子表子定义 ${child.code} 的固定目标 Release 未水合或不匹配`)
      return { ...child, targetReleaseId: child.targetReleaseId, fields: fieldsForRuntime(target) }
    }),
  } : undefined
  return {
    moduleName: "online", businessName: runtime.definitionName, className: pascal(runtime.definitionCode), template: templateFor(runtime), scene: "ADMIN",
    table: { name: runtime.definitionCode, comment: runtime.definitionName, schema: runtime.model.storage.kind === "MANAGED_TABLE" ? "public" : "online", type: "TABLE", columns: fields, primaryKey: ["id"], indexes: runtime.model.indexes.map((index) => ({ name: index.code, columns: index.fields, unique: index.unique })) },
    advanced: { fields, model: { type: runtime.modelType, tree: runtime.interaction.tree, masterDetail }, actions: runtime.interaction.actions.map((action) => ({ code: action.code!, label: action.label!, type: action.type!, placement: action.placement!, order: action.order ?? 0, enabled: action.enabled ?? true })) },
    onlineRuntime: { definitionCode: runtime.definitionCode, storageKind: runtime.model.storage.kind, releaseId: runtime.releaseId, schemaRevision: runtime.schemaRevision },
    permissionPrefix: `online:${runtime.definitionCode.replace(/_/g, "-")}`, generateFrontend: true, generateTest: true,
  }
}
