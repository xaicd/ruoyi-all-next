import { z } from "zod"
import type { OnlineModelType } from "./online-definition.contract"
import type { OnlineModelIR } from "./online-schema-plan.contract"

const code = z.string().regex(/^[a-z][a-z0-9_]{1,63}$/, "标识必须以小写字母开头，仅允许小写字母、数字和下划线")
const widgets = ["TEXT", "TEXTAREA", "NUMBER", "SWITCH", "DATE", "DATETIME", "SELECT", "DICTIONARY", "REFERENCE", "JSON"] as const
const queryOperators = ["EQ", "NE", "LIKE", "IN", "GT", "GTE", "LT", "LTE", "BETWEEN"] as const
const ruleKeys = ["EMAIL", "MOBILE", "IDENTIFIER"] as const
const fieldInteractionSchema = z.object({
  code,
  label: z.string().trim().min(1).max(100),
  widget: z.enum(widgets),
  query: z.object({ enabled: z.boolean().default(false), operator: z.enum(queryOperators).optional(), widget: z.enum(widgets).optional(), defaultValue: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(), required: z.boolean().default(false) }).strict().default({ enabled: false }),
  visibility: z.object({ list: z.boolean().default(true), form: z.boolean().default(true), detail: z.boolean().default(true) }).strict().default({ list: true, form: true, detail: true }),
  list: z.object({ order: z.number().int().min(0).max(127).optional(), width: z.number().int().min(60).max(800).optional(), sortable: z.boolean().default(false), summary: z.boolean().default(false) }).strict().default({ sortable: false, summary: false }),
  form: z.object({ order: z.number().int().min(0).max(127).optional(), span: z.number().int().min(1).max(24).default(12), placeholder: z.string().trim().max(120).optional() }).strict().default({ span: 12 }),
  detail: z.object({ order: z.number().int().min(0).max(127).optional(), formatter: z.enum(["PLAIN", "DATE", "DATETIME", "BOOLEAN", "DICTIONARY"]).default("PLAIN") }).strict().default({ formatter: "PLAIN" }),
  validation: z.object({ ruleKeys: z.array(z.enum(ruleKeys)).max(3).default([]), minLength: z.number().int().min(0).max(65535).optional(), maxLength: z.number().int().min(1).max(65535).optional(), min: z.number().finite().optional(), max: z.number().finite().optional() }).strict().default({ ruleKeys: [] }),
  readOnly: z.boolean().default(false),
  dictionaryCode: code.optional(),
}).strict()
const settingsSchema = z.object({ category: code.default("general"), identityStrategy: z.enum(["PLATFORM_UUID", "MANUAL"]).default("PLATFORM_UUID"), list: z.object({ pagination: z.boolean().default(true), selection: z.boolean().default(false), layout: z.enum(["TABLE", "CARD"]).default("TABLE") }).strict().default({ pagination: true, selection: false, layout: "TABLE" }), form: z.object({ layout: z.enum(["GRID", "TABS", "DRAWER", "DIALOG"]).default("GRID"), theme: z.enum(["DEFAULT", "COMPACT"]).default("DEFAULT"), horizontalScroll: z.boolean().default(false) }).strict().default({ layout: "GRID", theme: "DEFAULT", horizontalScroll: false }) }).strict().default({ category: "general", identityStrategy: "PLATFORM_UUID", list: { pagination: true, selection: false, layout: "TABLE" }, form: { layout: "GRID", theme: "DEFAULT", horizontalScroll: false } })
const actionSchema = z.object({ code, label: z.string().trim().min(1).max(80), type: z.enum(["CREATE", "UPDATE", "DELETE", "EXPORT", "IMPORT", "SUBMIT_WORKFLOW"]), placement: z.enum(["TOOLBAR", "ROW", "FORM_FOOTER"]), order: z.number().int().min(0).max(127).default(0), enabled: z.boolean().default(true) }).strict()
const treeSchema = z.object({ parentField: code, sortField: code.optional(), rootValue: z.union([z.string(), z.number(), z.null()]).optional(), childrenIndicator: z.boolean().default(false) }).strict()
const masterDetailChildSchema = z.object({ code, targetDefinitionCode: code, foreignKeyField: code, display: z.enum(["TABLE", "TABS"]).default("TABLE") }).strict()
export const onlineInteractionIrSchema = z.object({
  version: z.literal(1).default(1), settings: settingsSchema,
  fields: z.array(fieldInteractionSchema).max(128).default([]),
  actions: z.array(actionSchema).max(32).default([]),
  tree: treeSchema.optional(),
  masterDetail: z.object({ children: z.array(masterDetailChildSchema).min(1).max(16) }).strict().optional(),
}).strict()

export type OnlineFieldInteractionIR = z.infer<typeof fieldInteractionSchema>
export type OnlineInteractionSettingsIR = z.infer<typeof settingsSchema>
export type OnlineActionIR = z.infer<typeof actionSchema>
export type OnlineInteractionIR = {
  version: 1
  settings: OnlineInteractionSettingsIR
  fields: OnlineFieldInteractionIR[]
  actions: OnlineActionIR[]
  tree?: { parentField: string; sortField?: string; rootValue?: string | number | null; childrenIndicator: boolean }
  masterDetail?: { children: Array<{ code: string; targetDefinitionCode: string; foreignKeyField: string; display: "TABLE" | "TABS" }> }
}

function unique(items: Array<{ code: string }>, label: string): void {
  if (new Set(items.map((item) => item.code)).size !== items.length) throw new Error(`${label} code 不可重复`)
}

export function parseOnlineInteractionIR(value: unknown, model: OnlineModelIR): OnlineInteractionIR {
  const interaction = onlineInteractionIrSchema.parse(value ?? {}) as OnlineInteractionIR
  unique(interaction.fields, "字段交互")
  unique(interaction.actions, "内置动作")
  const modelFields = new Set(model.fields.map((field) => field.code))
  for (const field of interaction.fields) {
    if (!modelFields.has(field.code)) throw new Error(`字段交互引用了不存在字段 ${field.code}`)
    if (field.dictionaryCode && field.widget !== "DICTIONARY" && field.widget !== "SELECT") throw new Error(`字段 ${field.code} 的 dictionaryCode 仅可用于 DICTIONARY 或 SELECT 控件`)
    if (field.query.enabled && !field.query.operator) throw new Error(`查询字段 ${field.code} 必须声明 operator`)
    if (field.query.widget === "REFERENCE") throw new Error(`查询字段 ${field.code} 不支持 REFERENCE 控件`)
    if (field.validation.minLength !== undefined && field.validation.maxLength !== undefined && field.validation.minLength > field.validation.maxLength) throw new Error(`字段 ${field.code} 的最小长度不能大于最大长度`)
    if (field.validation.min !== undefined && field.validation.max !== undefined && field.validation.min > field.validation.max) throw new Error(`字段 ${field.code} 的最小值不能大于最大值`)
    if (field.widget === "REFERENCE" && !model.relations.some((relation) => relation.sourceField === field.code)) throw new Error(`REFERENCE 字段 ${field.code} 必须声明同字段 Relation`)
  }
  return { ...interaction, fields: [...interaction.fields].sort((left, right) => left.code.localeCompare(right.code)), actions: [...interaction.actions].sort((left, right) => left.code.localeCompare(right.code)) }
}
