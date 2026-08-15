"use client"

import Link from "next/link"
import { createPortal } from "react-dom"
import { useEffect, useState, type FormEvent, type MouseEvent } from "react"
import { request } from "@/modules/shared/frontend/lib/request"
import type { OnlineDefinitionPage, OnlineDefinitionSummary, OnlineModelType } from "@/modules/online/backend/application/online-definition.contract"

const endpoint = "/api/v1/admin/online/definitions"
const PAGE_SIZE = 20
const MORE_MENU_WIDTH = 156
const MORE_MENU_HEIGHT = 184
type MoreMenu = { item: OnlineDefinitionSummary; left: number; top: number }
type ConfirmAction = { item: OnlineDefinitionSummary; kind: "archive" | "delete" }
type NoticeTone = "success" | "error"
type Filters = { keyword: string; modelType: "" | OnlineModelType; status: "" | "DRAFT" | "ACTIVE" }

const modelTypeLabels: Record<OnlineModelType, string> = { SINGLE: "单表", TREE: "树表", MASTER_DETAIL: "主子表" }
const statusLabels: Record<"DRAFT" | "ACTIVE", string> = { DRAFT: "草稿", ACTIVE: "已发布" }
const planStatusLabels: Record<NonNullable<OnlineDefinitionSummary["latestSchemaPlan"]>["status"], string> = { DRAFT: "草稿", REVIEW_REQUIRED: "待审核", APPROVED: "已批准", APPLYING: "执行中", APPLIED: "已应用", FAILED: "失败", SUPERSEDED: "已废弃" }

function statusClass(status: string) { return status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700" }
function planClass(status: string) { return status === "APPROVED" || status === "APPLIED" ? "bg-emerald-50 text-emerald-700" : status === "FAILED" ? "bg-rose-50 text-rose-700" : status === "SUPERSEDED" ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700" }
function formatTime(value: string) { return new Date(value).toLocaleString("zh-CN", { hour12: false }) }

export default function OnlineDefinitionsListPage() {
  const [page, setPage] = useState<OnlineDefinitionPage | null>(null)
  const [filters, setFilters] = useState<Filters>({ keyword: "", modelType: "", status: "" })
  const [appliedFilters, setAppliedFilters] = useState<Filters>({ keyword: "", modelType: "", status: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const [message, setMessage] = useState("")
  const [messageTone, setMessageTone] = useState<NoticeTone>("success")
  const [loaded, setLoaded] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [operatingCode, setOperatingCode] = useState<string | null>(null)
  const [moreMenu, setMoreMenu] = useState<MoreMenu | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)

  const loadPage = async (targetPage = currentPage, targetFilters = appliedFilters) => {
    setRefreshing(true); setMessage("")
    try {
      const response = await request.get<OnlineDefinitionPage>(endpoint, { page: targetPage, pageSize: PAGE_SIZE, ...(targetFilters.keyword ? { keyword: targetFilters.keyword } : {}), ...(targetFilters.modelType ? { modelType: targetFilters.modelType } : {}), ...(targetFilters.status ? { status: targetFilters.status } : {}) })
      if (response.success && response.data) setPage(response.data)
      else { setMessageTone("error"); setMessage(response.error ?? "Online 定义加载失败") }
    } finally { setLoaded(true); setRefreshing(false) }
  }

  useEffect(() => { void loadPage(1, appliedFilters) }, [appliedFilters])
  useEffect(() => {
    if (!moreMenu) return
    const close = () => setMoreMenu(null)
    window.addEventListener("scroll", close, true); window.addEventListener("resize", close)
    return () => { window.removeEventListener("scroll", close, true); window.removeEventListener("resize", close) }
  }, [moreMenu])

  const submitQuery = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setCurrentPage(1); setAppliedFilters({ ...filters, keyword: filters.keyword.trim() }) }
  const resetQuery = () => { const empty: Filters = { keyword: "", modelType: "", status: "" }; setFilters(empty); setCurrentPage(1); setAppliedFilters(empty) }
  const changePage = (nextPage: number) => { setCurrentPage(nextPage); void loadPage(nextPage) }

  const run = async (item: OnlineDefinitionSummary, action: () => Promise<{ success: boolean; error?: string }>, success: string) => {
    setMoreMenu(null); setOperatingCode(item.code); setMessage("")
    try {
      const response = await action()
      if (!response.success) { setMessageTone("error"); setMessage(response.error ?? "操作失败"); return }
      await loadPage(); setMessageTone("success"); setMessage(success)
    } finally { setOperatingCode(null) }
  }

  const syncDatabase = async (item: OnlineDefinitionSummary) => run(item, () => request.post(`${endpoint}/${item.code}/schema-plans`, { expectedLockVersion: item.lockVersion }), "同步计划已生成；当前平台不会执行动态 DDL")
  const requestConfirmation = (item: OnlineDefinitionSummary, kind: ConfirmAction["kind"]) => { setMoreMenu(null); setConfirmAction({ item, kind }) }
  const executeConfirmedAction = async () => {
    if (!confirmAction) return
    const { item, kind } = confirmAction; setConfirmAction(null)
    if (kind === "archive") await run(item, () => request.post(`${endpoint}/${item.code}/archive`, { expectedLockVersion: item.lockVersion }), "已移除并归档")
    else await run(item, () => request.delete(`${endpoint}/${item.code}`, { expectedLockVersion: item.lockVersion }), "已删除")
  }
  const openMore = (event: MouseEvent<HTMLButtonElement>, item: OnlineDefinitionSummary) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setMoreMenu({ item, top: rect.bottom + MORE_MENU_HEIGHT > window.innerHeight - 12 ? Math.max(12, rect.top - MORE_MENU_HEIGHT - 6) : rect.bottom + 6, left: Math.max(12, Math.min(window.innerWidth - MORE_MENU_WIDTH - 12, rect.right - MORE_MENU_WIDTH)) })
  }

  const totalPages = Math.max(1, Math.ceil((page?.total ?? 0) / PAGE_SIZE))
  const busy = (item: OnlineDefinitionSummary) => operatingCode === item.code
  return <main className="min-h-full bg-slate-50 p-4 lg:p-6"><div className="mx-auto max-w-[1500px] space-y-4">
    <header className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-xs font-semibold text-blue-600">ONLINE LOW-CODE · BUSINESS MODELS</div><h1 className="mt-1 text-xl font-semibold text-slate-900">业务模型</h1><p className="mt-1 text-sm text-slate-500">业务模型用于在线设计库表与页面；校验后生成 Schema Plan，发布 Release 后可生成 RuoYi CRUD 代码。</p></div><div className="flex gap-2"><Link href="/admin/infra/online-test" className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">在线测试</Link><Link href="/admin/infra/online-definitions/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">+ 新建业务模型</Link></div></div></header>
    {message && <div role="status" className={`rounded-lg border px-4 py-3 text-sm ${messageTone === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{message}</div>}
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><form onSubmit={submitQuery} className="grid gap-3 border-b p-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_auto]"><label className="grid gap-1 text-sm text-slate-600"><span>模型名称 / 表编码</span><input value={filters.keyword} onChange={(event) => setFilters((current) => ({ ...current, keyword: event.target.value }))} placeholder="请输入业务模型名称或表编码" className="h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"/></label><label className="grid gap-1 text-sm text-slate-600"><span>表类型</span><select value={filters.modelType} onChange={(event) => setFilters((current) => ({ ...current, modelType: event.target.value as Filters["modelType"] }))} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="">全部类型</option><option value="SINGLE">单表</option><option value="TREE">树表</option><option value="MASTER_DETAIL">主子表</option></select></label><label className="grid gap-1 text-sm text-slate-600"><span>状态</span><select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as Filters["status"] }))} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="">全部状态</option><option value="DRAFT">草稿</option><option value="ACTIVE">已发布</option></select></label><div className="flex items-end gap-2"><button type="submit" disabled={refreshing} className="h-9 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white disabled:opacity-50">查询</button><button type="button" disabled={refreshing} onClick={resetQuery} className="h-9 rounded-lg border border-slate-200 px-4 text-sm text-slate-700 disabled:opacity-50">重置</button></div></form>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"><span className="text-sm font-medium text-slate-800">业务模型列表</span><span className="text-xs text-slate-500">共 {page?.total ?? 0} 个业务模型；Release 为不可变发布快照。</span></div>
      <div className="overflow-x-auto"><table className="min-w-[1120px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-3">模型类型</th><th className="px-4 py-3">表编码</th><th className="px-4 py-3">业务模型名称</th><th className="px-4 py-3">版本</th><th className="px-4 py-3">Schema 计划状态</th><th className="px-4 py-3">创建时间</th><th className="px-5 py-3 text-right">操作</th></tr></thead><tbody>{!loaded ? <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">加载中…</td></tr> : page?.items.length ? page.items.map((item) => <tr key={item.id} className="border-t border-slate-100 hover:bg-blue-50/40"><td className="px-5 py-4"><span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">{modelTypeLabels[item.modelType]}</span></td><td className="px-4 py-4 font-mono text-xs text-slate-600">{item.code}</td><td className="px-4 py-4"><div className="font-medium text-slate-800">{item.name}</div><span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(item.status)}`}>{statusLabels[item.status as "DRAFT" | "ACTIVE"] ?? item.status}</span></td><td className="px-4 py-4 text-xs text-slate-600">{item.currentRelease ? <><div>Release {item.currentRelease.releaseNo}</div><div className="mt-1 text-slate-400">模型 v{item.currentRelease.schemaRevision}</div></> : <><div>未发布</div><div className="mt-1 text-slate-400">Draft · lock {item.lockVersion}</div></>}</td><td className="px-4 py-4 text-xs">{item.latestSchemaPlan ? <><span className={`rounded-full px-2 py-1 font-medium ${planClass(item.latestSchemaPlan.status)}`}>{planStatusLabels[item.latestSchemaPlan.status]}</span><div className="mt-1 text-slate-400">风险：{item.latestSchemaPlan.risk}</div></> : <span className="text-slate-400">未生成计划</span>}</td><td className="px-4 py-4 text-xs text-slate-500">{formatTime(item.createdAt)}</td><td className="px-5 py-4 text-right"><div className="flex items-center justify-end gap-3 whitespace-nowrap"><Link href={`/admin/infra/online-definitions/${encodeURIComponent(item.code)}`} className="text-blue-700 hover:text-blue-800">编辑</Link><button disabled={busy(item)} onClick={(event) => openMore(event, item)} className="text-blue-700 hover:text-blue-800 disabled:opacity-50">更多⌄</button></div></td></tr>) : <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">暂无符合条件的业务模型。</td></tr>}</tbody></table></div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500"><span>第 {page?.page ?? currentPage}/{totalPages} 页，每页 {PAGE_SIZE} 条</span><div className="flex gap-2"><button disabled={refreshing || currentPage <= 1} onClick={() => changePage(currentPage - 1)} className="h-8 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 disabled:opacity-50">上一页</button><button disabled={refreshing || currentPage >= totalPages} onClick={() => changePage(currentPage + 1)} className="h-8 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 disabled:opacity-50">下一页</button></div></footer>
    </section>
    {moreMenu && typeof document !== "undefined" && createPortal(<><button aria-label="关闭更多操作" className="fixed inset-0 z-40 cursor-default" onClick={() => setMoreMenu(null)} /><div role="menu" className="fixed z-50 w-36 rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-xl" style={{ left: moreMenu.left, top: moreMenu.top }}>{moreMenu.item.publishedReleaseId ? <Link role="menuitem" onClick={() => setMoreMenu(null)} href={`/admin/infra/online-test?definition=${encodeURIComponent(moreMenu.item.code)}`} className="block px-3 py-2 hover:bg-slate-50">功能测试</Link> : <span className="block cursor-not-allowed px-3 py-2 text-slate-400" title="请先发布版本">功能测试（需发布）</span>}<button role="menuitem" onClick={() => void syncDatabase(moreMenu.item)} className="block w-full px-3 py-2 text-left hover:bg-slate-50">同步数据库</button><div className="my-1 border-t border-slate-100"/><button role="menuitem" onClick={() => requestConfirmation(moreMenu.item, "archive")} className="block w-full px-3 py-2 text-left hover:bg-slate-50">移除</button>{!moreMenu.item.publishedReleaseId && <button role="menuitem" onClick={() => requestConfirmation(moreMenu.item, "delete")} className="block w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50">删除</button>}</div></>, document.body)}
    {confirmAction && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4"><div role="dialog" aria-modal="true" aria-labelledby="online-action-title" className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"><h2 id="online-action-title" className="text-base font-semibold text-slate-900">{confirmAction.kind === "archive" ? "确认移除" : "确认删除"}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{confirmAction.kind === "archive" ? <>确认移除「{confirmAction.item.name}」？移除后将归档并从列表隐藏，已发布快照不会删除。</> : <>确认删除未发布表单「{confirmAction.item.name}」？该操作为软删除；若仍被其他表单关联，系统将拒绝删除。</>}</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setConfirmAction(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700">取消</button><button type="button" onClick={() => void executeConfirmedAction()} className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${confirmAction.kind === "delete" ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700"}`}>{confirmAction.kind === "archive" ? "确认移除" : "确认删除"}</button></div></div></div>}
  </div></main>
}
