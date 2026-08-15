"use client"

import { useEffect, useMemo, useState } from "react"
import { request } from "@/modules/shared/frontend/lib/request"
import { OnlinePuckDesigner } from "@/modules/online/frontend/puck/online-puck-designer"
import type { OnlineDefinitionDetail, OnlineDefinitionPage, OnlineDefinitionSummary } from "@/modules/online/backend/application/online-definition.contract"

const endpoint = "/api/v1/admin/online/definitions"
const exampleModel = { version: 1, storage: { kind: "GENERIC_RECORD" }, fields: [{ code: "name", type: "string", nullable: false, length: 100 }], indexes: [] }
const exampleInteraction = { version: 1, fields: [{ code: "name", label: "名称", widget: "TEXT", query: { enabled: true, operator: "LIKE" }, visibility: { list: true, form: true, detail: true }, readOnly: false }] }

type CreateForm = { code: string; name: string; modelType: "SINGLE" | "TREE" | "MASTER_DETAIL" }

export default function OnlineDefinitionsPage() {
  const [page, setPage] = useState<OnlineDefinitionPage | null>(null)
  const [detail, setDetail] = useState<OnlineDefinitionDetail | null>(null)
  const [createForm, setCreateForm] = useState<CreateForm>({ code: "", name: "", modelType: "SINGLE" })
  const [modelText, setModelText] = useState(JSON.stringify(exampleModel, null, 2))
  const [interactionText, setInteractionText] = useState(JSON.stringify(exampleInteraction, null, 2))
  const [views, setViews] = useState<NonNullable<OnlineDefinitionDetail["revision"]>["views"]>([])
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  const lockVersion = detail?.lockVersion
  const releases = useMemo(() => detail?.releases ?? [], [detail])

  const loadPage = async () => {
    const response = await request.get<OnlineDefinitionPage>(endpoint, { page: 1, pageSize: 100 })
    if (response.success && response.data) setPage(response.data)
    else setMessage(response.error ?? "Online 定义加载失败")
  }
  const loadDetail = async (code: string) => {
    const response = await request.get<OnlineDefinitionDetail>(`${endpoint}/${code}`)
    if (!response.success || !response.data) { setMessage(response.error ?? "Online 定义详情加载失败"); return }
    setDetail(response.data)
    setModelText(JSON.stringify(response.data.revision?.model ?? exampleModel, null, 2))
    setInteractionText(JSON.stringify(response.data.revision?.interaction ?? exampleInteraction, null, 2))
    setViews(response.data.revision?.views ?? [])
  }

  useEffect(() => { void loadPage() }, [])

  const create = async () => {
    setBusy(true); setMessage("")
    try {
      const response = await request.post<OnlineDefinitionSummary>(endpoint, createForm)
      if (!response.success || !response.data) { setMessage(response.error ?? "创建失败"); return }
      setCreateForm({ code: "", name: "", modelType: "SINGLE" })
      await Promise.all([loadPage(), loadDetail(response.data.code)])
      setMessage("Definition 已创建，请配置 Draft 数据模型")
    } finally { setBusy(false) }
  }

  const saveDraft = async () => {
    if (!detail || !lockVersion) return
    setBusy(true); setMessage("")
    try {
      const response = await request.put<OnlineDefinitionDetail>(`${endpoint}/${detail.code}/draft`, { expectedLockVersion: lockVersion, model: JSON.parse(modelText), interaction: JSON.parse(interactionText), views: views.map(({ code, kind, puckData, version }) => ({ code, kind, puckData, version })) })
      if (!response.success || !response.data) { setMessage(response.error ?? "Draft 保存失败"); return }
      setDetail(response.data); setViews(response.data.revision?.views ?? []); setMessage("Draft 已保存；字段投影和受控 Puck 视图均已同步，需重新校验后才能发布")
    } catch { setMessage("模型或交互 JSON 格式无效") } finally { setBusy(false) }
  }

  const lifecycle = async (path: string, body: Record<string, unknown>, success: string) => {
    if (!detail) return
    setBusy(true); setMessage("")
    try {
      const response = await request.post(`${endpoint}/${detail.code}${path}`, body)
      if (!response.success) { setMessage(response.error ?? "操作失败"); return }
      await Promise.all([loadDetail(detail.code), loadPage()])
      setMessage(success)
    } finally { setBusy(false) }
  }

  return <main className="mx-auto max-w-7xl space-y-5 p-6">
    <header className="rounded-lg border bg-white p-5"><p className="text-sm font-medium text-blue-700">Online 低代码引擎</p><h1 className="mt-1 text-2xl font-semibold">Online Definition 工作台</h1><p className="mt-2 text-sm text-slate-600">配置模型、字段交互、Draft 校验、Schema Plan、不可变 Release 与回滚。只支持受控元数据，不接受 SQL、脚本、URL 或动态 DDL。</p></header>
    {message && <p className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{message}</p>}
    <section className="rounded-lg border bg-white p-4"><div className="mb-3 text-sm font-medium">新建 Online Definition</div><div className="grid gap-3 md:grid-cols-4"><input value={createForm.code} onChange={(event) => setCreateForm({ ...createForm, code: event.target.value })} placeholder="code，例如 customer" className="h-9 rounded border px-3 text-sm" /><input value={createForm.name} onChange={(event) => setCreateForm({ ...createForm, name: event.target.value })} placeholder="名称" className="h-9 rounded border px-3 text-sm" /><select value={createForm.modelType} onChange={(event) => setCreateForm({ ...createForm, modelType: event.target.value as CreateForm["modelType"] })} className="h-9 rounded border px-3 text-sm"><option value="SINGLE">单表 SINGLE</option><option value="TREE">树 TREE</option><option value="MASTER_DETAIL">主子表 MASTER_DETAIL</option></select><button disabled={busy || !createForm.code || !createForm.name} onClick={() => void create()} className="h-9 rounded bg-blue-600 px-4 text-sm font-medium text-white disabled:opacity-50">创建</button></div></section>
    <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
      <aside className="rounded-lg border bg-white"><div className="border-b px-4 py-3 text-sm font-medium">Definitions（{page?.total ?? 0}）</div><div className="max-h-[42rem] overflow-auto">{page?.items.map((item) => <button key={item.id} onClick={() => void loadDetail(item.code)} className={`block w-full border-b px-4 py-3 text-left text-sm hover:bg-slate-50 ${detail?.code === item.code ? "bg-blue-50" : ""}`}><div className="font-medium">{item.name}</div><div className="mt-1 text-xs text-slate-500">{item.code} · {item.modelType} · {item.status}</div></button>)}</div></aside>
      <section className="space-y-4">{detail ? <><div className="rounded-lg border bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">{detail.name} <code className="ml-1 text-xs text-slate-500">{detail.code}</code></h2><p className="mt-1 text-xs text-slate-500">Draft #{detail.revision?.sequence ?? "-"} · {detail.revision?.status ?? "-"} · lock {detail.lockVersion}</p></div><div className="flex flex-wrap gap-2"><button disabled={busy} onClick={() => void lifecycle("/validate", { expectedLockVersion: detail.lockVersion }, "Draft 校验已通过") } className="rounded border px-3 py-2 text-sm disabled:opacity-50">校验</button><button disabled={busy} onClick={() => void lifecycle("/schema-plans", { expectedLockVersion: detail.lockVersion }, "Schema Plan 已生成；本阶段不会执行 DDL") } className="rounded border px-3 py-2 text-sm disabled:opacity-50">生成 Plan</button><button disabled={busy || detail.revision?.status !== "VALIDATED"} onClick={() => void lifecycle("/publish", { expectedLockVersion: detail.lockVersion }, "Release 已发布，并已创建下一份 Draft") } className="rounded bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-50">发布</button>{detail.publishedReleaseId && <a href={`/admin/infra/online-test?definition=${encodeURIComponent(detail.code)}`} className="rounded border border-blue-200 px-3 py-2 text-sm text-blue-700">进入测试</a>}</div></div></div>
<div className="grid gap-4 xl:grid-cols-2"><label className="rounded-lg border bg-white p-4"><span className="mb-2 block text-sm font-medium">Model IR</span><textarea value={modelText} onChange={(event) => setModelText(event.target.value)} spellCheck={false} className="h-[27rem] w-full rounded border bg-slate-950 p-3 font-mono text-xs text-slate-100" /></label><label className="rounded-lg border bg-white p-4"><span className="mb-2 block text-sm font-medium">Field Interaction IR</span><textarea value={interactionText} onChange={(event) => setInteractionText(event.target.value)} spellCheck={false} className="h-[27rem] w-full rounded border bg-slate-950 p-3 font-mono text-xs text-slate-100" /></label></div><OnlinePuckDesigner definitionCode={detail.code} views={views} disabled={busy} onChange={(next) => setViews(next as NonNullable<OnlineDefinitionDetail["revision"]>["views"])} /><div className="rounded-lg border bg-white p-4"><div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-medium">Draft 字段投影</h3><p className="mt-1 text-xs text-slate-500">由 Model + Interaction IR 同事务生成，不可独立编辑。</p></div><button disabled={busy} onClick={() => void saveDraft()} className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50">保存 Draft</button></div><div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-xs text-slate-500"><tr><th className="p-2">字段</th><th className="p-2">标签</th><th className="p-2">类型</th><th className="p-2">必填</th><th className="p-2">控件</th></tr></thead><tbody>{detail.revision?.fields.map((field) => <tr key={field.code} className="border-b last:border-0"><td className="p-2 font-mono text-xs">{field.code}</td><td className="p-2">{field.label}</td><td className="p-2">{field.fieldType}</td><td className="p-2">{field.required ? "是" : "否"}</td><td className="p-2">{String(field.config.widget ?? "-")}</td></tr>)}</tbody></table></div></div><div className="rounded-lg border bg-white p-4"><h3 className="text-sm font-medium">Release 与回滚</h3><div className="mt-3 space-y-2">{releases.length ? releases.map((release) => <div key={release.id} className="flex flex-wrap items-center justify-between gap-2 rounded border p-3 text-sm"><span>Release #{release.releaseNo} · schema {release.schemaRevision} · <code className="text-xs">{release.checksum.slice(0, 12)}</code></span><button disabled={busy || release.id === detail.publishedReleaseId} onClick={() => void lifecycle("/rollback", { expectedLockVersion: detail.lockVersion, releaseId: release.id }, `已回滚到 Release #${release.releaseNo}`)} className="rounded border px-3 py-1 text-xs disabled:opacity-50">{release.id === detail.publishedReleaseId ? "当前发布版" : "回滚到此版本"}</button></div>) : <p className="text-sm text-slate-500">尚未发布 Release。</p>}</div></div></> : <div className="rounded-lg border border-dashed bg-white p-10 text-center text-sm text-slate-500">请选择或创建一个 Online Definition。</div>}</section>
    </div>
    <p className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">当前工作台支持受控模型、共享 allowlist 的 Puck 页面 Draft/校验/Release 快照和 sandbox Online Test。生产 Runtime CRUD、TREE/MASTER_DETAIL 测试、工作流、报表/图表和 Release 代码生成仍未启用。</p>
  </main>
}
