"use client"

import React from "react"
import type { FieldDef } from "@/modules/member/frontend/pages/portal-shared"

/**
 * Schema 驱动渲染器（Web 版）—— 低代码底座核心：
 * 后台加一个字段 → 这里自动多出一项展示/输入，无需改代码。
 * 端无关的「字段定义」→ 端相关的渲染（此为 Web；Expo 端另有一套同协议渲染器）。
 */

/** 只读展示：把一组字段 + 值渲染成详情列表 */
export function SchemaDetailView({ fields, values }: { fields: FieldDef[]; values: Record<string, unknown> }) {
  const shown = fields.filter((f) => f.showInList !== false).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  if (shown.length === 0) return null
  return (
    <dl className="grid grid-cols-2 gap-4 text-sm">
      {shown.map((f) => (
        <div key={f.code}>
          <dt className="text-slate-400">{f.label}</dt>
          <dd className="font-medium">{formatValue(f, values[f.code])}</dd>
        </div>
      ))}
    </dl>
  )
}

/** 表单：把一组字段渲染成可录入表单（受控） */
export function SchemaForm({
  fields,
  values,
  onChange,
}: {
  fields: FieldDef[]
  values: Record<string, unknown>
  onChange: (code: string, value: unknown) => void
}) {
  const shown = fields.filter((f) => f.showInForm !== false).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  return (
    <div className="space-y-3">
      {shown.map((f) => (
        <div key={f.code}>
          <label className="block text-[12px] text-slate-500 mb-1">
            {f.label}
            {f.required ? <span className="text-red-500 ml-0.5">*</span> : null}
          </label>
          <FieldInput field={f} value={values[f.code]} onChange={(v) => onChange(f.code, v)} />
        </div>
      ))}
    </div>
  )
}

function formatValue(f: FieldDef, v: unknown): string {
  if (v === undefined || v === null || v === "") return "—"
  if (f.type === "boolean") return v ? "是" : "否"
  if (f.type === "select") return f.options?.find((o) => o.value === String(v))?.label ?? String(v)
  return String(v)
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const base = "w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
  const style = { borderRadius: "var(--radius, 8px)" }
  switch (field.type) {
    case "textarea":
      return <textarea className={`${base} h-20 resize-none`} style={style} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
    case "number":
      return <input type="number" className={base} style={style} value={value === undefined || value === null ? "" : String(value)} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
    case "boolean":
      return (
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span className="text-slate-500">{value ? "是" : "否"}</span>
        </label>
      )
    case "date":
      return <input type="date" className={base} style={style} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
    case "select":
      return (
        <select className={base} style={style} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          <option value="">请选择</option>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )
    case "image":
      return <input type="url" className={base} style={style} value={String(value ?? "")} placeholder={field.placeholder || "图片 URL"} onChange={(e) => onChange(e.target.value)} />
    default:
      return <input type="text" className={base} style={style} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
  }
}
