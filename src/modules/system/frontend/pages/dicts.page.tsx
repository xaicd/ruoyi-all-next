"use client"

import { useState, useEffect, useCallback } from "react"
import { request, API } from "@/modules/shared/frontend/lib/request"

type DictType = { id: string; name: string; type: string; status: string; remark: string | null; createdAt: string }
type PageData = { items: DictType[]; total: number; page: number; pageSize: number }

export default function SystemDictsPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<DictType | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await request.get(API.DICTS, { page, pageSize: 20, keyword: keyword || undefined })
      if (res.success) setData(res.data)
    } finally { setLoading(false) }
  }, [page, keyword])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (dict: DictType) => {
    if (!confirm(`确认删除字典「${dict.name}」？`)) return
    const res = await request.delete(`${API.DICTS}/${dict.id}`)
    if (res.success) loadData(); else alert(res.error)
  }

  const handleSubmit = async (formData: Record<string, any>) => {
    const res = editing
      ? await request.put(`${API.DICTS}/${editing.id}`, formData)
      : await request.post(API.DICTS, formData)
    if (res.success) { setShowForm(false); loadData() } else alert(res.error)
  }

  const totalPages = Math.ceil(data.total / data.pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">字典管理</h1>
          <p className="mt-0.5 text-sm text-slate-500">系统字典类型与数据维护</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
          新增字典
        </button>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center gap-3">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadData()} placeholder="字典名称 / 类型编码" className="h-9 w-56 rounded-md border px-3 text-sm" />
          <button onClick={() => { setPage(1); loadData() }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
          <button onClick={() => { setKeyword(""); setPage(1) }} className="h-9 rounded-md border px-4 text-sm">重置</button>
          <span className="ml-auto text-xs text-slate-400">共 {data.total} 条</span>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
              <th className="px-4 py-3">字典名称</th>
              <th className="px-4 py-3">字典类型</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">备注</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr>
            ) : data.items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">暂无数据</td></tr>
            ) : (
              data.items.map((dict) => (
                <tr key={dict.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{dict.name}</td>
                  <td className="px-4 py-3"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{dict.type}</code></td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${dict.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {dict.status === "ACTIVE" ? "启用" : "禁用"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{dict.remark || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setEditing(dict); setShowForm(true) }} className="mr-2 text-blue-600 hover:text-blue-800">编辑</button>
                    <button onClick={() => handleDelete(dict)} className="text-red-600 hover:text-red-800">删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-xs text-slate-500">第 {page}/{totalPages} 页</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">上一页</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">下一页</button>
            </div>
          </div>
        )}
      </div>

      {showForm && <DictFormDialog dict={editing} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}
    </div>
  )
}


function DictFormDialog({ dict, onSubmit, onClose }: { dict: DictType | null; onSubmit: (d: Record<string, any>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: dict?.name ?? "", type: dict?.type ?? "", status: dict?.status ?? "ACTIVE", remark: dict?.remark ?? "" })
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-base font-semibold">{dict ? "编辑字典" : "新增字典"}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, remark: form.remark || undefined }) }} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-600">字典名称 *</label>
            <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-600">字典类型 *</label>
            <input required value={form.type} onChange={(e) => update("type", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" placeholder="system_user_sex" disabled={Boolean(dict)} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-600">状态</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm">
              <option value="ACTIVE">启用</option>
              <option value="DISABLED">禁用</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-600">备注</label>
            <input value={form.remark} onChange={(e) => update("remark", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-9 rounded-md border px-4 text-sm">取消</button>
            <button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">确认</button>
          </div>
        </form>
      </div>
    </div>
  )
}
