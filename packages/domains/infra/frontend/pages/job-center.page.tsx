"use client"

import { useState, useEffect, useCallback } from "react"
import { request, API } from "@/modules/shared/frontend/lib/request"
import { Pagination } from "@/modules/shared/frontend/components/pagination"

type InfraJob = { id: string; name: string; handlerName: string; handlerParam: string | null; cronExpression: string; retryCount: number; status: string; createdAt: string }
type PageData = { items: InfraJob[]; total: number; page: number; pageSize: number }

export default function InfraJobCenterPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<InfraJob | null>(null)

  const loadData = useCallback(async (p = page, ps = pageSize, kw = keyword) => {
    setLoading(true)
    try {
      const res = await request.get(API.JOBS, { page: p, pageSize: ps, keyword: kw || undefined })
      if (res.success) setData(res.data)
    } finally { setLoading(false) }
  }, [page, pageSize, keyword])

  useEffect(() => {
    loadData(page, pageSize, keyword)
  }, [loadData, page, pageSize])

  const handleTrigger = async (job: InfraJob) => {
    const res = await request.patch(`${API.JOBS}/${job.id}`, { action: "trigger" })
    if (res.success) alert(res.data.message); else alert(res.error)
  }

  const handleToggleStatus = async (job: InfraJob) => {
    const newStatus = job.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    const res = await request.patch(`${API.JOBS}/${job.id}`, { action: "updateStatus", status: newStatus })
    if (res.success) loadData(page, pageSize, keyword); else alert(res.error)
  }

  const handleDelete = async (job: InfraJob) => {
    if (!confirm(`确认删除任务「${job.name}」？`)) return
    const res = await request.delete(`${API.JOBS}/${job.id}`)
    if (res.success) loadData(page, pageSize, keyword); else alert(res.error)
  }

  const handleSubmit = async (formData: Record<string, any>) => {
    const res = editing
      ? await request.put(`${API.JOBS}/${editing.id}`, formData)
      : await request.post(API.JOBS, formData)
    if (res.success) { setShowForm(false); loadData(page, pageSize, keyword) } else alert(res.error)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div><h1 className="text-lg font-semibold text-slate-900">定时任务</h1><p className="mt-0.5 text-sm text-slate-500">管理系统定时任务调度</p></div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">新增任务</button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-white p-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索任务名称 / Handler"
          className="h-9 w-64 rounded-md border px-3 text-sm"
        />
        <button onClick={() => { setPage(1); loadData(1, pageSize, keyword) }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
        <button onClick={() => { setKeyword(""); setPage(1); loadData(1, pageSize, "") }} className="h-9 rounded-md border px-4 text-sm">重置</button>
        <span className="ml-auto text-xs text-slate-500">
          共 <span className="font-semibold text-slate-900">{data.total}</span> 个任务
        </span>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
            <th className="px-4 py-3">任务名称</th><th className="px-4 py-3">Handler</th><th className="px-4 py-3">Cron</th><th className="px-4 py-3">状态</th><th className="px-4 py-3 text-right">操作</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="py-8 text-center text-slate-400">加载中...</td></tr>
            : data.items.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-slate-400">暂无数据</td></tr>
            : data.items.map((job) => (
              <tr key={job.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{job.name}</td>
                <td className="px-4 py-3"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{job.handlerName}</code></td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{job.cronExpression}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggleStatus(job)} className={`rounded-full px-2 py-0.5 text-xs font-medium ${job.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {job.status === "ACTIVE" ? "运行中" : "已暂停"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleTrigger(job)} className="mr-2 text-amber-600 hover:text-amber-800">执行</button>
                  <button onClick={() => { setEditing(job); setShowForm(true) }} className="mr-2 text-blue-600 hover:text-blue-800">编辑</button>
                  <button onClick={() => handleDelete(job)} className="text-red-600 hover:text-red-800">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 通用底部分页控件 */}
      <Pagination
        total={data.total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => {
          setPage(p)
          loadData(p, pageSize, keyword)
        }}
        onPageSizeChange={(ps) => {
          setPageSize(ps)
          setPage(1)
          loadData(1, ps, keyword)
        }}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-base font-semibold">{editing ? "编辑任务" : "新增任务"}</h2>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleSubmit({ name: fd.get("name"), handlerName: fd.get("handlerName"), handlerParam: fd.get("handlerParam") || undefined, cronExpression: fd.get("cronExpression"), retryCount: Number(fd.get("retryCount") || 0), status: fd.get("status") }) }} className="space-y-3">
              <div><label className="mb-1 block text-xs text-slate-600">任务名称 *</label><input name="name" required defaultValue={editing?.name ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div><label className="mb-1 block text-xs text-slate-600">Handler *</label><input name="handlerName" required defaultValue={editing?.handlerName ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div><label className="mb-1 block text-xs text-slate-600">参数</label><input name="handlerParam" defaultValue={editing?.handlerParam ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" placeholder="JSON 格式" /></div>
              <div><label className="mb-1 block text-xs text-slate-600">Cron 表达式 *</label><input name="cronExpression" required defaultValue={editing?.cronExpression ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" placeholder="0 0 2 * * ?" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-xs text-slate-600">重试次数</label><input name="retryCount" type="number" defaultValue={editing?.retryCount ?? 0} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
                <div><label className="mb-1 block text-xs text-slate-600">状态</label><select name="status" defaultValue={editing?.status ?? "ACTIVE"} className="h-9 w-full rounded-md border px-3 text-sm"><option value="ACTIVE">启用</option><option value="DISABLED">暂停</option></select></div>
              </div>
              <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowForm(false)} className="h-9 rounded-md border px-4 text-sm">取消</button><button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">确认</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
