import { z } from "zod"

/**
 * 端无关「页面 Schema」——低代码底座核心。
 * 客户在后台可视化加字段/改页面 → 产出这份 JSON → B 端(Web) 与 C 端(portal Web / Expo) 各自的
 * Schema 驱动渲染器据此渲染列表/表单。零 DDL：字段值存实体的 extra_fields(JSON)，加字段立刻生效、跨库、预览即可验证。
 */

/** 单个动态字段定义 */
export const fieldDefSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/, "字段编码需字母开头、字母数字下划线，≤40 位"),
  label: z.string().trim().min(1, "字段名称不能为空").max(60),
  type: z.enum(["text", "textarea", "number", "boolean", "date", "select", "image"]).default("text"),
  required: z.boolean().default(false),
  showInList: z.boolean().default(true),
  showInForm: z.boolean().default(true),
  /** select 类型的选项 */
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  placeholder: z.string().max(120).optional(),
  sort: z.coerce.number().int().default(0),
})

export type FieldDef = z.infer<typeof fieldDefSchema>

/** 一个实体绑定的页面 Schema */
export const pageSchemaSchema = z.object({
  /** 绑定的实体（如 member_user） */
  entity: z.string().trim().min(1),
  /** 页面标题 */
  title: z.string().trim().max(60).default(""),
  /** 端：目前 web / expo 共用同一 fields，端无关 */
  fields: z.array(fieldDefSchema).default([]),
})

export type PageSchema = z.infer<typeof pageSchemaSchema>

export const pageSchemaUpdateSchema = z.object({
  title: z.string().trim().max(60).optional(),
  fields: z.array(fieldDefSchema).optional(),
})

export function defaultPageSchema(entity: string): PageSchema {
  return { entity, title: "", fields: [] }
}

/** 校验一条动态字段值是否符合定义（用于 C 端提交/后台录入时的服务端校验） */
export function validateExtraValues(fields: FieldDef[], values: Record<string, unknown>): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const out: Record<string, unknown> = {}
  for (const f of fields) {
    const v = values[f.code]
    if (f.required && (v === undefined || v === null || v === "")) {
      return { ok: false, error: `字段「${f.label}」必填` }
    }
    if (v === undefined) continue
    if (f.type === "number" && v !== "" && Number.isNaN(Number(v))) return { ok: false, error: `字段「${f.label}」必须为数字` }
    out[f.code] = f.type === "number" ? Number(v) : f.type === "boolean" ? Boolean(v) : v
  }
  return { ok: true, value: out }
}
