"use client"

import type { OnlineFieldInteractionIR } from "@/modules/online/backend/application/online-interaction.compiler"
import type { OnlineFieldIR } from "@/modules/online/backend/application/online-schema-plan.contract"

const CHILDREN_KEY = "__onlineChildren"
export const ONLINE_CHILDREN_KEY = CHILDREN_KEY

const control = "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"

export type DictOption = { value: string; label: string }
export type FieldWidgetProps = {
  field: OnlineFieldIR
  interaction: OnlineFieldInteractionIR
  value: unknown
  disabled?: boolean
  options?: DictOption[]
  onChange: (value: unknown) => void
}

export function writableFields(interactions: OnlineFieldInteractionIR[], models: OnlineFieldIR[], visibility: "form" | "list" | "detail" | "query") {
  const modelByCode = new Map(models.map((field) => [field.code, field]))
  return interactions.flatMap((interaction) => {
    const field = modelByCode.get(interaction.code)
    if (!field) return []
    if (visibility === "query") return interaction.query.enabled ? [{ field, interaction }] : []
    if (visibility === "form" && (field.systemManaged || interaction.readOnly || !interaction.visibility.form)) return []
    if (visibility === "list" && !interaction.visibility.list) return []
    if (visibility === "detail" && !interaction.visibility.detail) return []
    return [{ field, interaction }]
  })
}

export function displayValue(value: unknown, formatter?: string) {
  if (value === null || value === undefined || value === "") return "—"
  if (formatter === "BOOLEAN") return value === true ? "是" : "否"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

export function coerceFieldValue(field: OnlineFieldIR, raw: unknown): unknown {
  if (raw === "" || raw === undefined) return field.nullable ? null : undefined
  if (field.type === "boolean") return raw === true || raw === "true"
  if (field.type === "integer") { const value = typeof raw === "number" ? raw : Number.parseInt(String(raw), 10); return Number.isInteger(value) ? value : raw }
  if (field.type === "decimal") { const value = typeof raw === "number" ? raw : Number(raw); return Number.isFinite(value) ? value : raw }
  if (field.type === "json") {
    if (typeof raw !== "string") return raw
    try { return JSON.parse(raw) } catch { return raw }
  }
  return raw
}

export function recordFormValues(data: Record<string, unknown>, fields: Array<{ field: OnlineFieldIR; interaction: OnlineFieldInteractionIR }>) {
  return Object.fromEntries(fields.map(({ field }) => [field.code, data[field.code] ?? field.default ?? (field.type === "boolean" ? false : "")]))
}

export function extractChildren(data: Record<string, unknown>): Record<string, Array<Record<string, unknown>>> {
  const raw = data[CHILDREN_KEY]
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
  return Object.fromEntries(Object.entries(raw as Record<string, unknown>).map(([code, rows]) => [code, Array.isArray(rows) ? rows.filter((row) => row && typeof row === "object" && !Array.isArray(row)) as Array<Record<string, unknown>> : []]))
}

export function OnlineFieldWidget({ field, interaction, value, disabled, options, onChange }: FieldWidgetProps) {
  const widget = interaction.widget
  if (widget === "SWITCH" || field.type === "boolean") {
    return <input type="checkbox" checked={value === true} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-blue-600" />
  }
  if (widget === "TEXTAREA" || field.type === "text" || widget === "JSON") {
    return <textarea disabled={disabled} rows={3} value={widget === "JSON" ? (typeof value === "string" ? value : JSON.stringify(value ?? "", null, 2)) : String(value ?? "")} onChange={(event) => onChange(event.target.value)} placeholder={interaction.form.placeholder} className={`${control} min-h-[72px] py-2`} />
  }
  if (widget === "SELECT" || widget === "DICTIONARY") {
    return <select disabled={disabled} value={value == null ? "" : String(value)} onChange={(event) => onChange(event.target.value)} className={control}><option value="">请选择</option>{(options ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
  }
  const type = field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : field.type === "integer" || field.type === "decimal" ? "number" : "text"
  return <input disabled={disabled} type={type} step={field.type === "decimal" ? "any" : undefined} value={value == null ? "" : String(value)} onChange={(event) => onChange(event.target.value)} placeholder={interaction.form.placeholder ?? interaction.label} className={control} />
}

export function OnlineFormGrid({ fields, values, disabled, options, onChange }: { fields: Array<{ field: OnlineFieldIR; interaction: OnlineFieldInteractionIR }>; values: Record<string, unknown>; disabled?: boolean; options: Record<string, DictOption[]>; onChange: (code: string, value: unknown) => void }) {
  return <div className="flex flex-wrap gap-x-4 gap-y-3">{fields.map(({ field, interaction }) => <label key={field.code} className={`grid gap-1 text-sm text-slate-600 ${(interaction.form.span || 12) >= 18 ? "w-full" : "w-full md:w-[calc(50%-0.5rem)]"}`}><span>{interaction.label}{!field.nullable && <b className="ml-1 text-rose-600">*</b>}</span><OnlineFieldWidget field={field} interaction={interaction} value={values[field.code]} disabled={disabled || interaction.readOnly} options={options[field.code]} onChange={(value) => onChange(field.code, value)} /></label>)}</div>
}
