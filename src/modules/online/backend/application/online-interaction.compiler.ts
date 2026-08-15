import { z } from "zod"
import type { OnlineModelType } from "./online-definition.contract"
import type { OnlineModelIR } from "./online-schema-plan.contract"

const code = z.string().regex(/^[a-z][a-z0-9_]{1,63}$/, "标识必须以小写字母开头，仅允许小写字母、数字和下划线")
const fieldInteractionSchema = z.object({
  code,
  label: z.string().trim().min(1).max(100),
  widget: z.enum(["TEXT", "TEXTAREA", "NUMBER", "SWITCH", "DATE", "DATETIME", "SELECT", "DICTIONARY", "REFERENCE", "JSON"]),
  query: z.object({ enabled: z.boolean().default(false), operator: z.enum(["EQ", "NE", "LIKE", "IN", "GT", "GTE", "LT", "LTE", "BETWEEN"]).optional() }).strict().default({ enabled: false }),
  visibility: z.object({ list: z.boolean().default(true), form: z.boolean().default(true), detail: z.boolean().default(true) }).strict().default({ list: true, form: true, detail: true }),
  readOnly: z.boolean().default(false),
  dictionaryCode: code.optional(),
}).strict()
const treeSchema = z.object({ parentField: code, sortField: code.optional(), rootValue: z.union([z.string(), z.number(), z.null()]).optional(), childrenIndicator: z.boolean().default(false) }).strict()
const masterDetailChildSchema = z.object({ code, targetDefinitionCode: code, foreignKeyField: code, display: z.enum(["TABLE", "TABS"]).default("TABLE") }).strict()
export const onlineInteractionIrSchema = z.object({
  version: z.literal(1).default(1),
  fields: z.array(fieldInteractionSchema).max(128).default([]),
  tree: treeSchema.optional(),
  masterDetail: z.object({ children: z.array(masterDetailChildSchema).min(1).max(16) }).strict().optional(),
}).strict()

export type OnlineFieldInteractionIR = {
  code: string
  label: string
  widget: "TEXT" | "TEXTAREA" | "NUMBER" | "SWITCH" | "DATE" | "DATETIME" | "SELECT" | "DICTIONARY" | "REFERENCE" | "JSON"
  query: { enabled: boolean; operator?: "EQ" | "NE" | "LIKE" | "IN" | "GT" | "GTE" | "LT" | "LTE" | "BETWEEN" }
  visibility: { list: boolean; form: boolean; detail: boolean }
  readOnly: boolean
  dictionaryCode?: string
}
export type OnlineInteractionIR = {
  version: 1
  fields: OnlineFieldInteractionIR[]
  tree?: { parentField: string; sortField?: string; rootValue?: string | number | null; childrenIndicator: boolean }
  masterDetail?: { children: Array<{ code: string; targetDefinitionCode: string; foreignKeyField: string; display: "TABLE" | "TABS" }> }
}

function unique(items: Array<{ code: string }>, label: string): void {
  if (new Set(items.map((item) => item.code)).size !== items.length) throw new Error(`${label} code 不可重复`)
}

export function parseOnlineInteractionIR(value: unknown, model: OnlineModelIR): OnlineInteractionIR {
  const interaction = onlineInteractionIrSchema.parse(value ?? {}) as OnlineInteractionIR
  unique(interaction.fields, "字段交互")
  const modelFields = new Set(model.fields.map((field) => field.code))
  for (const field of interaction.fields) {
    if (!modelFields.has(field.code)) throw new Error(`字段交互引用了不存在字段 ${field.code}`)
    if (field.dictionaryCode && field.widget !== "DICTIONARY" && field.widget !== "SELECT") throw new Error(`字段 ${field.code} 的 dictionaryCode 仅可用于 DICTIONARY 或 SELECT 控件`)
    if (field.query.enabled && !field.query.operator) throw new Error(`查询字段 ${field.code} 必须声明 operator`)
  }
  return { ...interaction, fields: [...interaction.fields].sort((left, right) => left.code.localeCompare(right.code)) }
}
