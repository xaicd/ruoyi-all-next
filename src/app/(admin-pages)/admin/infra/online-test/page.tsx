"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Render, type Data } from "@puckeditor/core"
import "@puckeditor/core/puck.css"
import { onlinePuckConfig } from "@/modules/online/frontend/puck/online-puck.config"
import { request } from "@/modules/shared/frontend/lib/request"
import type { OnlineDefinitionPage } from "@/modules/online/backend/application/online-definition.contract"
import type { OnlineRuntimeQueryCondition, OnlineRuntimeRecord, OnlineRuntimeRecordPage, OnlineTestSessionDetail } from "@/modules/online/backend/application/online-runtime.contract"

const definitionsEndpoint = "/api/v1/admin/online/definitions"

export default function OnlineTestPage() {
  const searchParams = useSearchParams()
  const requestedDefinition = searchParams.get("definition")?.trim() ?? ""
  const [definitions, setDefinitions] = useState<OnlineDefinitionPage | null>(null)
  const [code, setCode] = useState("")
  const [session, setSession] = useState<OnlineTestSessionDetail | null>(null)
  const [records, setRecords] = useState<OnlineRuntimeRecordPage | null>(null)
  const [conditions, setConditions] = useState<OnlineRuntimeQueryCondition[]>([])
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [editing, setEditing] = useState<OnlineRuntimeRecord | null>(null)
  const [viewCode, setViewCode] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  const published = useMemo(() => definitions?.items.filter((item) => item.publishedReleaseId && item.modelType === "SINGLE") ?? [], [definitions])
  const fields = session?.runtime.model.fields ?? []
  const interaction = new Map(session?.runtime.interaction.fields.map((field) => [field.code, field]) ?? [])
  const releasedActions = session?.runtime.interaction.actions.filter((action) => action.enabled).sort((left, right) => left.order - right.order || left.code.localeCompare(right.code)) ?? []
  const actionFor = (type: "CREATE" | "UPDATE" | "DELETE") => releasedActions.find((action) => action.type === type)
  const usesLegacySandboxActions = session !== null && session.runtime.interaction.actions.length === 0
  const createAction = actionFor("CREATE"); const updateAction = actionFor("UPDATE"); const deleteAction = actionFor("DELETE")
  const canCreate = usesLegacySandboxActions || Boolean(createAction); const canUpdate = usesLegacySandboxActions || Boolean(updateAction); const canDelete = usesLegacySandboxActions || Boolean(deleteAction)
  const formFields = fields.filter((field) => interaction.get(field.code)?.visibility.form !== false)
  const queryFields = fields.filter((field) => interaction.get(field.code)?.query.enabled === true)
  const listFields = fields.filter((field) => interaction.get(field.code)?.visibility.list !== false)
  const releasedViews = session?.runtime.views ?? []
  const selectedView = releasedViews.find((view) => view.code === viewCode) ?? releasedViews[0]

  useEffect(() => { void (async () => {
    const response = await request.get<OnlineDefinitionPage>(definitionsEndpoint, { page: 1, pageSize: 100 })
    if (response.success && response.data) {
      setDefinitions(response.data)
      const requested = requestedDefinition ? response.data.items.find((item) => item.code === requestedDefinition && item.publishedReleaseId && item.modelType === "SINGLE") : undefined
      const fallback = response.data.items.find((item) => item.publishedReleaseId && item.modelType === "SINGLE")
      setCode(requestedDefinition ? requested?.code ?? "" : fallback?.code ?? "")
      setMessage(requestedDefinition && !requested ? "指定的 Definition 未发布或当前 Online Test 不支持其模型类型" : "")
    } else setMessage(response.error ?? "Online Definition 加载失败")
  })() }, [requestedDefinition])

  const loadRecords = async (active = session, nextConditions = conditions) => {
    if (!active) return
    const response = await request.get<OnlineRuntimeRecordPage>(`${definitionsEndpoint}/${active.definitionCode}/test-sessions/${active.id}/records`, { page: 1, pageSize: 50, conditions: JSON.stringify(nextConditions) })
    if (response.success && response.data) setRecords(response.data); else setMessage(response.error ?? "测试记录加载失败")
  }
  const defaultConditions = (active: OnlineTestSessionDetail): OnlineRuntimeQueryCondition[] => active.runtime.interaction.fields.filter((field) => field.query.enabled && field.query.defaultValue !== undefined && field.query.defaultValue !== "").map((field) => ({ field: field.code, value: field.query.defaultValue as OnlineRuntimeQueryCondition["value"] }))
  const updateCondition = (field: string, value: OnlineRuntimeQueryCondition["value"] | undefined) => setConditions((current) => value === undefined || value === "" || (Array.isArray(value) && !value.some(Boolean)) ? current.filter((item) => item.field !== field) : [...current.filter((item) => item.field !== field), { field, value }])
  const conditionValue = (field: string) => conditions.find((item) => item.field === field)?.value

  const start = async () => {
    if (!code) return
    setBusy(true); setMessage("")
    try {
      const response = await request.post<OnlineTestSessionDetail>(`${definitionsEndpoint}/${code}/test-sessions`, {})
      if (!response.success || !response.data) { setMessage(response.error ?? "无法开始在线测试"); return }
      const nextConditions = defaultConditions(response.data)
      setSession(response.data); setRecords(null); setConditions(nextConditions); setForm({}); setEditing(null); setViewCode(response.data.runtime.views[0]?.code ?? ""); await loadRecords(response.data, nextConditions)
      setMessage(`已启动 sandbox Session；Release ${response.data.releaseId.slice(0, 8)} 已固定`)
    } finally { setBusy(false) }
  }

  const submit = async () => {
    if (!session || (editing ? !canUpdate : !canCreate)) return
    setBusy(true); setMessage("")
    try {
      const url = editing
        ? `${definitionsEndpoint}/${session.definitionCode}/test-sessions/${session.id}/records/${editing.id}`
        : `${definitionsEndpoint}/${session.definitionCode}/test-sessions/${session.id}/records`
      const response = editing ? await request.put<OnlineRuntimeRecord>(url, { data: form }) : await request.post<OnlineRuntimeRecord>(url, { data: form })
      if (!response.success) { setMessage(response.error ?? "保存测试记录失败"); return }
      setForm({}); setEditing(null); await loadRecords(); setMessage(editing ? "测试记录已更新" : "测试记录已创建")
    } finally { setBusy(false) }
  }

  const remove = async (record: OnlineRuntimeRecord) => {
    if (!session || !canDelete || !confirm("确认删除此 sandbox 测试记录？")) return
    setBusy(true)
    try {
      const response = await request.delete(`${definitionsEndpoint}/${session.definitionCode}/test-sessions/${session.id}/records/${record.id}`)
      if (!response.success) setMessage(response.error ?? "删除失败"); else { await loadRecords(); setMessage("测试记录已删除") }
    } finally { setBusy(false) }
  }

  const setValue = (field: { code: string; type: string }, raw: string | boolean) => {
    const value = field.type === "integer" || field.type === "decimal" ? (raw === "" ? null : Number(raw)) : raw
    setForm((current) => ({ ...current, [field.code]: value }))
  }

  return <main className="mx-auto max-w-6xl space-y-5 p-6">
    <header className="rounded-lg border bg-white p-5"><p className="text-sm font-medium text-blue-700">Online 低代码引擎</p><h1 className="mt-1 text-2xl font-semibold">Online 测试</h1><p className="mt-2 text-sm text-slate-600">测试只读取已发布 Release，并写入 actor-owned sandbox Session；当前仅支持 SINGLE + GENERIC_RECORD。</p></header>
    {message && <p className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{message}</p>}
    <section className="flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4"><label className="min-w-72 flex-1 text-sm"><span className="mb-1 block font-medium">已发布单表 Definition</span><select value={code} onChange={(event) => setCode(event.target.value)} className="h-9 w-full rounded border px-3"><option value="">请选择</option>{published.map((item) => <option key={item.id} value={item.code}>{item.name} · {item.code}</option>)}</select></label><button disabled={busy || !code} onClick={() => void start()} className="h-9 rounded bg-blue-600 px-4 text-sm font-medium text-white disabled:opacity-50">开始</button></section>
    {session && <><section className="rounded-lg border bg-white p-4 text-sm"><div className="grid gap-3 sm:grid-cols-4"><div><span className="text-slate-500">Definition</span><p className="mt-1 font-medium">{session.runtime.definitionName}</p></div><div><span className="text-slate-500">Release</span><p className="mt-1 font-mono text-xs">{session.releaseId}</p></div><div><span className="text-slate-500">Schema</span><p className="mt-1 font-medium">{session.schemaRevision}</p></div><div><span className="text-slate-500">Sandbox</span><p className="mt-1 font-medium text-emerald-700">{session.sandbox ? "已隔离" : "否"}</p></div></div></section>
    {queryFields.length > 0 && <section className="rounded-lg border bg-white p-4"><div className="mb-3 flex items-center justify-between"><div><h2 className="font-semibold">查询条件</h2><p className="mt-1 text-xs text-slate-500">由当前 Published Release 的“查询配置”和“页面属性”生成。</p></div><div className="flex gap-2"><button type="button" disabled={busy} onClick={() => void loadRecords()} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50">查询</button><button type="button" disabled={busy} onClick={() => { if (!session) return; const nextConditions = defaultConditions(session); setConditions(nextConditions); void loadRecords(session, nextConditions) }} className="rounded border px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50">重置</button></div></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{queryFields.map((field) => { const config = interaction.get(field.code)!; const query = config.query; const value = conditionValue(field.code); const inputType = field.type === "integer" || field.type === "decimal" ? "number" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text"; const set = (next: string | boolean | string[]) => updateCondition(field.code, next); return <label key={field.code} className="text-sm"><span className="mb-1 block">{config.label}{query.required && <b className="ml-1 text-rose-600">*</b>}<em className="ml-1 not-italic text-slate-400">({query.operator})</em></span>{query.operator === "BETWEEN" ? <div className="flex gap-2"><input type={inputType} value={Array.isArray(value) ? String(value[0] ?? "") : ""} onChange={(event) => set([event.target.value, Array.isArray(value) ? String(value[1] ?? "") : ""])} className="h-9 w-full rounded border px-3" /><input type={inputType} value={Array.isArray(value) ? String(value[1] ?? "") : ""} onChange={(event) => set([Array.isArray(value) ? String(value[0] ?? "") : "", event.target.value])} className="h-9 w-full rounded border px-3" /></div> : query.operator === "IN" ? <input value={Array.isArray(value) ? value.join(",") : String(value ?? "")} onChange={(event) => set(event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} placeholder="多个值用逗号分隔" className="h-9 w-full rounded border px-3" /> : query.widget === "SWITCH" ? <select value={String(value ?? "")} onChange={(event) => set(event.target.value)} className="h-9 w-full rounded border px-3"><option value="">请选择</option><option value="true">是</option><option value="false">否</option></select> : <input type={inputType} value={String(value ?? "")} onChange={(event) => set(event.target.value)} className="h-9 w-full rounded border px-3" />}</label>})}</div></section>}
    {selectedView && <section className="overflow-hidden rounded-lg border bg-slate-50 p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-semibold">已发布 Release 视图预览</h2><p className="mt-1 text-xs text-slate-500">只渲染本 Sandbox Session 固定 Release 中已编译的受控 Puck 视图。</p></div>{releasedViews.length > 1 && <label className="text-xs">视图<select value={selectedView.code} onChange={(event) => setViewCode(event.target.value)} className="ml-2 h-8 rounded border bg-white px-2 text-sm">{releasedViews.map((view) => <option key={view.code} value={view.code}>{view.code}</option>)}</select></label>}</div><Render config={onlinePuckConfig} data={selectedView.puckData as Data} /></section>}
    {canCreate || (editing && canUpdate) ? <section className="rounded-lg border bg-white p-4"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{editing ? "编辑测试记录" : "新增测试记录"}</h2>{editing && <button onClick={() => { setEditing(null); setForm({}) }} className="text-sm text-slate-600">取消编辑</button>}</div><div className="grid gap-3 md:grid-cols-2">{formFields.map((field) => { const config = interaction.get(field.code); const disabled = config?.readOnly; const value = form[field.code]; return <label key={field.code} className="text-sm"><span className="mb-1 block">{config?.label ?? field.code}{!field.nullable && " *"}</span>{field.type === "boolean" ? <input disabled={disabled} checked={Boolean(value)} onChange={(event) => setValue(field, event.target.checked)} type="checkbox" className="h-4 w-4" /> : <input disabled={disabled} type={field.type === "integer" || field.type === "decimal" ? "number" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text"} value={typeof value === "string" || typeof value === "number" ? value : ""} onChange={(event) => setValue(field, event.target.value)} className="h-9 w-full rounded border px-3 disabled:bg-slate-100" />}</label>})}</div>{!formFields.length && <p className="rounded bg-slate-50 p-3 text-sm text-slate-500">当前 Release 未声明表单可见字段。</p>}<button disabled={busy || (editing ? !canUpdate : !canCreate)} onClick={() => void submit()} className="mt-4 rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{editing ? (updateAction?.label ?? "保存修改") : (createAction?.label ?? "创建记录")}</button></section> : <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">当前已发布 Release 未启用创建或更新动作；sandbox 仍可查看已授权的测试记录。</section>}
    <section className="overflow-hidden rounded-lg border bg-white"><div className="flex items-center justify-between border-b p-4"><h2 className="font-semibold">Sandbox 记录（{records?.total ?? 0}）</h2><button onClick={() => void loadRecords()} className="text-sm text-blue-700">刷新</button></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50 text-xs text-slate-500"><tr>{listFields.map((field) => <th key={field.code} className="p-3">{interaction.get(field.code)?.label ?? field.code}</th>)}{(canUpdate || canDelete) && <th className="p-3 text-right">操作</th>}</tr></thead><tbody>{records?.items.length ? records.items.map((record) => <tr key={record.id} className="border-b last:border-0">{listFields.map((field) => <td key={field.code} className="p-3">{String(record.data[field.code] ?? "-")}</td>)}{(canUpdate || canDelete) && <td className="p-3 text-right">{canUpdate && <button onClick={() => { setEditing(record); setForm(record.data) }} className="mr-3 text-blue-700">{updateAction?.label ?? "编辑"}</button>}{canDelete && <button onClick={() => void remove(record)} className="text-red-700">{deleteAction?.label ?? "删除"}</button>}</td>}</tr>) : <tr><td colSpan={listFields.length + (canUpdate || canDelete ? 1 : 0)} className="p-8 text-center text-slate-500">暂无测试记录</td></tr>}</tbody></table></div></section></>}
  </main>
}
