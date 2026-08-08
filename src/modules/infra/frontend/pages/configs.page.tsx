"use client"

import { useState, useEffect, useCallback } from "react"

type InfraConfig = { id: string; category: string; name: string; configKey: string; value: string; visible: boolean; remark: string | null; createdAt: string }
type PageData = { items: InfraConfig[]; total: number; page: number; pageSize: number }

const API = "/api/v1/admin/infra/configs"

export default function InfraConfigsPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<InfraConfig | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams({ page: String(page), pageSize: "20" })
      if (keyword) sp.set("keyword", keyword)
      const res = await fetch(`${API}?${sp}`).then((r) => r.json())
      if (res.success) setData(res.data)
    } finally { setLoading(false) }
  }, [page, keyword])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (config: InfraConfig) => {
    if (!confirm(`确认删除配置「${config.name}」？`)) return
    const res = await fetch(`${API}/${config.id}`, { method: "DELETE" }).then((r) => r.json())
    if (res.success) loadData(); else alert(res.error)
  }

  const handleSubmit = async (formData: Record<string, any>) => {
    const res = editing
      ? await fetch(`${API}/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }).then((r) => r.json())
      : await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }).then((r) => r.json())
    if (res.success) { setShowForm(false); loadData() } else alert(res.error)
  }

  const totalPages = Math.ceil(data.total / data.pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div><h1 className="text-lg font-semibold text-slate-900">系统配置</h1><p className="mt-0.5 text-sm text-slate-500">管理系统运行参数与配置项</p></div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">新增配置</button>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center gap-3">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadData()} placeholder="配置名 / Key" className="h-9 w-56 rounded-md border px-3 text-sm" />
          <button onClick={() => { setPage(1); loadData() }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
          <button onClick={() => { setKeyword(""); setPage(1) }} className="h-9 rounded-md border px-4 text-sm">重置</button>
          <span className="ml-auto text-xs text-slate-400">共 {data.total} 条</span>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
            <th className="px-4 py-3">配置名称</th><th className="px-4 py-3">Key</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">分类</th><th className="px-4 py-3 text-right">操作</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr>
            : data.items.length === 0 ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">暂无数据</td></tr>
            : data.items.map((config) => (
              <tr key={config.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{config.name}</td>
                <td className="px-4 py-3"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{config.configKey}</code></td>
                <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{config.value}</td>
                <td className="px-4 py-3"><span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{config.category}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditing(config); setShowForm(true) }} className="mr-2 text-blue-600 hover:text-blue-800">编辑</button>
                  <button onClick={() => handleDelete(config)} className="text-red-600 hover:text-red-800">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && <div className="flex items-center justify-between border-t px-4 py-3"><span className="text-xs text-slate-500">第 {page}/{totalPages} 页</span><div className="flex gap-1"><button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">上一页</button><button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">下一页</button></div></div>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-base font-semibold">{editing ? "编辑配置" : "新增配置"}</h2>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleSubmit({ name: fd.get("name"), configKey: fd.get("configKey"), value: fd.get("value"), category: fd.get("category") || "DEFAULT", remark: fd.get("remark") || undefined }) }} className="space-y-3">
              <div><label className="mb-1 block text-xs text-slate-600">配置名称 *</label><input name="name" required defaultValue={editing?.name ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div><label className="mb-1 block text-xs text-slate-600">Key *</label><input name="configKey" required defaultValue={editing?.configKey ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" disabled={Boolean(editing)} /></div>
              <div><label className="mb-1 block text-xs text-slate-600">Value *</label><input name="value" required defaultValue={editing?.value ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div><label className="mb-1 block text-xs text-slate-600">分类</label><input name="category" defaultValue={editing?.category ?? "DEFAULT"} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div><label className="mb-1 block text-xs text-slate-600">备注</label><input name="remark" defaultValue={editing?.remark ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowForm(false)} className="h-9 rounded-md border px-4 text-sm">取消</button><button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">确认</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
