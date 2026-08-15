"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { OnlineJeecgConfigurationTabs } from "@/modules/online/frontend/components/online-jeecg-config-tables"
import type { OnlineDefinitionDetail } from "@/modules/online/backend/application/online-definition.contract"
import { request } from "@/modules/shared/frontend/lib/request"

const endpoint = "/api/v1/admin/online/definitions"
const exampleModel = {
  version: 1,
  storage: { kind: "GENERIC_RECORD" },
  fields: [{ code: "name", type: "string", nullable: false, length: 100, remark: "业务名称" }],
  indexes: [],
  relations: [],
}
const exampleInteraction = {
  version: 1,
  settings: { category: "general", identityStrategy: "PLATFORM_UUID", list: { pagination: true, selection: false, layout: "TABLE" }, form: { layout: "GRID", theme: "DEFAULT", horizontalScroll: false } },
  fields: [{ code: "name", label: "名称", widget: "TEXT", query: { enabled: true, operator: "LIKE" }, visibility: { list: true, form: true, detail: true }, list: { sortable: true, summary: false }, form: { span: 12 }, detail: { formatter: "PLAIN" }, validation: { ruleKeys: [] }, readOnly: false }],
  actions: [],
}

type Field = {
  code: string
  type: string
  nullable: boolean
  length?: number
  precision?: number
  remark?: string
  default?: string | number | boolean | null
  identity?: "PLATFORM_UUID" | "MANUAL"
  systemTemplate?: "CREATED_AUDIT" | "UPDATED_AUDIT"
  systemManaged?: boolean
}
type OnlineIndexInput = { code: string; fields: string[]; unique: boolean }
type OnlineRelationInput = { code: string; type: "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_ONE"; sourceField: string; targetDefinitionCode: string; targetField: string; onDelete: "RESTRICT" | "SET_NULL" }
type Model = { version: number; storage: { kind: string }; fields: Field[]; indexes: OnlineIndexInput[]; relations: OnlineRelationInput[] }
type InteractionField = Record<string, any> & { dictionaryCode?: string }
type Interaction = { version: number; settings: Record<string, unknown>; fields: InteractionField[]; actions: unknown[] }

function parseJson<T>(value: string, fallback: T): T {
  try { return JSON.parse(value) as T } catch { return fallback }
}

function fieldInteraction(field: Field) {
  const widget = field.type === "boolean" ? "SWITCH" : field.type === "integer" || field.type === "decimal" ? "NUMBER" : field.type === "date" ? "DATE" : field.type === "datetime" ? "DATETIME" : field.type === "json" ? "JSON" : "TEXT"
  return { code: field.code, label: field.code, widget, query: { enabled: false }, visibility: { list: true, form: true, detail: true }, list: { sortable: false, summary: false }, form: { span: 12 }, detail: { formatter: "PLAIN" }, validation: { ruleKeys: [] }, readOnly: false }
}

export default function OnlineDefinitionDesignerPage({ code }: { code: string }) {
  const [detail, setDetail] = useState<OnlineDefinitionDetail | null>(null)
  const [modelText, setModelText] = useState(() => JSON.stringify(exampleModel, null, 2))
  const [interactionText, setInteractionText] = useState(() => JSON.stringify(exampleInteraction, null, 2))
  const [views, setViews] = useState<NonNullable<OnlineDefinitionDetail["revision"]>["views"]>([])
  const [message, setMessage] = useState("")
  const [messageTone, setMessageTone] = useState<"success" | "error">("success")
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [busy, setBusy] = useState(false)

  const model = parseJson<Model>(modelText, exampleModel as Model)
  const interaction = parseJson<Interaction>(interactionText, exampleInteraction as Interaction)
  const fields = Array.isArray(model.fields) ? model.fields : []
  const configs = useMemo(() => new Map((Array.isArray(interaction.fields) ? interaction.fields : []).map((field) => [field.code as string, field])), [interaction.fields])
  const labels = useMemo(() => new Map((Array.isArray(interaction.fields) ? interaction.fields : []).map((field) => [field.code as string, field.label as string])), [interaction.fields])
  const relationFields = useMemo(() => new Set((model.relations ?? []).map((relation) => relation.sourceField)), [model.relations])
  const missingSystemFields = ["id", "creator", "create_time", "updater", "update_time", "deleted", "tenant_id"].some((fieldCode) => !fields.some((field) => field.code === fieldCode && field.systemManaged))

  const applyDetail = (next: OnlineDefinitionDetail) => {
    setDetail(next)
    setModelText(JSON.stringify(next.revision?.model ?? exampleModel, null, 2))
    setInteractionText(JSON.stringify(next.revision?.interaction ?? exampleInteraction, null, 2))
    setViews(next.revision?.views ?? [])
  }
  const loadDetail = async () => {
    setLoading(true)
    setLoadError("")
    try {
      const response = await request.get<OnlineDefinitionDetail>(`${endpoint}/${code}`)
      if (!response.success || !response.data) { setLoadError(response.error ?? "Online 定义详情加载失败"); return }
      applyDetail(response.data)
    } finally { setLoading(false) }
  }
  useEffect(() => { setDetail(null); void loadDetail() }, [code])

  const saveDraft = async () => {
    if (!detail) return
    setBusy(true); setMessage("")
    try {
      const response = await request.put<OnlineDefinitionDetail>(`${endpoint}/${detail.code}/draft`, {
        expectedLockVersion: detail.lockVersion,
        model: JSON.parse(modelText),
        interaction: JSON.parse(interactionText),
        views: views.map(({ code: viewCode, kind, puckData, version }) => ({ code: viewCode, kind, puckData, version })),
      })
      if (!response.success || !response.data) { setMessageTone("error"); setMessage(response.error ?? "保存失败"); return }
      applyDetail(response.data); setMessageTone("success"); setMessage("设计草稿已保存")
    } catch { setMessageTone("error"); setMessage("字段配置格式无效，请检查输入值") } finally { setBusy(false) }
  }
  const runLifecycle = async (path: string, success: string) => {
    if (!detail) return
    setBusy(true); setMessage("")
    try {
      const response = await request.post<OnlineDefinitionDetail>(`${endpoint}/${detail.code}${path}`, { expectedLockVersion: detail.lockVersion })
      if (!response.success) { setMessageTone("error"); setMessage(response.error ?? "操作失败"); return }
      await loadDetail(); setMessageTone("success"); setMessage(success)
    } finally { setBusy(false) }
  }
  const downloadGeneratedCode = async () => {
    if (!detail?.publishedReleaseId) return
    setBusy(true); setMessage("")
    try {
      const token = localStorage.getItem("ruoyi_token")
      const response = await fetch(`${endpoint}/${detail.code}/codegen/download`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!response.ok) { const body = await response.json().catch(() => null); setMessageTone("error"); setMessage(body?.error ?? "代码生成失败：当前发布版本可能包含尚未受共享模板支持的配置"); return }
      const blob = await response.blob(); const url = URL.createObjectURL(blob); const link = document.createElement("a")
      link.href = url; link.download = `online-${detail.code}-release-${detail.currentRelease?.schemaRevision ?? 0}.zip`; link.click(); URL.revokeObjectURL(url)
      setMessageTone("success"); setMessage("已下载共享 RuoYi CRUD 模板 ZIP，请审阅后受控注入")
    } finally { setBusy(false) }
  }
  const normalizeSystemFields = () => runLifecycle("/normalize-system-fields", "系统字段已补齐")
  const changeFields = (next: Field[]) => {
    const allowed = new Set(next.map((field) => field.code))
    const previous = new Map((Array.isArray(interaction.fields) ? interaction.fields : []).map((field) => [field.code, field]))
    const indexes = (model.indexes ?? []).map((index) => ({ ...index, fields: index.fields.filter((field) => allowed.has(field)) })).filter((index) => index.fields.length)
    const relations = (model.relations ?? []).filter((relation) => allowed.has(relation.sourceField))
    setModelText(JSON.stringify({ ...model, fields: next, indexes, relations }, null, 2))
    setInteractionText(JSON.stringify({ ...interaction, fields: next.map((field) => previous.get(field.code) ?? fieldInteraction(field)) }, null, 2))
  }
  const addField = () => changeFields([...fields, { code: `field_${fields.length + 1}`, type: "string", nullable: true, length: 100 }])
  const changeField = (index: number, patch: Partial<Field>) => {
    const current = fields[index]
    if (!current) return
    const nextField = { ...current, ...patch, ...(patch.type && patch.type !== "decimal" ? { precision: undefined } : {}) }
    const nextFields = fields.map((field, position) => position === index ? nextField : field)
    const interactions = Array.isArray(interaction.fields) ? interaction.fields : []
    const renamedInteractions = current.code === nextField.code ? interactions : interactions.map((field) => field.code === current.code ? { ...field, code: nextField.code } : field)
    const indexes = (model.indexes ?? []).map((item) => ({ ...item, fields: item.fields.map((field) => field === current.code ? nextField.code : field) }))
    const relations = (model.relations ?? []).map((item) => item.sourceField === current.code ? { ...item, sourceField: nextField.code } : item)
    setModelText(JSON.stringify({ ...model, fields: nextFields, indexes, relations }, null, 2))
    setInteractionText(JSON.stringify({ ...interaction, fields: nextFields.map((field) => renamedInteractions.find((item) => item.code === field.code) ?? fieldInteraction(field)) }, null, 2))
  }
  const changeLabel = (fieldCode: string, label: string) => setInteractionText(JSON.stringify({ ...interaction, fields: fields.map((field) => field.code === fieldCode ? { ...(configs.get(fieldCode) ?? fieldInteraction(field)), label: label || fieldCode } : configs.get(field.code) ?? fieldInteraction(field)) }, null, 2))
  const changeInteraction = (fieldCode: string, patch: Record<string, any>) => {
    const field = fields.find((item) => item.code === fieldCode)
    if (!field) return
    const current: InteractionField = configs.get(fieldCode) ?? fieldInteraction(field)
    const next: InteractionField = { ...current, ...patch, query: patch.query ? { ...current.query, ...patch.query } : current.query, visibility: patch.visibility ? { ...current.visibility, ...patch.visibility } : current.visibility, list: patch.list ? { ...current.list, ...patch.list } : current.list, form: patch.form ? { ...current.form, ...patch.form } : current.form, validation: patch.validation ? { ...current.validation, ...patch.validation } : current.validation }
    if (![next.widget, next.query?.widget].some((widget) => widget === "DICTIONARY" || widget === "SELECT")) delete next.dictionaryCode
    setInteractionText(JSON.stringify({ ...interaction, fields: fields.map((item) => item.code === fieldCode ? next : configs.get(item.code) ?? fieldInteraction(item)) }, null, 2))
  }
  const changeIndexes = (indexes: OnlineIndexInput[]) => {
    const fieldCodes = new Set(fields.map((field) => field.code))
    const valid = indexes.length <= 64 && new Set(indexes.map((item) => item.code)).size === indexes.length && indexes.every((item) => /^[a-z][a-z0-9_]{1,63}$/.test(item.code) && item.fields.length > 0 && item.fields.length <= 16 && new Set(item.fields).size === item.fields.length && item.fields.every((field) => fieldCodes.has(field)))
    if (!valid) { setMessageTone("error"); setMessage("索引配置无效：编码必须唯一且合法，并引用 1–16 个当前字段"); return }
    setModelText(JSON.stringify({ ...model, indexes }, null, 2))
  }
  const changeRelations = (relations: OnlineRelationInput[]) => setModelText(JSON.stringify({ ...model, relations }, null, 2))
  const changeSettings = (settings: Record<string, unknown>) => setInteractionText(JSON.stringify({ ...interaction, settings }, null, 2))
  const changeDefault = (index: number, value: string | number | boolean | null | undefined) => changeField(index, { default: value })

  return <main className="min-h-full bg-white"><div className="mx-auto max-w-[1500px] pb-6">
    <header className="flex h-12 items-center justify-between border-b border-slate-200 px-5"><h1 className="text-sm font-medium text-slate-900">设计业务模型</h1><Link href="/admin/infra/online-definitions" className="text-xl leading-none text-slate-400 hover:text-slate-700" aria-label="返回列表">×</Link></header>
    {message && <div role="status" className={`mx-5 mt-4 rounded border px-3 py-2 text-sm ${messageTone === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{message}</div>}
    {detail && <section className="bg-white"><div className="grid gap-x-10 gap-y-3 border-b border-slate-200 px-5 py-4 lg:grid-cols-3"><label className="flex items-center gap-3 text-sm text-slate-700"><span className="w-[88px] shrink-0 text-right">表名：</span><input value={detail.code} disabled className="h-8 w-full rounded border border-slate-200 bg-slate-100 px-2 font-mono text-sm text-slate-500" /></label><label className="flex items-center gap-3 text-sm text-slate-700"><span className="w-[88px] shrink-0 text-right">表描述：</span><input value={detail.name} disabled className="h-8 w-full rounded border border-slate-200 bg-slate-100 px-2 text-sm text-slate-500" /></label><label className="flex items-center gap-3 text-sm text-slate-700"><span className="w-[88px] shrink-0 text-right">表类型：</span><input value={detail.modelType === "TREE" ? "树表" : detail.modelType === "MASTER_DETAIL" ? "主子表" : "单表"} disabled className="h-8 w-full rounded border border-slate-200 bg-slate-100 px-2 text-sm text-slate-500" /></label></div>
      <div className="flex flex-wrap items-center justify-end gap-2 border-b border-slate-100 px-5 py-3"><button type="button" disabled={busy} onClick={() => void saveDraft()} className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-700 disabled:opacity-50">保存</button>{missingSystemFields && <button type="button" disabled={busy} onClick={() => void normalizeSystemFields()} className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-700 disabled:opacity-50">补齐系统字段</button>}<button type="button" disabled={busy} onClick={() => void runLifecycle("/validate", "模型校验通过")} className="rounded border border-blue-200 px-3 py-1.5 text-xs text-blue-700 disabled:opacity-50">校验</button><button type="button" disabled={busy} onClick={() => void runLifecycle("/schema-plans", "Schema 计划已生成") } className="rounded border border-blue-200 px-3 py-1.5 text-xs text-blue-700 disabled:opacity-50">生成 Schema 计划</button>{detail.publishedReleaseId && <button type="button" disabled={busy} onClick={() => void downloadGeneratedCode()} className="rounded border border-blue-200 px-3 py-1.5 text-xs text-blue-700 disabled:opacity-50">生成代码</button>}<button type="button" disabled={busy} onClick={() => void runLifecycle("/publish", "已发布为不可变 Release")} className="rounded bg-blue-600 px-3 py-1.5 text-xs text-white disabled:opacity-50">发布</button></div>
      <div className="px-5 py-4"><OnlineJeecgConfigurationTabs fields={fields} labels={labels} configs={configs} relations={model.relations ?? []} indexes={model.indexes ?? []} settings={interaction.settings ?? {}} disabled={busy} relationFields={relationFields} onAddField={addField} onFieldChange={changeField} onLabelChange={changeLabel} onDefaultChange={changeDefault} onRemoveField={(index) => changeFields(fields.filter((_, position) => position !== index))} onInteractionChange={changeInteraction} onRelationsChange={changeRelations} onIndexesChange={changeIndexes} onSettingsChange={changeSettings} /></div>
    </section>}
    {loading && !detail && <section className="m-5 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">正在加载业务模型设计工作区…</section>}
    {!loading && !detail && loadError && <section className="m-5 rounded-xl border border-rose-200 bg-white p-12 text-center"><p className="text-sm text-rose-700">加载设计工作区失败：{loadError}</p><div className="mt-4 flex justify-center gap-2"><button type="button" onClick={() => void loadDetail()} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white">重试</button><Link href="/admin/infra/online-definitions" className="rounded border border-slate-200 px-4 py-2 text-sm text-slate-700">返回列表</Link></div></section>}
  </div></main>
}
