"use client"

import Link from "next/link"
import { Fragment, useEffect, useMemo, useState, type FormEvent } from "react"
import type { OnlineRuntimeChildBinding, OnlineRuntimeKind, OnlineRuntimeRecord, OnlineRuntimeView, OnlineTestSessionDetail } from "@/modules/online/backend/application/online-runtime.contract"
import { request } from "@/modules/shared/frontend/lib/request"
import { coerceFieldValue, displayValue, extractChildren, ONLINE_CHILDREN_KEY, OnlineFormGrid, recordFormValues, writableFields, type DictOption } from "@/modules/online/frontend/components/online-form-runtime-fields"

const kindLabels: Record<OnlineRuntimeKind, string> = { SINGLE_DEFAULT: "单表", TREE_DEFAULT: "树表", MASTER_DETAIL_ERP: "ERP 主子表", MASTER_DETAIL_INNER: "内嵌主子表", MASTER_DETAIL_TAB: "Tab 主子表" }

type DialogMode = { kind: "create" | "update" | "detail"; record?: OnlineRuntimeRecord; parentId?: string }
type TreeNode = { record: OnlineRuntimeRecord; depth: number }

function actionEnabled(runtime: OnlineRuntimeView, type: "CREATE" | "UPDATE" | "DELETE") {
  if (!runtime.interaction.actions.length) return true
  return runtime.interaction.actions.some((action) => action.type === type && action.enabled)
}

function toTree(items: OnlineRuntimeRecord[], parentField: string, rootValue?: string | number | null): TreeNode[] {
  const children = new Map<string, OnlineRuntimeRecord[]>()
  const roots: OnlineRuntimeRecord[] = []
  for (const item of items) {
    const parent = item.data[parentField]
    const isRoot = parent === rootValue || parent === null || parent === undefined || parent === "" || parent === 0 || parent === "0"
    if (isRoot) roots.push(item)
    else {
      const key = String(parent)
      children.set(key, [...(children.get(key) ?? []), item])
    }
  }
  const walk = (nodes: OnlineRuntimeRecord[], depth: number): TreeNode[] => nodes.flatMap((record) => [{ record, depth }, ...walk(children.get(record.id) ?? [], depth + 1)])
  return walk(roots, 0)
}

export default function OnlineFormRuntimePage({ definitionCode }: { definitionCode: string }) {
  const endpoint = `/api/v1/admin/online/definitions/${encodeURIComponent(definitionCode)}`
  const [session, setSession] = useState<OnlineTestSessionDetail | null>(null)
  const [items, setItems] = useState<OnlineRuntimeRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")
  const [messageTone, setMessageTone] = useState<"success" | "error">("success")
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [dialog, setDialog] = useState<DialogMode | null>(null)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [childRows, setChildRows] = useState<Record<string, Array<Record<string, unknown>>>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [options, setOptions] = useState<Record<string, DictOption[]>>({})

  const runtime = session?.runtime
  const kind = runtime?.kind ?? "SINGLE_DEFAULT"
  const queryFields = runtime ? writableFields(runtime.interaction.fields, runtime.model.fields, "query") : []
  const listFields = runtime ? writableFields(runtime.interaction.fields, runtime.model.fields, "list") : []
  const formFields = runtime ? writableFields(runtime.interaction.fields, runtime.model.fields, "form") : []
  const detailFields = runtime ? writableFields(runtime.interaction.fields, runtime.model.fields, "detail") : []
  const pageSize = kind === "TREE_DEFAULT" || !runtime?.interaction.settings.list.pagination ? 100 : 20
  const treeNodes = useMemo(() => runtime?.interaction.tree ? toTree(items, runtime.interaction.tree.parentField, runtime.interaction.tree.rootValue) : items.map((record) => ({ record, depth: 0 })), [items, runtime])
  const selectedRecord = items.find((item) => item.id === selected) ?? null

  const showError = (error?: string) => { setMessageTone("error"); setMessage(error ?? "操作失败") }
  const loadRecords = async (target: OnlineTestSessionDetail, targetPage = 1, targetQuery = query) => {
    const conditions = queryFields.flatMap(({ field }) => { const value = targetQuery[field.code]?.trim(); return value ? [{ field: field.code, value }] : [] })
    const response = await request.get<{ items: OnlineRuntimeRecord[]; total: number }>(`${endpoint}/test-sessions/${target.id}/records`, { page: targetPage, pageSize, conditions: JSON.stringify(conditions) })
    if (!response.success || !response.data) { showError(response.error); return }
    setItems(response.data.items); setTotal(response.data.total); setPage(targetPage)
  }
  const loadDicts = async (view: OnlineRuntimeView, extra: OnlineRuntimeChildBinding[] = []) => {
    const targets = [{ code: definitionCode, fields: view.interaction.fields }, ...extra.map((child) => ({ code: child.targetDefinitionCode, fields: child.runtime.interaction.fields }))]
    const next: Record<string, DictOption[]> = {}
    await Promise.all(targets.flatMap((target) => target.fields.filter((field) => field.widget === "DICTIONARY" || field.widget === "SELECT" || field.query.widget === "DICTIONARY" || field.query.widget === "SELECT").map(async (field) => {
      const response = await request.get<{ options: DictOption[] }>(`/api/v1/admin/online/definitions/${encodeURIComponent(target.code)}/lookup/dictionary`, { field: field.code })
      if (response.success && response.data) next[field.code] = response.data.options
    })))
    setOptions(next)
  }

  useEffect(() => {
    let cancelled = false
    const start = async () => {
      setLoading(true); setMessage("")
      const response = await request.post<OnlineTestSessionDetail>(`${endpoint}/test-sessions`, {})
      if (cancelled) return
      if (!response.success || !response.data) { showError(response.error ?? "无法启动功能测试：请确认模型已发布"); setLoading(false); return }
      setSession(response.data)
      await loadDicts(response.data.runtime, response.data.children)
      await loadRecords(response.data, 1, {})
      setLoading(false)
    }
    void start()
    return () => { cancelled = true }
  }, [definitionCode])

  const openDialog = (mode: DialogMode) => {
    if (!runtime) return
    const data = mode.record?.data ?? {}
    const values = recordFormValues(data, formFields)
    if (mode.kind === "create" && runtime.interaction.tree && mode.parentId) values[runtime.interaction.tree.parentField] = mode.parentId
    setForm(values)
    setChildRows(mode.record ? extractChildren(data) : Object.fromEntries((session?.children ?? []).map((child) => [child.code, []])))
    setDialog(mode)
  }

  const buildPayload = () => {
    if (!runtime) return {}
    const data: Record<string, unknown> = {}
    for (const { field } of formFields) {
      const value = coerceFieldValue(field, form[field.code])
      if (value !== undefined) data[field.code] = value
    }
    if (runtime.modelType === "MASTER_DETAIL") data[ONLINE_CHILDREN_KEY] = childRows
    return data
  }

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()
    if (!session || !dialog || dialog.kind === "detail") return
    setBusy(true); setMessage("")
    try {
      const response = dialog.kind === "create"
        ? await request.post<OnlineRuntimeRecord>(`${endpoint}/test-sessions/${session.id}/records`, { data: buildPayload() })
        : await request.put<OnlineRuntimeRecord>(`${endpoint}/test-sessions/${session.id}/records/${dialog.record!.id}`, { data: buildPayload() })
      if (!response.success) { showError(response.error); return }
      setDialog(null); setMessageTone("success"); setMessage(dialog.kind === "create" ? "已新增" : "已保存")
      await loadRecords(session, page)
    } finally { setBusy(false) }
  }

  const removeRecord = async (record: OnlineRuntimeRecord) => {
    if (!session || !window.confirm("确认删除该记录？")) return
    setBusy(true); setMessage("")
    try {
      const response = await request.delete(`${endpoint}/test-sessions/${session.id}/records/${record.id}`)
      if (!response.success) { showError(response.error); return }
      setMessageTone("success"); setMessage("已删除")
      await loadRecords(session, page)
    } finally { setBusy(false) }
  }

  const submitQuery = (event: FormEvent) => { event.preventDefault(); if (session) void loadRecords(session, 1, query) }
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const children = session?.children ?? []
  if (loading) return <main className="min-h-full bg-slate-50 p-6 text-sm text-slate-500">正在按已发布 Release 打开功能测试…</main>
  if (!runtime || !session) return <main className="min-h-full bg-slate-50 p-6"><div className="rounded-xl border border-rose-200 bg-white p-6 text-sm text-rose-700">{message || "功能测试不可用"}</div><Link href="/admin/infra/online-definitions" className="mt-4 inline-block text-sm text-blue-700">返回业务建模</Link></main>

  return <main className="min-h-full bg-slate-50 p-4 lg:p-6"><div className="mx-auto max-w-[1500px] space-y-4">
    <header className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-xs font-semibold text-blue-600">ONLINE · 功能测试 · {kindLabels[kind]}</div><h1 className="mt-1 text-xl font-semibold text-slate-900">{runtime.definitionName}</h1><p className="mt-1 text-sm text-slate-500">按 Jeecg AUTO 页展示查询、工具栏、列表、表单与详情。数据写入当前用户沙箱，不修改生产表。Release {session.releaseId.slice(0, 8)} · 模型 v{session.schemaRevision}</p></div><Link href="/admin/infra/online-definitions" className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">返回</Link></div></header>
    {message && <div role="status" className={`rounded-lg border px-4 py-3 text-sm ${messageTone === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{message}</div>}
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {queryFields.length > 0 && <form onSubmit={submitQuery} className="grid gap-3 border-b p-4 md:grid-cols-2 xl:grid-cols-4">{queryFields.map(({ field, interaction }) => <label key={field.code} className="grid gap-1 text-sm text-slate-600"><span>{interaction.label}</span><input value={query[field.code] ?? ""} onChange={(event) => setQuery((current) => ({ ...current, [field.code]: event.target.value }))} className="h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500" /></label>)}<div className="flex items-end gap-2"><button type="submit" className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white">查询</button><button type="button" onClick={() => { setQuery({}); if (session) void loadRecords(session, 1, {}) }} className="h-9 rounded-lg border border-slate-200 px-4 text-sm">重置</button></div></form>}
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
        {actionEnabled(runtime, "CREATE") && <button type="button" onClick={() => openDialog({ kind: "create" })} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">新增</button>}
        <button type="button" disabled title="沙箱功能测试暂不支持导入导出" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-400">导入</button>
        <button type="button" disabled title="沙箱功能测试暂不支持导入导出" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-400">导出</button>
        <span className="ml-auto text-xs text-slate-500">共 {total} 条</span>
      </div>
      <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{kind === "MASTER_DETAIL_INNER" && <th className="w-10 px-3 py-3" />}<th className="px-4 py-3">#</th>{listFields.map(({ interaction }) => <th key={interaction.code} className="px-4 py-3">{interaction.label}</th>)}<th className="px-4 py-3 text-right">操作</th></tr></thead>
        <tbody>{treeNodes.length ? treeNodes.map(({ record, depth }, index) => <Fragment key={record.id}>
          <tr className={`border-t border-slate-100 hover:bg-blue-50/40 ${selected === record.id ? "bg-blue-50" : ""}`} onClick={() => setSelected(record.id)}>
            {kind === "MASTER_DETAIL_INNER" && <td className="px-3 py-3"><button type="button" onClick={(event) => { event.stopPropagation(); setExpanded((current) => current === record.id ? null : record.id) }} className="text-slate-500">{expanded === record.id ? "▾" : "▸"}</button></td>}
            <td className="px-4 py-3 text-slate-500" style={{ paddingLeft: 16 + depth * 16 }}>{index + 1}</td>
            {listFields.map(({ field, interaction }) => <td key={field.code} className="max-w-[240px] truncate px-4 py-3" title={displayValue(record.data[field.code], interaction.detail.formatter)}>{displayValue(record.data[field.code], interaction.detail.formatter)}</td>)}
            <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(event) => event.stopPropagation()}>
              {kind === "TREE_DEFAULT" && actionEnabled(runtime, "CREATE") && <button type="button" onClick={() => openDialog({ kind: "create", parentId: record.id })} className="mr-3 text-blue-700">添加子节点</button>}
              {actionEnabled(runtime, "UPDATE") && <button type="button" onClick={() => openDialog({ kind: "update", record })} className="mr-3 text-blue-700">编辑</button>}
              <button type="button" onClick={() => openDialog({ kind: "detail", record })} className="mr-3 text-slate-700">详情</button>
              {actionEnabled(runtime, "DELETE") && <button type="button" disabled={busy} onClick={() => void removeRecord(record)} className="text-rose-600">删除</button>}
            </td>
          </tr>
          {kind === "MASTER_DETAIL_INNER" && expanded === record.id && <tr><td colSpan={listFields.length + 3} className="bg-slate-50 px-6 py-4"><ChildTables children={children} rows={extractChildren(record.data)} readOnly /></td></tr>}
        </Fragment>) : <tr><td colSpan={listFields.length + 3} className="px-5 py-12 text-center text-sm text-slate-400">暂无数据</td></tr>}</tbody>
      </table></div>
      {runtime.interaction.settings.list.pagination && kind !== "TREE_DEFAULT" && <footer className="flex items-center justify-between border-t px-4 py-3 text-xs text-slate-500"><span>第 {page}/{totalPages} 页</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => session && void loadRecords(session, page - 1)} className="h-8 rounded-lg border px-3 disabled:opacity-50">上一页</button><button disabled={page >= totalPages} onClick={() => session && void loadRecords(session, page + 1)} className="h-8 rounded-lg border px-3 disabled:opacity-50">下一页</button></div></footer>}
    </section>
    {kind === "MASTER_DETAIL_ERP" && <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="mb-3 text-sm font-medium text-slate-800">子表{selectedRecord ? "" : " · 请先选择主表记录"}</h2>{selectedRecord ? <ChildTables children={children} rows={extractChildren(selectedRecord.data)} readOnly /> : <p className="text-sm text-slate-400">选中主表一行后展示子表。</p>}</section>}
    {dialog && <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 p-4 pt-10"><form onSubmit={submitForm} className="w-full max-w-3xl rounded-xl bg-white p-5 shadow-2xl"><h2 className="text-base font-semibold text-slate-900">{dialog.kind === "create" ? (dialog.parentId ? "添加子节点" : "新增") : dialog.kind === "update" ? "编辑" : "详情"}</h2>
      <div className="mt-4"><OnlineFormGrid fields={dialog.kind === "detail" ? detailFields : formFields} values={dialog.kind === "detail" ? (dialog.record?.data ?? {}) : form} disabled={dialog.kind === "detail"} options={options} onChange={(code, value) => setForm((current) => ({ ...current, [code]: value }))} /></div>
      {runtime.modelType === "MASTER_DETAIL" && (kind === "MASTER_DETAIL_TAB" || dialog.kind !== "detail") && <div className="mt-5"><ChildTables children={children} rows={dialog.kind === "detail" ? extractChildren(dialog.record?.data ?? {}) : childRows} readOnly={dialog.kind === "detail"} options={options} onChange={setChildRows} /></div>}
      <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDialog(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">关闭</button>{dialog.kind !== "detail" && <button type="submit" disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">确定</button>}</div>
    </form></div>}
  </div></main>
}

function ChildTables({ children, rows, readOnly, options = {}, onChange }: { children: OnlineRuntimeChildBinding[]; rows: Record<string, Array<Record<string, unknown>>>; readOnly: boolean; options?: Record<string, DictOption[]>; onChange?: (rows: Record<string, Array<Record<string, unknown>>>) => void }) {
  const [tab, setTab] = useState(children[0]?.code ?? "")
  const useTabs = children.some((child) => child.display === "TABS")
  const current = tab || children[0]?.code
  const visible = useTabs ? children.filter((child) => child.code === current) : children
  if (!children.length) return <p className="text-sm text-slate-400">当前 Release 未绑定子表。</p>
  return <div className="space-y-3">
    {useTabs && <div className="flex gap-4 border-b">{children.map((child) => <button key={child.code} type="button" onClick={() => setTab(child.code)} className={`h-9 border-b-2 px-1 text-sm ${current === child.code ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500"}`}>{child.runtime.definitionName}</button>)}</div>}
    {visible.map((child) => {
      const fields = writableFields(child.runtime.interaction.fields, child.runtime.model.fields, "form")
      const list = rows[child.code] ?? []
      return <div key={child.code} className="rounded-lg border border-slate-200"><div className="flex items-center justify-between px-3 py-2"><span className="text-sm font-medium">{child.runtime.definitionName}</span>{!readOnly && <button type="button" onClick={() => onChange?.({ ...rows, [child.code]: [...list, {}] })} className="text-xs text-blue-700">新增行</button>}</div>
        <table className="w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr>{fields.map(({ interaction }) => <th key={interaction.code} className="px-3 py-2">{interaction.label}</th>)}{!readOnly && <th className="px-3 py-2 text-right">操作</th>}</tr></thead>
          <tbody>{list.length ? list.map((row, index) => <tr key={index} className="border-t">{fields.map(({ field, interaction }) => <td key={field.code} className="px-3 py-2">{readOnly ? displayValue(row[field.code], interaction.detail.formatter) : <input className="h-8 w-full rounded border px-2" value={row[field.code] == null ? "" : String(row[field.code])} onChange={(event) => { const next = list.map((item, position) => position === index ? { ...item, [field.code]: coerceFieldValue(field, event.target.value) } : item); onChange?.({ ...rows, [child.code]: next }) }} />}</td>)}{!readOnly && <td className="px-3 py-2 text-right"><button type="button" onClick={() => onChange?.({ ...rows, [child.code]: list.filter((_, position) => position !== index) })} className="text-rose-600">删除</button></td>}</tr>) : <tr><td colSpan={fields.length + (readOnly ? 0 : 1)} className="px-3 py-6 text-center text-slate-400">暂无子表数据</td></tr>}</tbody>
        </table>
      </div>
    })}
  </div>
}
