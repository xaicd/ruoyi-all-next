/**
 * Codegen Engine - 审阅式 CRUD 代码生成器
 *
 * 从已导入的表结构生成 modules-first CRUD 文件，供预览与 ZIP 下载使用。
 * 当前统一支持 Online 高级字段、查询与动作元数据；TREE、MASTER_DETAIL
 * 使用专用共享分支生成。生成器不会直接写入项目，也不会修改权限或菜单目录。
 */

import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import type { ColumnInfo, TableInfo } from "./schema-reader.service"
import type {
  CodegenActionType,
  CodegenAdvancedField,
  CodegenConfig,
  CodegenQueryOperator,
  CodegenTemplate,
  CodegenWidget,
} from "../../contract/codegen.types"

export type {
  CodegenActionType,
  CodegenAdvancedConfig,
  CodegenAdvancedField,
  CodegenConfig,
  CodegenMasterDetailChild,
  CodegenQueryOperator,
  CodegenScene,
  CodegenTemplate,
  CodegenValidationRule,
  CodegenWidget,
} from "../../contract/codegen.types"

// ============ Types ============

export type CodegenOutput = {
  /** 文件路径（相对项目根） */
  path: string
  /** 文件内容 */
  content: string
  /** 文件类型 */
  type: "service" | "validator" | "route" | "page" | "component" | "test" | "type" | "repository" | "api" | "permission" | "manifest"
}

type ConfiguredColumn = CodegenAdvancedField & {
  listShow?: boolean
  formShow?: boolean
  queryShow?: boolean
  queryType?: CodegenQueryOperator
  dictType?: string | null
  formValidation?: string | null
}

const IDENTIFIER = /^[a-z][a-z0-9_]{0,63}$/
const CLASS_NAME = /^[A-Z][A-Za-z0-9]{0,63}$/

function configuredColumns(config: CodegenConfig): ConfiguredColumn[] {
  return (config.advanced?.fields ?? config.table.columns) as ConfiguredColumn[]
}

function isManagedColumn(column: ColumnInfo): boolean {
  return column.isPrimary || column.isAutoIncrement || ["created_at", "updated_at", "create_time", "update_time", "deleted", "creator", "updater", "tenant_id"].includes(column.name)
}

function listColumns(config: CodegenConfig): ConfiguredColumn[] {
  return configuredColumns(config)
    .filter((column) => column.listShow !== false && column.uiComponent !== "HIDDEN" && column.name !== "deleted")
    .filter((column) => !/(password|secret|api[_-]?key|token)/i.test(column.name))
    .slice(0, 12)
}

function formColumns(config: CodegenConfig): ConfiguredColumn[] {
  return configuredColumns(config).filter((column) => column.formShow !== false && column.readOnly !== true && column.uiComponent !== "HIDDEN" && !isManagedColumn(column))
}

function readonlyFormColumns(config: CodegenConfig): ConfiguredColumn[] {
  return configuredColumns(config).filter((column) => column.formShow !== false && column.readOnly === true && column.uiComponent !== "HIDDEN" && !isManagedColumn(column))
}

function queryColumns(config: CodegenConfig): ConfiguredColumn[] {
  return configuredColumns(config).filter((column) => (column.query?.enabled ?? column.queryShow === true) && column.uiComponent !== "HIDDEN" && !isManagedColumn(column)).slice(0, 8)
}

function getPermissionPrefix(config: CodegenConfig): string {
  return config.permissionPrefix ?? `${config.moduleName}:${toKebab(config.className)}`
}

function enabledActions(config: CodegenConfig, type: CodegenActionType): boolean {
  return config.advanced?.actions?.some((action) => action.enabled && action.type === type) ?? false
}

function actionEnabled(config: CodegenConfig, type: CodegenActionType): boolean {
  if (!config.advanced?.actions) return type === "CREATE" || type === "UPDATE" || type === "DELETE"
  return config.advanced.actions.some((action) => action.enabled && action.type === type)
}

function actionEnabledAt(config: CodegenConfig, type: CodegenActionType, placement: "TOOLBAR" | "ROW" | "FORM_FOOTER"): boolean {
  return config.advanced?.actions?.some((action) => action.enabled && action.type === type && action.placement === placement) ?? false
}

function queryDefaultValues(config: CodegenConfig): Record<string, unknown> {
  return Object.fromEntries(queryColumns(config).flatMap((column) => column.query?.defaultValue === undefined ? [] : [[column.name, column.query.defaultValue]]))
}

function validateConfig(config: CodegenConfig): void {
  if (!IDENTIFIER.test(config.moduleName)) throw new Error("moduleName 必须为小写字母开头的模块标识")
  if (config.subModule && !IDENTIFIER.test(config.subModule)) throw new Error("subModule 必须为小写字母开头的模块标识")
  if (!CLASS_NAME.test(config.className)) throw new Error("className 必须为 PascalCase 标识")
  if (!config.businessName.trim() || config.businessName.length > 100) throw new Error("businessName 必须为 1–100 个字符")
  if (!config.table.name || !IDENTIFIER.test(config.table.name)) throw new Error("table.name 必须为小写字母开头的表标识")
  if (!config.table.columns.length) throw new Error("至少需要一个表字段；请先导入表或提供完整 table 配置")
  if (new Set(config.table.columns.map((column) => column.name)).size !== config.table.columns.length) throw new Error("表字段名称不可重复")
  if (config.table.columns.some((column) => !IDENTIFIER.test(column.name))) throw new Error("表字段名称必须为小写字母、数字或下划线")
  if (!/^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/.test(getPermissionPrefix(config))) throw new Error("permissionPrefix 必须是 resource:action-prefix 格式")
  if (!["CRUD", "TREE", "MASTER_CHILD", "MASTER_DETAIL"].includes(config.template)) throw new Error(`当前 ${config.template} 模板尚未实现专用安全生成器`)
  if (config.template === "TREE") {
    const tree = config.advanced?.model?.tree
    if (!tree?.parentField) throw new Error("TREE 模板必须声明 parentField")
    const fields = configuredColumns(config)
    const parent = fields.find((field) => field.name === tree.parentField)
    if (!parent || parent.readOnly || parent.formShow === false || isManagedColumn(parent)) throw new Error("TREE parentField 必须是可编辑的非系统字段")
    if (tree.sortField && !fields.some((field) => field.name === tree.sortField)) throw new Error("TREE sortField 必须引用已配置字段")
    if (config.advanced?.model?.type && config.advanced.model.type !== "TREE") throw new Error("TREE 模板的 model.type 必须为 TREE")
  }
  if ((config.template === "MASTER_CHILD" || config.template === "MASTER_DETAIL")) {
    const children = config.advanced?.model?.masterDetail?.children
    if (!children?.length && !config.masterChild) throw new Error("主子表模板必须声明子表配置")
    if (config.template === "MASTER_DETAIL") {
      if (config.advanced?.model?.type !== "MASTER_DETAIL") throw new Error("MASTER_DETAIL 模板的 model.type 必须为 MASTER_DETAIL")
      const codes = new Set<string>()
      for (const child of children ?? []) {
        if (!codes.add(child.code) || !IDENTIFIER.test(child.code)) throw new Error("主子表 child code 必须唯一且合法")
        if (!child.targetReleaseId) throw new Error(`主子表子定义 ${child.code} 缺少不可变 targetReleaseId`)
        if (!child.fields.length) throw new Error(`主子表子定义 ${child.code} 缺少已解析字段`)
        const foreignKey = child.fields.find((field) => field.name === child.foreignKeyField)
        if (!foreignKey || foreignKey.readOnly || isManagedColumn(foreignKey)) throw new Error(`主子表子定义 ${child.code} 的 foreignKeyField 必须是可写业务字段`)
      }
    }
  }
}

// ============ Service ============

export class CodegenEngineService {
  /**
   * 生成完整模块代码
   */
  static generate(config: CodegenConfig): CodegenOutput[] {
    domainLog.event("infra.codegen.generate", {
      moduleName: config.moduleName,
      className: config.className,
      template: config.template,
      scene: config.scene,
    })

    const outputs: CodegenOutput[] = []

    validateConfig(config)

    // 1. Types. Managed Online routes deliberately use centrally registered Online permissions.
    outputs.push(generateTypes(config))
    if (config.onlineRuntime?.storageKind !== "MANAGED_TABLE") outputs.push(generatePermissions(config))

    // 2. Validator (Zod Schema) + HTTP/broker ACTION_SCHEMAS
    outputs.push(generateValidator(config))
    outputs.push(generateActions(config))

    // 3. Service + dual-mode RPC binding (same-process SDK, split-process RPC)
    outputs.push(generateService(config))
    if (config.onlineRuntime?.storageKind !== "MANAGED_TABLE") outputs.push(generateRpc(config))

    // 4. API Route
    outputs.push(generateRoute(config))
    outputs.push(...generateActionRoutes(config))

    // 5. 前端页面
    if (config.generateFrontend) {
      outputs.push(generateApiClient(config))
      outputs.push(generateFormComponent(config))
      outputs.push(generateListPage(config))
      outputs.push(generateAppPageEntry(config))
    }

    // 6. 测试
    if (config.generateTest) {
      outputs.push(generateTest(config))
    }

    // 7. A manifest makes ZIP injection an explicit, whitelist-driven local action.
    outputs.push(generateManifest(config, outputs))

    domainLog.audit("infra.codegen.generate", {
      targetType: "CODEGEN",
      targetId: config.className,
      fileCount: outputs.length,
    })

    return outputs
  }

  /**
   * 预览生成结果（不写入文件）
   */
  static preview(config: CodegenConfig): CodegenOutput[] {
    return CodegenEngineService.generate(config)
  }

  /** RPC/SDK wrapper: same-process is in-memory; split-process is HTTP RPC. */
  static async previewCodegen(config: CodegenConfig) {
    return { files: this.preview(config) }
  }

  /** RPC/SDK wrapper: same-process is in-memory; split-process is HTTP RPC. */
  static async generateCodegen(config: CodegenConfig) {
    return { files: this.generate(config) }
  }

  /**
   * 获取可用模板列表
   */
  static listTemplates(): { id: CodegenTemplate; name: string; description: string }[] {
    return [
      { id: "CRUD", name: "标准 CRUD", description: "列表、字段配置、筛选、表单、导入导出、权限与审阅 ZIP。" },
      { id: "TREE", name: "树形 CRUD", description: "在标准 CRUD 上增加父子树约束与树形数据输出。" },
      { id: "MASTER_DETAIL", name: "主子表", description: "输出主记录与子定义绑定的嵌套配置和事务扩展点。" },
    ]
  }
}

// ============ Generator Functions ============

function toKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

function toCamel(str: string): string {
  return str[0].toLowerCase() + str.slice(1)
}

function toPascal(str: string): string {
  return str.split(/[_-]/).map((part) => part.slice(0, 1).toUpperCase() + part.slice(1)).join("")
}

function toScreaming(className: string): string {
  return toKebab(className).replace(/-/g, "_").toUpperCase()
}

function actionName(config: CodegenConfig, method: "page" | "get" | "create" | "update" | "delete"): string {
  return `${config.moduleName}.${method}${config.className}`
}

function getBasePath(config: CodegenConfig): string {
  const sub = config.subModule ? `/${config.subModule}` : ""
  return `src/modules/${config.moduleName}${sub}`
}

function getBackendPath(config: CodegenConfig): string {
  return `${getBasePath(config)}/backend`
}

function getFrontendPath(config: CodegenConfig): string {
  return `${getBasePath(config)}/frontend`
}

function generateTypes(config: CodegenConfig): CodegenOutput {
  const { className, table } = config
  const fields = configuredColumns(config)
    .filter((column) => column.name !== "deleted")
    .map((column) => `  ${column.name}: ${column.tsType}${column.nullable ? " | null" : ""}`)
    .join("\n")

  const content = `// Auto-generated by Codegen Engine
// Table: ${table.name} | ${table.comment || className}

export type ${className}DO = {
${fields}
}

export type ${className}VO = ${className}DO

export type ${className}CreateInput = Omit<${className}DO, "id" | "created_at" | "updated_at" | "create_time" | "update_time" | "creator" | "updater" | "deleted" | "tenant_id"${configuredColumns(config).filter((column) => column.readOnly && !isManagedColumn(column)).map((column) => ` | "${column.name}"`).join("")}>

export type ${className}UpdateInput = Partial<${className}CreateInput> & { id: string }

export type ${className}PageQuery = {
  page: number
  pageSize: number
  keyword?: string
}
`
  return { path: `${getBackendPath(config)}/types/${toKebab(className)}.types.ts`, content, type: "type" }
}

function generatePermissions(config: CodegenConfig): CodegenOutput {
  const kebab = toKebab(config.className)
  const prefix = getPermissionPrefix(config)
  const content = `// Auto-generated by Codegen Engine
// Register these codes in the menu/button-permission catalog before exposing the generated page.
import type { PermissionCode } from "@/modules/shared/backend/constants/permissions"

export const ${config.className}Permissions = {
  query: "${prefix}:query",
  create: "${prefix}:create",
  update: "${prefix}:update",
  delete: "${prefix}:delete",${(config.advanced?.actions ?? []).filter((action) => action.enabled && action.type === "EXPORT").length ? `
  export: "${prefix}:export",` : ""}${(config.advanced?.actions ?? []).filter((action) => action.enabled && action.type === "IMPORT").length ? `
  import: "${prefix}:import",` : ""}${(config.advanced?.actions ?? []).filter((action) => action.enabled && action.type === "SUBMIT_WORKFLOW").length ? `
  submitWorkflow: "${prefix}:submit-workflow",` : ""}
} as const

// The central catalog is intentionally not edited by a generated ZIP. This cast keeps
// the generated route typed while deployment requires explicit menu/permission registration.
export const ${config.className}PermissionCodes = ${config.className}Permissions as unknown as Record<keyof typeof ${config.className}Permissions, PermissionCode>
`
  return { path: `${getBackendPath(config)}/constants/${kebab}.permissions.ts`, content, type: "permission" }
}

function zodSchemaForColumn(column: ConfiguredColumn, required: boolean): string {
  let schema = column.widget === "JSON" || column.type === "json"
    ? "z.preprocess((value) => typeof value === \"string\" ? (() => { try { return JSON.parse(value) } catch { return value } })() : value, z.unknown())"
    : column.tsType === "number"
      ? "z.coerce.number().finite()"
      : column.tsType === "boolean"
        ? "z.preprocess((value) => value === \"true\" ? true : value === \"false\" ? false : value, z.boolean())"
        : "z.string().trim()"
  if (column.enumValues?.length) schema += `.refine((value) => ${JSON.stringify(column.enumValues)}.includes(value as string), "${column.comment || column.name} 值无效")`
  const maxLength = column.validation?.maxLength ?? column.maxLength
  if (column.tsType === "string" && maxLength) schema += `.max(${maxLength}, "${column.comment || column.name} 长度不能超过 ${maxLength}")`
  if (column.validation?.minLength !== undefined) schema += `.min(${column.validation.minLength}, "${column.comment || column.name} 长度不足")`
  if (column.validation?.min !== undefined) schema += `.gte(${column.validation.min}, "${column.comment || column.name} 不能小于 ${column.validation.min}")`
  if (column.validation?.max !== undefined) schema += `.lte(${column.validation.max}, "${column.comment || column.name} 不能大于 ${column.validation.max}")`
  for (const rule of column.validation?.ruleKeys ?? []) {
    if (rule === "EMAIL") schema += `.email("${column.comment || column.name} 邮箱格式无效")`
    if (rule === "MOBILE") schema += `.regex(/^1[3-9]\\d{9}$/, "${column.comment || column.name} 手机号格式无效")`
    if (rule === "IDENTIFIER") schema += `.regex(/^[A-Za-z_][A-Za-z0-9_]*$/, "${column.comment || column.name} 标识格式无效")`
  }
  if (required) schema += column.tsType === "string" ? `.min(1, "${column.comment || column.name} 不能为空")` : ""
  else schema += ".optional()"
  if (column.defaultValueTyped !== undefined) schema += `.default(${JSON.stringify(column.defaultValueTyped)})`
  return schema
}

function querySchemaForColumn(column: ConfiguredColumn): string {
  const base = column.widget === "JSON" || column.type === "json" ? "z.unknown()" : column.tsType === "number" ? "z.coerce.number().finite()" : column.tsType === "boolean" ? "z.preprocess((value) => value === \"true\" ? true : value === \"false\" ? false : value, z.boolean())" : "z.string().trim().max(200)"
  const operator = column.query?.operator ?? column.queryType
  let schema = operator === "BETWEEN" ? `z.preprocess((value) => typeof value === "string" ? value.split(",").filter(Boolean) : value, z.array(${base}).length(2))` : operator === "IN" ? `z.preprocess((value) => typeof value === "string" ? value.split(",").filter(Boolean) : value, z.array(${base}).min(1).max(32))` : base
  if (!column.query?.required) schema += ".optional()"
  if (column.query?.defaultValue !== undefined) schema += `.default(${JSON.stringify(column.query.defaultValue)})`
  return schema
}

function childCreateSchema(child: CodegenMasterDetailChild): string {
  const fields = child.fields.filter((field) => field.name !== child.foreignKeyField && !isManagedColumn(field) && field.readOnly !== true && field.uiComponent !== "HIDDEN")
  return `z.object({\n${fields.map((field) => `  ${field.name}: ${zodSchemaForColumn(field, !field.nullable && field.defaultValueTyped === undefined)},`).join("\n")}\n}).strict()`
}

function generateValidator(config: CodegenConfig): CodegenOutput {
  const { className } = config
  const kebab = toKebab(className)
  const camel = toCamel(className)
  const createFields = formColumns(config).map((column) => `  ${column.name}: ${zodSchemaForColumn(column, column.formValidation === "required" || (!column.nullable && column.defaultValueTyped === undefined))},`).join("\n")
  const queryFields = queryColumns(config).map((column) => `  ${column.name}: ${querySchemaForColumn(column)},`).join("\n")
  const children = config.template === "MASTER_DETAIL" ? config.advanced?.model?.masterDetail?.children ?? [] : []
  const childSchemas = children.map((child) => `const ${camel}${toPascal(child.code)}ChildSchema = ${childCreateSchema(child)}`).join("\n\n")
  const nestedChildren = children.length ? `  children: z.object({\n${children.map((child) => `    ${child.code}: z.array(${camel}${toPascal(child.code)}ChildSchema).max(100),`).join("\n")}\n  }).strict(),` : ""

  const content = `// Auto-generated by Codegen Engine
import { z } from "zod"

${childSchemas}

export const ${camel}PageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
${config.template === "TREE" ? `  tree: z.enum(["true", "false"]).optional(),\n` : ""}${queryFields}
}).strict()

export const ${camel}CreateSchema = z.object({
${createFields}
${nestedChildren}
}).strict()

export const ${camel}UpdateSchema = ${camel}CreateSchema.partial().extend({
  id: z.string().min(1, "id 不能为空"),
}).strict()

export type ${className}PageQueryInput = z.infer<typeof ${camel}PageQuerySchema>
export type ${className}CreateInput = z.infer<typeof ${camel}CreateSchema>
export type ${className}UpdateInput = z.infer<typeof ${camel}UpdateSchema>
`
  return { path: `${getBackendPath(config)}/validators/${kebab}.validator.ts`, content, type: "validator" }
}

function generateActions(config: CodegenConfig): CodegenOutput {
  const { className, moduleName, subModule } = config
  const kebab = toKebab(className)
  const camel = toCamel(className)
  const sub = subModule ? `/${subModule}` : ""
  const schemas = `${toScreaming(className)}_ACTION_SCHEMAS`
  const content = `// Auto-generated by Codegen Engine
import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  ${camel}PageQuerySchema,
  ${camel}CreateSchema,
  ${camel}UpdateSchema,
} from "../backend/validators/${kebab}.validator"

export const ${camel}GetSchema = z.object({
  id: z.string().min(1, "id 不能为空"),
}).strict()

export const ${camel}DeleteSchema = ${camel}GetSchema

export const ${schemas} = {
  "${actionName(config, "page")}": ${camel}PageQuerySchema,
  "${actionName(config, "get")}": ${camel}GetSchema,
  "${actionName(config, "create")}": ${camel}CreateSchema,
  "${actionName(config, "update")}": ${camel}UpdateSchema,
  "${actionName(config, "delete")}": ${camel}DeleteSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(${schemas})) {
    registerActionSchema(action, schema)
  }
}
`
  return { path: `src/modules/${moduleName}${sub}/contract/${kebab}.actions.ts`, content, type: "type" }
}

function generateService(config: CodegenConfig): CodegenOutput {
  if (config.onlineRuntime?.storageKind === "MANAGED_TABLE") return generateManagedOnlineService(config)
  const { className, moduleName, businessName } = config
  const kebab = toKebab(className)
  const camel = toCamel(className)
  const filters = queryColumns(config)
  const treeConfig = config.template === "TREE" ? config.advanced?.model?.tree : undefined
  const masterDetailChildren = config.template === "MASTER_DETAIL" ? config.advanced?.model?.masterDetail?.children ?? [] : []
  const masterDetailMetadata = masterDetailChildren.length ? JSON.stringify(masterDetailChildren.map((child) => ({ code: child.code, targetReleaseId: child.targetReleaseId, foreignKeyField: child.foreignKeyField }))) : "[]"
  const masterDetailMethods = masterDetailChildren.length ? `
  /** Child arrays use replace-all semantics and must be persisted with the parent in one DB transaction. */
  private static materializeChildren(value: unknown, parentId: string) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
    const result: Record<string, Array<Record<string, unknown>>> = {}
    for (const child of MASTER_DETAIL_CHILDREN) {
      const rows = source[child.code]
      if (!Array.isArray(rows)) { result[child.code] = []; continue }
      result[child.code] = rows.map((row, index) => {
        if (!row || typeof row !== "object" || Array.isArray(row)) throw new Error(\`子表 \${child.code} 第 \${index + 1} 行无效\`)
        const data = { ...(row as Record<string, unknown>) }
        if (child.foreignKeyField in data) throw new Error(\`子表 \${child.code} 外键由服务端管理，不能由客户端提交\`)
        return { id: \`\${child.code}-\${crypto.randomUUID()}\`, ...data, [child.foreignKeyField]: parentId }
      })
    }
    return result
  }` : ""
  const masterCreateSetup = masterDetailChildren.length ? `    const { children, ...parentInput } = input as ${className}CreateInput & { children?: Record<string, unknown> }
    // Production repository implementation: begin tenant-scoped transaction here.
    const materializedChildren = this.materializeChildren(children, id)` : "    const parentInput = input"
  const masterCreateChildren = masterDetailChildren.length ? ", children: materializedChildren" : ""
  const masterUpdateSetup = masterDetailChildren.length ? `    const { children, ...parentPatch } = input as ${className}UpdateInput & { children?: Record<string, unknown> }
    // Replace-all orphan policy: delete prior child rows and insert materialized rows in the same transaction.
    const materializedChildren = children === undefined ? (MOCK_DATA[idx].children ?? {}) : this.materializeChildren(children, input.id)` : "    const parentPatch = input"
  const masterUpdateChildren = masterDetailChildren.length ? ", children: materializedChildren" : ""
  const treeMethods = treeConfig ? `
  /** Returns an ordered nested tree. Orphaned/cyclic rows are deliberately surfaced as roots. */
  static async tree(input: ${className}PageQueryInput) {
    const page = await this.page({ ...input, page: 1, pageSize: 10000 })
    const parentField = ${JSON.stringify(treeConfig.parentField)}
    const sortField = ${JSON.stringify(treeConfig.sortField ?? null)}
    const rootValue = ${JSON.stringify(treeConfig.rootValue ?? null)}
    type TreeNode = Record<string, unknown> & { id: string; children: TreeNode[] }
    const nodes = page.items.map((item) => ({ ...item, children: [] })) as TreeNode[]
    const byId = new Map(nodes.map((node) => [node.id, node]))
    const roots: TreeNode[] = []
    for (const node of nodes) {
      const parentId = node[parentField]
      const parent = typeof parentId === "string" ? byId.get(parentId) : undefined
      if (parent && parent.id !== node.id) parent.children.push(node)
      else if (parentId === rootValue || parentId === null || parentId === undefined || !parent) roots.push(node)
    }
    const sortNodes = (items: TreeNode[]) => { items.sort((left, right) => sortField ? String(left[sortField] ?? "").localeCompare(String(right[sortField] ?? "")) : left.id.localeCompare(right.id)); items.forEach((item) => sortNodes(item.children)) }
    sortNodes(roots)
    return { items: roots, total: nodes.length }
  }` : ""

  const treeCreateGuard = treeConfig ? `    const parentField = ${JSON.stringify(treeConfig.parentField)}
    const parentId = item[parentField] as unknown
    if (parentId === id) throw new Error("树节点不能指定自身为父节点")
    if (parentId !== undefined && parentId !== null && parentId !== "" && !MOCK_DATA.some((row) => row.id === parentId)) throw new Error("父节点不存在")` : ""
  const treeUpdateGuard = treeConfig ? `    const parentField = ${JSON.stringify(treeConfig.parentField)}
    const parentId = (input as Record<string, unknown>)[parentField]
    if (parentId === input.id) throw new Error("树节点不能指定自身为父节点")
    if (parentId !== undefined && parentId !== null && parentId !== "" && !MOCK_DATA.some((row) => row.id === parentId)) throw new Error("父节点不存在")
    const visited = new Set<string>()
    let ancestor = parentId
    while (typeof ancestor === "string" && ancestor) {
      if (ancestor === input.id) throw new Error("树节点不能形成循环引用")
      if (visited.has(ancestor)) throw new Error("树数据已存在循环，拒绝更新")
      visited.add(ancestor)
      ancestor = MOCK_DATA.find((row) => row.id === ancestor)?.[parentField]
    }` : ""
  const treeDeleteGuard = treeConfig ? `    const parentField = ${JSON.stringify(treeConfig.parentField)}
    if (MOCK_DATA.some((row) => row[parentField] === id)) throw new Error("存在子节点，不能删除；请先处理子节点")` : ""

  const content = `// Auto-generated by Codegen Engine
// Same-process callers use this Service as a local application port.
// Cross-domain callers must use createDomainFacade("${moduleName}"), never import this Service.
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import type { ${className}PageQueryInput, ${className}CreateInput, ${className}UpdateInput } from "../validators/${kebab}.validator"

// TODO: Replace mock with real Prisma queries
const MOCK_DATA: any[] = []
const MASTER_DETAIL_CHILDREN = ${masterDetailMetadata} as const
let nextId = 100

export class ${className}Service {
  /** 分页查询 */
  static async page(input: ${className}PageQueryInput) {
    domainLog.event("${moduleName}.${camel}.page", { page: input.page, total: MOCK_DATA.length })
    let filtered = [...MOCK_DATA]
    const matches = (value: unknown, expected: unknown, type: string) => {
      if (expected === undefined || expected === "") return true
      if (type === "LIKE") return String(value ?? "").toLowerCase().includes(String(expected).toLowerCase())
      if (type === "IN") return Array.isArray(expected) && expected.includes(value as never)
      const compare = (left: unknown, right: unknown) => typeof left === "number" && typeof right === "number" ? left - right : typeof left === "boolean" && typeof right === "boolean" ? Number(left) - Number(right) : typeof left === "string" && typeof right === "string" ? left.localeCompare(right) : null
      if (type === "BETWEEN") { if (!Array.isArray(expected) || expected.length !== 2) return false; const lower = compare(value, expected[0]); const upper = compare(value, expected[1]); return lower !== null && upper !== null && lower >= 0 && upper <= 0 }
      if (type === "!=") return value !== expected
      const result = compare(value, expected)
      if (type === ">") return result !== null && result > 0
      if (type === ">=") return result !== null && result >= 0
      if (type === "<") return result !== null && result < 0
      if (type === "<=") return result !== null && result <= 0
      return value === expected
    }
${filters.map((column) => `    filtered = filtered.filter((item) => matches(item.${column.name}, input.${column.name}, "${column.query?.operator ?? column.queryType ?? "="}"))`).join("\n")}
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }

  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("${businessName}不存在")
    return item
  }

  /** 创建 */
  static async create(input: ${className}CreateInput) {
    const id = \`${kebab}-\${++nextId}\`
    const now = new Date().toISOString()
${masterCreateSetup}
    const item: Record<string, unknown> = { id, ...parentInput${masterCreateChildren}, creator: "", updater: "", deleted: false, tenant_id: 0, created_at: now, updated_at: now, create_time: now, update_time: now }
${treeCreateGuard}
    MOCK_DATA.push(item)
    domainLog.event("${moduleName}.${camel}.create", { id })
    domainLog.audit("${moduleName}.${camel}.create", { targetType: "${moduleName.toUpperCase()}_${className.toUpperCase()}", targetId: id })
    return { id }
  }

  /** 更新 */
  static async update(input: ${className}UpdateInput) {
    const idx = MOCK_DATA.findIndex((d) => d.id === input.id)
    if (idx === -1) throw new Error("${businessName}不存在")
${masterUpdateSetup}
${treeUpdateGuard}
    MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...parentPatch${masterUpdateChildren}, updated_at: new Date().toISOString(), update_time: new Date().toISOString() }
    domainLog.event("${moduleName}.${camel}.update", { id: input.id })
    domainLog.audit("${moduleName}.${camel}.update", { targetType: "${moduleName.toUpperCase()}_${className.toUpperCase()}", targetId: input.id })
    return true
  }

  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("${businessName}不存在")
${treeDeleteGuard}
    MOCK_DATA.splice(idx, 1)
    domainLog.event("${moduleName}.${camel}.delete", { id })
    domainLog.audit("${moduleName}.${camel}.delete", { targetType: "${moduleName.toUpperCase()}_${className.toUpperCase()}", targetId: id })
    return true
  }${treeMethods}${masterDetailMethods}
}
`
  return { path: `${getBackendPath(config)}/services/${kebab}.service.ts`, content, type: "service" }
}

function generateRpc(config: CodegenConfig): CodegenOutput {
  const { className, moduleName } = config
  const kebab = toKebab(className)
  const content = `// Auto-generated by Codegen Engine
/**
 * Dual-mode RPC surface for ${className}Service.
 * Same-process is in-memory SDK via broker; split-process uses the same methods over RPC.
 * Cross-domain callers must use createDomainFacade("${moduleName}"), never import this Service.
 */
import { registerActionSchemas } from "../../contract/${kebab}.actions"

registerActionSchemas()

export const ${className}RpcMethods = ["page", "get", "create", "update", "delete"] as const

export const ${className}RpcBinding = {
  domain: "${moduleName}",
  service: "${className}Service",
  module: "${kebab}.service",
  methods: ${className}RpcMethods,
} as const
`
  return { path: `${getBackendPath(config)}/services/${kebab}.rpc.ts`, content, type: "type" }
}

function generateRoute(config: CodegenConfig): CodegenOutput {
  if (config.onlineRuntime?.storageKind === "MANAGED_TABLE") return generateManagedOnlineRoute(config)
  const { className, moduleName, subModule } = config
  const kebab = toKebab(className)
  const sub = subModule ? `/${subModule}` : ""
  const schemas = `${toScreaming(className)}_ACTION_SCHEMAS`
  const treeResponse = config.template === "TREE" ? `
  if (input.tree === "true") return NextResponse.json({ success: true, data: await ${className}Service.tree(input) })` : ""

  const content = `// Auto-generated by Codegen Engine
import { NextResponse } from "next/server"
import { ${className}Service } from "@/modules/${moduleName}${sub}/backend/services/${kebab}.service"
import { ${schemas} } from "@/modules/${moduleName}${sub}/contract/${kebab}.actions"
import { ${className}PermissionCodes } from "@/modules/${moduleName}${sub}/backend/constants/${kebab}.permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request: Request) => {
  const id = new URL(request.url).searchParams.get("id")
  if (id) return NextResponse.json({ success: true, data: await ${className}Service.get(parseActionBody(${schemas}["${actionName(config, "get")}"], { id }).id) })
  const input = parseActionQuery(${schemas}["${actionName(config, "page")}"], request)${treeResponse}
  return NextResponse.json({ success: true, data: await ${className}Service.page(input) })
}, { permission: ${className}PermissionCodes.query })

export const POST = withAdminRoute(async (request: Request) => {
  const input = parseActionBody(${schemas}["${actionName(config, "create")}"], await request.json())
  return NextResponse.json({ success: true, data: await ${className}Service.create(input) }, { status: 201 })
}, { permission: ${className}PermissionCodes.create })

export const PUT = withAdminRoute(async (request: Request) => {
  const input = parseActionBody(${schemas}["${actionName(config, "update")}"], await request.json())
  return NextResponse.json({ success: true, data: await ${className}Service.update(input) })
}, { permission: ${className}PermissionCodes.update })

export const DELETE = withAdminRoute(async (request: Request) => {
  const id = new URL(request.url).searchParams.get("id")
  const input = parseActionBody(${schemas}["${actionName(config, "delete")}"], { id })
  return NextResponse.json({ success: true, data: await ${className}Service.delete(input.id) })
}, { permission: ${className}PermissionCodes.delete })
`
  return { path: `src/app/api/v1/admin/${moduleName}${sub}/${kebab}/route.ts`, content, type: "route" }
}

function generateActionRoutes(config: CodegenConfig): CodegenOutput[] {
  if (config.onlineRuntime?.storageKind === "MANAGED_TABLE") return []
  const { className, moduleName, subModule } = config
  const kebab = toKebab(className)
  const sub = subModule ? `/${subModule}` : ""
  const schemas = `${toScreaming(className)}_ACTION_SCHEMAS`
  const basePath = `src/app/api/v1/admin/${moduleName}${sub}/${kebab}`
  const imports = `import { NextResponse } from "next/server"
import { ${className}Service } from "@/modules/${moduleName}${sub}/backend/services/${kebab}.service"
import { ${schemas} } from "@/modules/${moduleName}${sub}/contract/${kebab}.actions"
import { ${className}PermissionCodes } from "@/modules/${moduleName}${sub}/backend/constants/${kebab}.permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"`
  const outputs: CodegenOutput[] = []
  if (enabledActions(config, "EXPORT")) outputs.push({ path: `${basePath}/export/route.ts`, type: "route", content: `${imports}
import { csvResponse } from "@/modules/shared/backend/http/csv-download"

export const GET = withAdminRoute(async (request: Request) => {
  const page = await ${className}Service.page(parseActionQuery(${schemas}["${actionName(config, "page")}"], request))
  return csvResponse("${kebab}.csv", ${JSON.stringify(listColumns(config).map((column) => column.comment || column.name))}, page.items.map((item: Record<string, unknown>) => ${JSON.stringify(listColumns(config).map((column) => column.name))}.map((key) => item[key] ?? "")))
}, { permission: ${className}PermissionCodes.export })
` })
  if (enabledActions(config, "IMPORT")) outputs.push({ path: `${basePath}/import/route.ts`, type: "route", content: `${imports}

export const POST = withAdminRoute(async (request: Request) => {
  const body = await request.json()
  if (!Array.isArray(body?.rows) || body.rows.length > 1000) return NextResponse.json({ success: false, error: "rows 必须是 1–1000 条 JSON 记录" }, { status: 400 })
  const errors: Array<{ index: number; error: string }> = []; let imported = 0
  for (let index = 0; index < body.rows.length; index++) { try { await ${className}Service.create(parseActionBody(${schemas}["${actionName(config, "create")}"], body.rows[index])); imported++ } catch (error) { errors.push({ index, error: error instanceof Error ? error.message : "导入失败" }) } }
  return NextResponse.json({ success: errors.length === 0, data: { imported, errors } }, { status: errors.length ? 422 : 201 })
}, { permission: ${className}PermissionCodes.import })
` })
  if (enabledActions(config, "SUBMIT_WORKFLOW")) outputs.push({ path: `${basePath}/workflow/route.ts`, type: "route", content: `${imports}
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export const POST = withAdminRoute(async (request: Request) => {
  const input = parseActionBody(${schemas}["${actionName(config, "get")}"], await request.json())
  await ${className}Service.get(input.id)
  // Integrate the reviewed BPM/workflow adapter here; generation intentionally does not invent a workflow engine.
  domainLog.audit("${config.moduleName}.${toCamel(className)}.submit-workflow", { targetType: "${className.toUpperCase()}", targetId: input.id })
  return NextResponse.json({ success: true, data: { id: input.id, status: "PENDING_WORKFLOW_INTEGRATION" } }, { status: 202 })
}, { permission: ${className}PermissionCodes.submitWorkflow })
` })
  return outputs
}

function generateListPage(config: CodegenConfig): CodegenOutput {
  if (config.template === "TREE") return generateTreePage(config)
  const { className, businessName, moduleName, subModule } = config
  const kebab = toKebab(className)
  const camel = toCamel(className)
  const sub = subModule ? `/${subModule}` : ""
  const columns = listColumns(config)
  const filters = queryColumns(config)
  const requiredQueryFields = filters.filter((column) => column.query?.required).map((column) => ({ name: column.name, label: column.comment || column.name }))
  const queryDefaults = JSON.stringify(queryDefaultValues(config))
  const canCreate = actionEnabled(config, "CREATE")
  const canUpdate = actionEnabled(config, "UPDATE")
  const canDelete = actionEnabled(config, "DELETE")
  const canExport = enabledActions(config, "EXPORT")
  const canImport = enabledActions(config, "IMPORT")
  const canSubmitWorkflow = enabledActions(config, "SUBMIT_WORKFLOW")
  const noCrudActions = config.onlineRuntime?.storageKind === "MANAGED_TABLE" && !canCreate && !canUpdate && !canDelete
  const colDefs = columns.map((column) => `                <td className="px-4 py-2.5">{formatValue(item.${column.name})}</td>`).join("\n")
  const headerDefs = columns.map((column) => `              <th className="px-4 py-3">${column.comment || column.name}</th>`).join("\n")
  const filterDefs = filters.map((column) => {
    const label = column.comment || column.name
    const operator = column.query?.operator ?? column.queryType
    const widget = column.query?.widget ?? column.widget ?? column.uiComponent
    const type = operator === "BETWEEN" || operator === "IN" ? "text" : widget === "NUMBER" ? "number" : widget === "DATE" ? "date" : widget === "DATETIME" ? "datetime-local" : "text"
    const required = column.query?.required ? " *" : ""
    if (column.tsType === "boolean") return `          <label className="text-xs"><span className="mb-1 block text-slate-600">${label}${required}</span><select value={String(filters.${column.name} ?? "")} onChange={(event) => updateFilter("${column.name}", event.target.value)} className="h-9 min-w-28 rounded-md border px-2 text-sm"><option value="">全部</option><option value="true">是</option><option value="false">否</option></select></label>`
    if (column.enumValues?.length) return `          <label className="text-xs"><span className="mb-1 block text-slate-600">${label}${required}</span><select value={String(filters.${column.name} ?? "")} onChange={(event) => updateFilter("${column.name}", event.target.value)} className="h-9 min-w-28 rounded-md border px-2 text-sm"><option value="">全部</option>${column.enumValues.map((value) => `<option value="${value}">${value}</option>`).join("")}</select></label>`
    const placeholder = operator === "BETWEEN" ? "起止值用逗号分隔" : operator === "IN" ? "多个值用逗号分隔" : `请输入${label}`
    return `          <label className="text-xs"><span className="mb-1 block text-slate-600">${label}${required}</span><input type="${type}" value={toFilterText(filters.${column.name})} onChange={(event) => updateFilter("${column.name}", event.target.value)} placeholder="${placeholder}" className="h-9 w-44 rounded-md border px-3 text-sm" /></label>`
  }).join("\n")
  const rowActions = `${canUpdate ? `<button onClick={() => handleEdit(item)} className="text-xs text-blue-600 hover:text-blue-800">编辑</button>` : ""}${canSubmitWorkflow ? `<button onClick={() => void handleWorkflow(item)} className="text-xs text-violet-600 hover:text-violet-800">提交审批</button>` : ""}${canDelete ? `<button onClick={() => void handleDelete(item)} className="text-xs text-red-600 hover:text-red-800">删除</button>` : ""}` || `<span className="text-xs text-slate-400">—</span>`
  const exportHandler = canExport ? `
  const handleExport = async () => { try { await ${camel}Api.downloadExport(filters); } catch (error) { alert(error instanceof Error ? "导出失败" : "导出失败") } }` : ""
  const importHandler = canImport ? `
  const handleImport = async () => {
    const raw = prompt("粘贴 JSON 数组导入数据（最多 1000 条）")
    if (!raw) return
    try { const rows = JSON.parse(raw); if (!Array.isArray(rows)) throw new Error("必须是 JSON 数组"); const response = await ${camel}Api.importRows(rows); if (response.success) void loadData(); else alert(response.error || "导入存在错误") } catch (error) { alert(error instanceof Error ? error.message : "导入失败") }
  }` : ""
  const workflowHandler = canSubmitWorkflow ? `
  const handleWorkflow = async (item: ${className}DO) => { const response = await ${camel}Api.submitWorkflow(item.id); if (!response.success) alert(response.error || "提交审批失败"); else alert("审批请求已提交，等待工作流适配器处理") }` : ""
  const content = `// Auto-generated by Codegen Engine
"use client"

import { useState, useEffect, useCallback } from "react"
import { ${camel}Api } from "../api/${kebab}.api"
import { ${className}Form } from "../components/${className}Form"

import type { ${className}DO } from "@/modules/${moduleName}${sub}/backend/types/${kebab}.types"
import type { ${className}CreateInput, ${className}UpdateInput } from "@/modules/${moduleName}${sub}/backend/validators/${kebab}.validator"

type PageData = { items: ${className}DO[]; total: number; page: number; pageSize: number }
type FormSubmitResult = { success: boolean; error?: string }
const QUERY_DEFAULTS: Record<string, unknown> = ${queryDefaults}
const REQUIRED_QUERY_FIELDS = ${JSON.stringify(requiredQueryFields)}

function toFilterText(value: unknown): string { return Array.isArray(value) ? value.join(",") : value === undefined || value === null ? "" : String(value) }
function formatValue(value: unknown): string { return value === undefined || value === null ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value) }

export default function ${className}ListPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<Record<string, unknown>>(QUERY_DEFAULTS)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<${className}DO | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await ${camel}Api.page({ page, pageSize: 20, ...filters })
      if (response.success && response.data) setData(response.data as PageData)
    } finally { setLoading(false) }
  }, [page, filters])

  useEffect(() => { void loadData() }, [loadData])
  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize))
  const updateFilter = (name: string, value: unknown) => setFilters((current) => ({ ...current, [name]: value }))
  const handleQuery = () => { const missing = REQUIRED_QUERY_FIELDS.find((field) => !toFilterText(filters[field.name]).trim()); if (missing) { alert(missing.label + " 为必填查询条件"); return }; setPage(1); void loadData() }
  const handleCreate = () => { setEditing(null); setShowForm(true) }
  const handleEdit = (item: ${className}DO) => { setEditing(item); setShowForm(true) }
  const handleDelete = async (item: ${className}DO) => {
    if (!confirm("确认删除「" + String(item.id) + "」？")) return
    const response = await ${camel}Api.delete(item.id)
    if (response.success) void loadData(); else alert(response.error || "删除失败")
  }${exportHandler}${importHandler}${workflowHandler}
  const handleFormSubmit = async (formData: ${className}CreateInput | ${className}UpdateInput): Promise<FormSubmitResult> => {
    const response = editing ? await ${camel}Api.update({ ...formData, id: editing.id }) : await ${camel}Api.create(formData as ${className}CreateInput)
    if (response.success) { setShowForm(false); void loadData(); return { success: true } }
    return { success: false, error: response.error || "操作失败" }
  }

  return <div className="space-y-4">
    <header className="flex items-center justify-between rounded-lg border bg-white p-4"><div><h1 className="text-lg font-semibold text-slate-900">${businessName}管理</h1><p className="mt-0.5 text-sm text-slate-500">由代码生成器字段配置驱动</p>${noCrudActions ? `<p className="mt-1 text-sm text-amber-700">当前发布版本未启用新增、编辑或删除动作，仅可查询。</p>` : ""}</div><div className="flex gap-2">${canExport ? `<button onClick={() => void handleExport()} className="h-9 rounded-md border px-4 text-sm">导出</button>` : ""}${canImport ? `<button onClick={() => void handleImport()} className="h-9 rounded-md border px-4 text-sm">导入 JSON</button>` : ""}${canCreate ? `<button onClick={handleCreate} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">新增</button>` : ""}</div></header>
    <section className="rounded-lg border bg-white p-4"><div className="flex flex-wrap items-end gap-3">
${filterDefs || "          <span className=\"text-sm text-slate-400\">当前未配置查询字段</span>"}
          <button onClick={handleQuery} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button><button onClick={() => { setFilters(QUERY_DEFAULTS); setPage(1) }} className="h-9 rounded-md border px-4 text-sm">重置</button><span className="ml-auto text-xs text-slate-400">共 {data.total} 条</span>
    </div></section>
    <section className="rounded-lg border bg-white"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
${headerDefs}
              <th className="px-4 py-3 text-right">操作</th></tr></thead><tbody>{loading ? <tr><td colSpan={${columns.length + 1}} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr> : data.items.length === 0 ? <tr><td colSpan={${columns.length + 1}} className="px-4 py-12 text-center text-slate-400">暂无数据</td></tr> : data.items.map((item) => <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50">
${colDefs}
                <td className="space-x-2 px-4 py-2.5 text-right">${rowActions}</td></tr>)}</tbody></table></div>{totalPages > 1 && <div className="flex items-center justify-between border-t px-4 py-3"><span className="text-xs text-slate-500">第 {page}/{totalPages} 页</span><div className="flex gap-1"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">上一页</button><button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">下一页</button></div></div>}</section>
    {showForm && <${className}Form mode={editing ? "edit" : "create"} initialData={editing ?? undefined} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />}
  </div>
}
`
  return { path: `${getFrontendPath(config)}/pages/${kebab}-list.page.tsx`, content, type: "page" }
}

function generateTreePage(config: CodegenConfig): CodegenOutput {
  const { className, businessName, moduleName, subModule } = config
  const kebab = toKebab(className)
  const camel = toCamel(className)
  const sub = subModule ? `/${subModule}` : ""
  const columns = listColumns(config)
  const parentField = config.advanced?.model?.tree?.parentField
  const titleColumn = columns.find((column) => column.name !== "id" && column.name !== parentField) ?? columns[0]
  const otherColumns = columns.filter((column) => column.name !== titleColumn?.name).slice(0, 4)
  const columnHeaders = otherColumns.map((column) => `<th className="px-4 py-3">${column.comment || column.name}</th>`).join("")
  const otherValues = otherColumns.map((column) => `<td className="px-4 py-2.5">{formatValue(node.${column.name})}</td>`).join("")
  const canCreate = actionEnabled(config, "CREATE")
  const canUpdate = actionEnabled(config, "UPDATE")
  const canDelete = actionEnabled(config, "DELETE")
  const canSubmitWorkflow = enabledActions(config, "SUBMIT_WORKFLOW")
  const rowActions = `${canUpdate ? `<button onClick={() => handleEdit(node)} className="text-xs text-blue-600 hover:text-blue-800">编辑</button>` : ""}${canSubmitWorkflow ? `<button onClick={() => void handleWorkflow(node)} className="text-xs text-violet-600 hover:text-violet-800">提交审批</button>` : ""}${canDelete ? `<button onClick={() => void handleDelete(node)} className="text-xs text-red-600 hover:text-red-800">删除</button>` : ""}` || `<span className="text-xs text-slate-400">—</span>`
  const workflowHandler = canSubmitWorkflow ? `
  const handleWorkflow = async (node: TreeNode) => { const response = await ${camel}Api.submitWorkflow(node.id); if (!response.success) alert(response.error || "提交审批失败"); else alert("审批请求已提交，等待工作流适配器处理") }` : ""
  const content = `// Auto-generated by Codegen Engine
"use client"

import { Fragment, useCallback, useEffect, useState } from "react"
import { ${camel}Api } from "../api/${kebab}.api"
import { ${className}Form } from "../components/${className}Form"
import type { ${className}DO } from "@/modules/${moduleName}${sub}/backend/types/${kebab}.types"
import type { ${className}CreateInput, ${className}UpdateInput } from "@/modules/${moduleName}${sub}/backend/validators/${kebab}.validator"

type TreeNode = ${className}DO & { children: TreeNode[] }
type FormSubmitResult = { success: boolean; error?: string }
function formatValue(value: unknown): string { return value === undefined || value === null ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value) }

export default function ${className}TreePage() {
  const [items, setItems] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<${className}DO | null>(null)
  const loadTree = useCallback(async () => { setLoading(true); try { const response = await ${camel}Api.tree(); if (response.success && response.data) { setItems(response.data.items); const ids = new Set<string>(); const visit = (nodes: TreeNode[]) => nodes.forEach((node) => { ids.add(node.id); visit(node.children) }); visit(response.data.items); setExpanded(ids) } } finally { setLoading(false) } }, [])
  useEffect(() => { void loadTree() }, [loadTree])
  const handleCreate = () => { setEditing(null); setShowForm(true) }
  const handleEdit = (node: ${className}DO) => { setEditing(node); setShowForm(true) }
  const handleDelete = async (node: TreeNode) => { if (node.children.length) { alert("存在子节点，不能删除；请先处理子节点"); return } if (!confirm("确认删除「" + String(node.id) + "」？")) return; const response = await ${camel}Api.delete(node.id); if (response.success) void loadTree(); else alert(response.error || "删除失败") }${workflowHandler}
  const handleFormSubmit = async (formData: ${className}CreateInput | ${className}UpdateInput): Promise<FormSubmitResult> => { const response = editing ? await ${camel}Api.update({ ...formData, id: editing.id }) : await ${camel}Api.create(formData as ${className}CreateInput); if (response.success) { setShowForm(false); void loadTree(); return { success: true } }; return { success: false, error: response.error || "操作失败" } }
  const toggle = (id: string) => setExpanded((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next })
  const renderRows = (nodes: TreeNode[], level = 0): React.ReactNode[] => nodes.flatMap((node) => { const hasChildren = node.children.length > 0; const visibleChildren = hasChildren && expanded.has(node.id) ? renderRows(node.children, level + 1) : []; return [<Fragment key={node.id}><tr className="border-b last:border-0 hover:bg-slate-50"><td className="px-4 py-2.5"><div style={{ paddingLeft: level * 20 }} className="flex items-center gap-2">{hasChildren ? <button onClick={() => toggle(node.id)} className="w-5 text-slate-500">{expanded.has(node.id) ? "−" : "+"}</button> : <span className="w-5" />}<span>{formatValue(node.${titleColumn?.name ?? "id"})}</span></div></td>${otherValues}<td className="space-x-2 px-4 py-2.5 text-right">${rowActions}</td></tr></Fragment>, ...visibleChildren] })
  return <div className="space-y-4"><header className="flex items-center justify-between rounded-lg border bg-white p-4"><div><h1 className="text-lg font-semibold text-slate-900">${businessName}管理</h1><p className="mt-0.5 text-sm text-slate-500">树形节点；删除父节点前必须先处理子节点</p></div>${canCreate ? `<button onClick={handleCreate} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">新增</button>` : ""}</header><section className="rounded-lg border bg-white"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500"><th className="px-4 py-3">${titleColumn?.comment || titleColumn?.name || "节点"}</th>${columnHeaders}<th className="px-4 py-3 text-right">操作</th></tr></thead><tbody>{loading ? <tr><td colSpan={${otherColumns.length + 2}} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr> : items.length ? renderRows(items) : <tr><td colSpan={${otherColumns.length + 2}} className="px-4 py-12 text-center text-slate-400">暂无节点</td></tr>}</tbody></table></div></section>{showForm && <${className}Form mode={editing ? "edit" : "create"} initialData={editing ?? undefined} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />}</div>
}
`
  return { path: `${getFrontendPath(config)}/pages/${kebab}-tree.page.tsx`, content, type: "page" }
}

function generateApiClient(config: CodegenConfig): CodegenOutput {
  const { className, moduleName, subModule } = config
  const kebab = toKebab(className)
  const camel = toCamel(className)
  const sub = subModule ? `/${subModule}` : ""
  const exportMethod = enabledActions(config, "EXPORT") ? `
  async downloadExport(params?: Partial<${className}PageQueryInput>) {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(params ?? {})) if (value !== undefined && value !== null && value !== "") query.set(key, Array.isArray(value) ? value.join(",") : String(value))
    const token = typeof window === "undefined" ? null : localStorage.getItem("ruoyi_token")
    const response = await fetch(\`\${BASE}/export?\${query}\`, { headers: token ? { Authorization: \`Bearer \${token}\` } : {} })
    if (!response.ok) throw new Error("导出失败")
    const blob = await response.blob(); const href = URL.createObjectURL(blob); const anchor = document.createElement("a")
    anchor.href = href; anchor.download = "${kebab}.csv"; anchor.click(); URL.revokeObjectURL(href)
  },` : ""
  const importMethod = enabledActions(config, "IMPORT") ? `
  importRows(rows: unknown[]) { return request.post<{ imported: number; errors: Array<{ index: number; error: string }> }>(\`\${BASE}/import\`, { rows }) },` : ""
  const workflowMethod = enabledActions(config, "SUBMIT_WORKFLOW") ? `
  submitWorkflow(id: string) { return request.post<{ id: string; status: string }>(\`\${BASE}/workflow\`, { id }) },` : ""
  const dictionaryMethod = config.moduleName === "online" ? `
  dictionaryOptions(definitionCode: string, field: string) { return request.get<{ releaseId: string; fieldCode: string; options: Array<{ value: string; label: string }> }>(\`/api/v1/admin/online/definitions/\${definitionCode}/lookup/dictionary\`, { field }) },` : ""
  const treeMethod = config.template === "TREE" ? `
  tree(params?: Partial<${className}PageQueryInput>) { return request.get<{ items: Array<${className}DO & { children: unknown[] }>; total: number }>(BASE, { ...params, tree: "true" }) },` : ""
  const content = `// Auto-generated by Codegen Engine
import { request } from "@/modules/shared/frontend/lib/request"
import type { ${className}DO } from "@/modules/${moduleName}${sub}/backend/types/${kebab}.types"
import type { ${className}CreateInput, ${className}PageQueryInput, ${className}UpdateInput } from "@/modules/${moduleName}${sub}/backend/validators/${kebab}.validator"

type ${className}PageData = { items: ${className}DO[]; total: number; page: number; pageSize: number }
const BASE = "/api/v1/admin/${moduleName}${sub}/${kebab}"

export const ${camel}Api = {
  page(params?: Partial<${className}PageQueryInput>) { return request.get<${className}PageData>(BASE, params) },
  get(id: string) { return request.get<${className}DO>(\`\${BASE}?id=\${id}\`) },
  create(data: ${className}CreateInput) { return request.post<{ id: string }>(BASE, data) },
  update(data: ${className}UpdateInput) { return request.put<boolean>(BASE, data) },
  delete(id: string) { return request.delete<boolean>(\`\${BASE}?id=\${id}\`) },${exportMethod}${importMethod}${workflowMethod}${dictionaryMethod}${treeMethod}
}
`
  return { path: `${getFrontendPath(config)}/api/${kebab}.api.ts`, content, type: "api" }
}

function generateFormComponent(config: CodegenConfig): CodegenOutput {
  const { className, businessName, moduleName, subModule } = config
  const camel = toCamel(className)
  const fields = formColumns(config)
  const masterDetailChildren = config.template === "MASTER_DETAIL" ? config.advanced?.model?.masterDetail?.children ?? [] : []
  const childMetadata = JSON.stringify(masterDetailChildren.map((child) => ({ code: child.code, label: child.code, display: child.display, fields: child.fields.filter((field) => field.name !== child.foreignKeyField && !isManagedColumn(field) && field.readOnly !== true && field.uiComponent !== "HIDDEN").map((field) => ({ name: field.name, label: field.comment || field.name, type: field.tsType, widget: field.widget, required: !field.nullable && field.defaultValueTyped === undefined, defaultValue: field.defaultValueTyped })) })))
  const masterDetailSupport = masterDetailChildren.length ? `
type ChildField = { name: string; label: string; type: string; widget?: string; required: boolean; defaultValue?: unknown }
type ChildMeta = { code: string; label: string; display: "TABLE" | "TABS"; fields: ChildField[] }
const MASTER_DETAIL_CHILDREN: ChildMeta[] = ${childMetadata}
function childDefaults(child: ChildMeta): Record<string, unknown> { return Object.fromEntries(child.fields.map((field) => [field.name, field.defaultValue ?? (field.type === "boolean" ? false : "")])) }
function initialChildren(value: unknown): Record<string, Array<Record<string, unknown>>> { const source = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; return Object.fromEntries(MASTER_DETAIL_CHILDREN.map((child) => [child.code, Array.isArray(source[child.code]) ? source[child.code].filter((row): row is Record<string, unknown> => Boolean(row && typeof row === "object" && !Array.isArray(row))) : []])) }
function ChildInput({ field, value, onChange }: { field: ChildField; value: unknown; onChange: (value: unknown) => void }) { if (field.widget === "JSON") return <textarea value={typeof value === "string" ? value : JSON.stringify(value ?? {}, null, 2)} onChange={(event) => onChange(event.target.value)} className="min-h-16 w-full rounded border px-2 py-1 font-mono text-xs" />; if (field.type === "boolean") return <select value={String(value ?? false)} onChange={(event) => onChange(event.target.value)} className="h-8 w-full rounded border px-2 text-xs"><option value="true">是</option><option value="false">否</option></select>; const type = field.type === "number" ? "number" : field.widget === "DATE" ? "date" : field.widget === "DATETIME" ? "datetime-local" : "text"; return <input type={type} required={field.required} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} className="h-8 w-full rounded border px-2 text-xs" /> }
function MasterDetailEditor({ value, onChange }: { value: Record<string, Array<Record<string, unknown>>>; onChange: (next: Record<string, Array<Record<string, unknown>>>) => void }) { const [active, setActive] = useState(MASTER_DETAIL_CHILDREN[0]?.code ?? ""); const visible = MASTER_DETAIL_CHILDREN.filter((child) => child.display === "TABLE" || child.code === active); return <section className="col-span-full space-y-3 rounded-lg border bg-slate-50 p-3"><div className="flex flex-wrap gap-2">{MASTER_DETAIL_CHILDREN.filter((child) => child.display === "TABS").map((child) => <button type="button" key={child.code} onClick={() => setActive(child.code)} className={active === child.code ? "rounded bg-slate-900 px-3 py-1 text-xs text-white" : "rounded border bg-white px-3 py-1 text-xs"}>{child.label}</button>)}</div>{visible.map((child) => <div key={child.code} className="rounded border bg-white p-3"><div className="mb-2 flex items-center justify-between"><strong className="text-sm">{child.label}</strong><button type="button" onClick={() => onChange({ ...value, [child.code]: [...(value[child.code] ?? []), childDefaults(child)] })} className="text-xs text-blue-600">+ 新增行</button></div><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr>{child.fields.map((field) => <th key={field.name} className="p-1 text-left font-medium text-slate-500">{field.label}{field.required ? " *" : ""}</th>)}<th className="p-1" /></tr></thead><tbody>{(value[child.code] ?? []).map((row, index) => <tr key={index}>{child.fields.map((field) => <td key={field.name} className="p-1"><ChildInput field={field} value={row[field.name]} onChange={(next) => { const rows = [...(value[child.code] ?? [])]; rows[index] = { ...rows[index], [field.name]: next }; onChange({ ...value, [child.code]: rows }) }} /></td>)}<td className="p-1"><button type="button" onClick={() => onChange({ ...value, [child.code]: (value[child.code] ?? []).filter((_, rowIndex) => rowIndex !== index) })} className="text-red-600">移除</button></td></tr>)}</tbody></table></div></div>)}</section>` : ""
  const childState = masterDetailChildren.length ? `
  const [children, setChildren] = useState<Record<string, Array<Record<string, unknown>>>>(() => initialChildren((initialData as Record<string, unknown> | undefined)?.children))` : ""
  const childSubmit = masterDetailChildren.length ? `
      for (const child of MASTER_DETAIL_CHILDREN) for (const row of children[child.code] ?? []) for (const field of child.fields) if (field.widget === "JSON" && typeof row[field.name] === "string" && row[field.name].trim()) { try { row[field.name] = JSON.parse(row[field.name] as string) } catch { setError(child.label + " 的 " + field.label + " 必须是合法 JSON"); return } }
      data.children = children` : ""
  const childEditor = masterDetailChildren.length ? `
          <MasterDetailEditor value={children} onChange={setChildren} />` : ""
  const readonlyFields = readonlyFormColumns(config)
  const dictionaryFields = config.moduleName === "online" ? fields.filter((column) => column.dictionaryCode && (column.widget === "DICTIONARY" || column.widget === "SELECT")) : []
  const dictionaryLoader = dictionaryFields.length ? `
  useEffect(() => { void Promise.all([${dictionaryFields.map((column) => `${camel}Api.dictionaryOptions("${config.table.name}", "${column.name}")`).join(", ")}]).then((responses) => setDictionaryOptions({${dictionaryFields.map((column, index) => ` "${column.name}": responses[${index}].data?.options ?? []`).join(",")} })) }, [])` : ""
  const sub = subModule ? `/${subModule}` : ""
  const formFields = fields.map((column) => {
    const label = column.comment || column.name
    const required = !column.nullable ? " required" : ""
    const defaultLiteral = column.defaultValueTyped === undefined ? "\"\"" : JSON.stringify(column.defaultValueTyped)
    const initialValue = `initialValue(initialData?.${column.name}, ${defaultLiteral})`
    if (column.widget === "JSON" || column.type === "json" || column.type === "jsonb") return `        <label className="text-sm md:col-span-2"><span className="mb-1 block text-slate-600">${label}${required ? " *" : ""}</span><textarea name="${column.name}" defaultValue={jsonValue(initialData?.${column.name}, ${defaultLiteral})} placeholder="请输入合法 JSON" className="min-h-28 w-full rounded-md border px-3 py-2 font-mono text-sm"${required} /></label>`
    if (column.tsType === "boolean") return `        <label className="text-sm"><span className="mb-1 block text-slate-600">${label}</span><select name="${column.name}" defaultValue={String(initialData?.${column.name} ?? ${defaultLiteral})} className="h-9 w-full rounded-md border px-3 text-sm"><option value="true">是</option><option value="false">否</option></select></label>`
    if (column.enumValues?.length) return `        <label className="text-sm"><span className="mb-1 block text-slate-600">${label}${required ? " *" : ""}</span><select name="${column.name}" defaultValue={${initialValue}} className="h-9 w-full rounded-md border px-3 text-sm"${required}><option value="">请选择</option>${column.enumValues.map((value) => `<option value="${value}">${value}</option>`).join("")}</select></label>`
    if ((column.widget === "DICTIONARY" || column.widget === "SELECT") && column.dictionaryCode) return `        <label className="text-sm"><span className="mb-1 block text-slate-600">${label}${required ? " *" : ""}</span><select name="${column.name}" defaultValue={${initialValue}} className="h-9 w-full rounded-md border px-3 text-sm"${required}><option value="">请选择</option>{(dictionaryOptions.${column.name} ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>`
    if (column.widget === "REFERENCE" || column.widget === "SELECT") return `        <label className="text-sm"><span className="mb-1 block text-slate-600">${label}${required ? " *" : ""}</span><input name="${column.name}" defaultValue={${initialValue}} placeholder="${column.widget === "REFERENCE" ? "请输入已验证关联值" : `请输入${label}`}" className="h-9 w-full rounded-md border px-3 text-sm"${required} /><span className="mt-1 block text-xs text-slate-400">选项由发布时的受控查询契约提供</span></label>`
    if (column.uiComponent === "TEXTAREA" || column.uiComponent === "RICH_TEXT" || column.widget === "TEXTAREA") return `        <label className="text-sm md:col-span-2"><span className="mb-1 block text-slate-600">${label}${required ? " *" : ""}</span><textarea name="${column.name}" defaultValue={${initialValue}} placeholder="请输入${label}" className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"${required} /></label>`
    const type = column.uiComponent === "NUMBER" || column.widget === "NUMBER" ? "number" : column.uiComponent === "DATE" || column.widget === "DATE" ? "date" : column.uiComponent === "DATETIME" || column.widget === "DATETIME" ? "datetime-local" : /password|secret|api[_-]?key|token/i.test(column.name) ? "password" : "text"
    return `        <label className="text-sm"><span className="mb-1 block text-slate-600">${label}${required ? " *" : ""}</span><input type="${type}" name="${column.name}" defaultValue={${initialValue}} placeholder="请输入${label}" className="h-9 w-full rounded-md border px-3 text-sm"${required} /></label>`
  }).join("\n")
  const readonlyDefs = readonlyFields.map((column) => `          <div className="rounded-md bg-slate-50 px-3 py-2 text-sm"><span className="block text-xs text-slate-500">${column.comment || column.name}（只读）</span><span>{formatValue(initialData?.${column.name})}</span></div>`).join("\n")
  const content = `// Auto-generated by Codegen Engine
"use client"

import { useEffect, useState } from "react"
${masterDetailSupport}
${dictionaryFields.length ? `import { ${camel}Api } from "../api/${toKebab(className)}.api"` : ""}
import type { ${className}DO } from "@/modules/${moduleName}${sub}/backend/types/${toKebab(className)}.types"
import type { ${className}CreateInput, ${className}UpdateInput } from "@/modules/${moduleName}${sub}/backend/validators/${toKebab(className)}.validator"

type FormSubmitResult = { success: boolean; error?: string }
type Props = { mode: "create" | "edit"; initialData?: ${className}DO; onSubmit: (data: ${className}CreateInput | ${className}UpdateInput) => Promise<FormSubmitResult>; onCancel: () => void }

function initialValue(value: unknown, fallback: unknown): string { const resolved = value ?? fallback; return resolved === undefined || resolved === null ? "" : String(resolved) }
function jsonValue(value: unknown, fallback: unknown): string { const resolved = value ?? fallback; return resolved === undefined || resolved === null || resolved === "" ? "" : typeof resolved === "string" ? resolved : JSON.stringify(resolved, null, 2) }
function formatValue(value: unknown): string { return value === undefined || value === null ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value) }

export function ${className}Form({ mode, initialData, onSubmit, onCancel }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dictionaryOptions, setDictionaryOptions] = useState<Record<string, Array<{ value: string; label: string }>>>({})${dictionaryLoader}${childState}
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError(null)
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string, unknown>
${fields.filter((column) => column.widget === "JSON" || column.type === "json" || column.type === "jsonb").map((column) => `      if (typeof data.${column.name} === "string" && data.${column.name}.trim()) { try { data.${column.name} = JSON.parse(data.${column.name}) } catch { setError("${column.comment || column.name} 必须是合法 JSON"); return } }`).join("\n")}${childSubmit}
      const result = await onSubmit(mode === "edit" ? { ...data, id: initialData!.id } as ${className}UpdateInput : data as ${className}CreateInput)
      if (!result.success) setError(result.error || "操作失败，请稍后重试")
    } finally { setLoading(false) }
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"><h2 className="mb-4 text-base font-semibold">{mode === "create" ? "新增" : "编辑"}${businessName}</h2><form onSubmit={(event) => void handleSubmit(event)} className="grid gap-4 md:grid-cols-2">
${formFields || "          <p className=\"text-sm text-slate-400\">当前未配置表单字段。</p>"}
${childEditor}
${readonlyDefs}
          {error && <p className="col-span-full rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="col-span-full flex justify-end gap-2 pt-3"><button type="button" onClick={onCancel} className="h-9 rounded-md border px-4 text-sm">取消</button><button type="submit" disabled={loading} className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white disabled:opacity-50">{loading ? "提交中..." : "确认"}</button></div>
        </form></div></div>
}
`
  return { path: `${getFrontendPath(config)}/components/${className}Form.tsx`, content, type: "component" }
}

function generateAppPageEntry(config: CodegenConfig): CodegenOutput {
  const { className, moduleName, subModule } = config
  const kebab = toKebab(className)
  const sub = subModule ? `/${subModule}` : ""

  const content = `export { default } from "@/modules/${moduleName}${sub}/frontend/pages/${kebab}-list.page"
`
  return { path: `src/app/(admin-pages)/admin/${moduleName}${sub}/${kebab}/page.tsx`, content, type: "page" }
}

function generateManifest(config: CodegenConfig, outputs: CodegenOutput[]): CodegenOutput {
  const kebab = toKebab(config.className)
  const camel = toCamel(config.className)
  const manifest = {
    contractVersion: "1.0.0",
    generator: "ruoyi-all-next-codegen",
    template: config.template,
    outputMode: "reviewable-zip-only",
    rpcActions: {
      domain: config.moduleName,
      note: "Review then merge into src/modules/shared/backend/constants/rpc-actions.json; do not auto-write the catalog.",
      actions: [
        { method: `page${config.className}`, schema: `${camel}PageQuerySchema`, service: `${config.className}Service`, module: `${kebab}.service`, target: "page" },
        { method: `get${config.className}`, schema: `${camel}GetSchema`, service: `${config.className}Service`, module: `${kebab}.service`, target: "get" },
        { method: `create${config.className}`, schema: `${camel}CreateSchema`, service: `${config.className}Service`, module: `${kebab}.service`, target: "create" },
        { method: `update${config.className}`, schema: `${camel}UpdateSchema`, service: `${config.className}Service`, module: `${kebab}.service`, target: "update" },
        { method: `delete${config.className}`, schema: `${camel}DeleteSchema`, service: `${config.className}Service`, module: `${kebab}.service`, target: "delete" },
      ],
    },
    outputs: outputs.map(({ path, type }) => ({ path, type })),
  }
  return { path: "codegen-manifest.json", content: `${JSON.stringify(manifest, null, 2)}\n`, type: "manifest" }
}

function generateTest(config: CodegenConfig): CodegenOutput {
  if (config.onlineRuntime?.storageKind === "MANAGED_TABLE") return generateManagedOnlineTest(config)
  const { className, moduleName, businessName } = config
  const kebab = toKebab(className)

  const content = `// Auto-generated by Codegen Engine
import { describe, expect, it } from "vitest"
import { ${className}Service } from "../services/${kebab}.service"

describe("${className}Service", () => {
  it("page returns paginated results", async () => {
    const result = await ${className}Service.page({ page: 1, pageSize: 20 })
    expect(result).toHaveProperty("items")
    expect(result).toHaveProperty("total")
  })

  it("create and get", async () => {
    const { id } = await ${className}Service.create({ name: "test-${kebab}" } as any)
    expect(id).toBeTruthy()
    const item = await ${className}Service.get(id)
    expect(item.id).toBe(id)
  })

  it("delete non-existent throws", async () => {
    await expect(${className}Service.delete("not-exist")).rejects.toThrow("${businessName}不存在")
  })
})
`
  return { path: `${getBackendPath(config)}/services/__tests__/${kebab}.service.test.ts`, content, type: "test" }
}


function generateManagedOnlineService(config: CodegenConfig): CodegenOutput {
  const { className, moduleName } = config
  const kebab = toKebab(className)
  const camel = toCamel(className)
  const runtime = config.onlineRuntime!
  const content = `// Auto-generated by Codegen Engine
// Immutable Online release binding; do not accept table, tenant, or release input from clients.
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { onlineFacade } from "@/modules/online/contract/online.facade"
import type { ${className}PageQueryInput, ${className}CreateInput, ${className}UpdateInput } from "../validators/${kebab}.validator"

type Scope = { tenantId: string; actorId: string }
const runtime = { definitionCode: ${JSON.stringify(runtime.definitionCode)}, releaseId: ${JSON.stringify(runtime.releaseId)}, schemaRevision: ${runtime.schemaRevision} } as const
async function unwrap<T>(result: { success: boolean; error?: string; data?: unknown }, fallback: string): Promise<T> {
  if (!result.success) {
    const message = result.error ?? fallback
    if (message.includes("不存在")) throw new ApiError("NOT_FOUND", message)
    if (message.includes("未启用")) throw new ApiError("FORBIDDEN", message)
    if (message.includes("过期") || message.includes("不一致") || message.includes("无效")) throw new ApiError("CONFLICT", message)
    throw new ApiError("INTERNAL_ERROR", message)
  }
  return result.data as T
}
export class ${className}Service {
  static async page(scope: Scope, input: ${className}PageQueryInput) {
    const conditions = Object.entries(input).filter(([key]) => !["page", "pageSize"].includes(key)).map(([field, value]) => ({ field, value: value as string | number | boolean | null | Array<string | number | boolean | null> }))
    return unwrap(await onlineFacade.pageManagedRecords({ ...scope, ...runtime, page: input.page, pageSize: input.pageSize, conditions }, { caller: "${moduleName}.${camel}" }), "online pageManagedRecords 调用失败")
  }
  static async get(scope: Scope, id: string) { return unwrap(await onlineFacade.getManagedRecord({ ...scope, ...runtime, id }, { caller: "${moduleName}.${camel}" }), "online getManagedRecord 调用失败") }
  static async create(scope: Scope, input: ${className}CreateInput) { const data = await unwrap<Record<string, unknown>>(await onlineFacade.createManagedRecord({ ...scope, ...runtime, data: input }, { caller: "${moduleName}.${camel}" }), "online createManagedRecord 调用失败"); domainLog.audit("${moduleName}.${camel}.create", { targetType: "ONLINE_${className.toUpperCase()}", targetId: String(data.id) }); return data }
  static async update(scope: Scope, input: ${className}UpdateInput) { const { id, ...data } = input; const result = await unwrap<Record<string, unknown>>(await onlineFacade.updateManagedRecord({ ...scope, ...runtime, id, data }, { caller: "${moduleName}.${camel}" }), "online updateManagedRecord 调用失败"); domainLog.audit("${moduleName}.${camel}.update", { targetType: "ONLINE_${className.toUpperCase()}", targetId: id }); return result }
  static async delete(scope: Scope, id: string) { await unwrap(await onlineFacade.deleteManagedRecord({ ...scope, ...runtime, id }, { caller: "${moduleName}.${camel}" }), "online deleteManagedRecord 调用失败"); domainLog.audit("${moduleName}.${camel}.delete", { targetType: "ONLINE_${className.toUpperCase()}", targetId: id }) }
}
`
  return { path: `${getBackendPath(config)}/services/${kebab}.service.ts`, content, type: "service" }
}

function generateManagedOnlineRoute(config: CodegenConfig): CodegenOutput {
  const { className, moduleName, subModule } = config
  const kebab = toKebab(className)
  const sub = subModule ? `/${subModule}` : ""
  const schemas = `${toScreaming(className)}_ACTION_SCHEMAS`
  const content = `// Auto-generated by Codegen Engine
import { NextResponse } from "next/server"
import { ${className}Service } from "@/modules/${moduleName}${sub}/backend/services/${kebab}.service"
import { ${schemas} } from "@/modules/${moduleName}${sub}/contract/${kebab}.actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
function scope(auth: { tenantId?: string; userId: string }) { if (!auth.tenantId) throw new ApiError("FORBIDDEN", "Tenant scope is required"); return { tenantId: auth.tenantId, actorId: auth.userId } }
export const GET = withAdminRoute(async (request, auth) => { const id = new URL(request.url).searchParams.get("id"); if (id) return NextResponse.json({ success: true, data: await ${className}Service.get(scope(auth), parseActionBody(${schemas}["${actionName(config, "get")}"], { id }).id) }); const input = parseActionQuery(${schemas}["${actionName(config, "page")}"], request); return NextResponse.json({ success: true, data: await ${className}Service.page(scope(auth), input) }) }, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_QUERY })
export const POST = withAdminRoute(async (request, auth) => { const input = parseActionBody(${schemas}["${actionName(config, "create")}"], await request.json()); return NextResponse.json({ success: true, data: await ${className}Service.create(scope(auth), input) }, { status: 201 }) }, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_CREATE })
export const PUT = withAdminRoute(async (request, auth) => { const input = parseActionBody(${schemas}["${actionName(config, "update")}"], await request.json()); return NextResponse.json({ success: true, data: await ${className}Service.update(scope(auth), input) }) }, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_UPDATE })
export const DELETE = withAdminRoute(async (request, auth) => { const input = parseActionBody(${schemas}["${actionName(config, "delete")}"], { id: new URL(request.url).searchParams.get("id") }); await ${className}Service.delete(scope(auth), input.id); return NextResponse.json({ success: true }) }, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_DELETE })
`
  return { path: `src/app/api/v1/admin/${moduleName}${sub}/${kebab}/route.ts`, content, type: "route" }
}

function generateManagedOnlineTest(config: CodegenConfig): CodegenOutput {
  const { className } = config
  const kebab = toKebab(className)
  const content = `import { describe, expect, it } from "vitest"
import { ${className}Service } from "../${kebab}.service"
describe("${className}Service managed runtime", () => { it("exports scoped CRUD operations", () => { expect(${className}Service.page).toBeTypeOf("function"); expect(${className}Service.create).toBeTypeOf("function") }) })
`
  return { path: `${getBackendPath(config)}/services/__tests__/${kebab}.service.test.ts`, content, type: "test" }
}
