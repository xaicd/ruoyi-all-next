"use client"

import { useState, useEffect, useCallback } from "react"

type CrmCustomer = { id: string; name: string; phone: string | null; email: string | null; industry: string | null; level: string; status: string; dealStatus: string; ownerUserName: string | null; contactLastTime: string | null; createdAt: string }
type PageData = { items: CrmCustomer[]; total: number; page: number; pageSize: number }

const API = "/api/v1/admin/crm/customers"

const levelColors: Record<string, string> = { A: "bg-red-50 text-red-700", B: "bg-orange-50 text-orange-700", C: "bg-blue-50 text-blue-700", D: "bg-slate-100 text-slate-600" }
const dealLabels: Record<string, string> = { PENDING: "待跟进", DEALING: "跟进中", DONE: "已成交", LOST: "已流失" }
const dealColors: Record<string, string> = { PENDING: "text-slate-500", DEALING: "text-blue-600", DONE: "text-green-600", LOST: "text-red-500" }

export default function CrmCustomersPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [levelFilter, setLevelFilter] = useState("")
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<CrmCustomer | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams({ page: String(page), pageSize: "20" })
      if (keyword) sp.set("keyword", keyword)
      if (levelFilter) sp.set("level", levelFilter)
      const res = await fetch(`${API}?${sp}`).then((r) => r.json())
      if (res.success) setData(res.data)
    } finally { setLoading(false) }
  }, [page, keyword, levelFilter])

  useEffect(() => { loadData() }, [loadData])

  const handleSubmit = async (formData: Record<string, any>) => {
    const res = editing
      ? await fetch(`${API}/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }).then((r) => r.json())
      : await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }).then((r) => r.json())
    if (res.success) { setShowForm(false); loadData() } else alert(res.error)
  }

  const handleDelete = async (customer: CrmCustomer) => {
    if (!confirm(`确认删除客户「${customer.name}」？`)) return
    const res = await fetch(`${API}/${customer.id}`, { method: "DELETE" }).then((r) => r.json())
    if (res.success) loadData(); else alert(res.error)
  }

  const totalPages = Math.ceil(data.total / data.pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div><h1 className="text-lg font-semibold text-slate-900">客户管理</h1><p className="mt-0.5 text-sm text-slate-500">CRM 客户信息维护与跟进</p></div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">新增客户</button>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadData()} placeholder="客户名 / 手机号" className="h-9 w-56 rounded-md border px-3 text-sm" />
          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="h-9 rounded-md border px-3 text-sm"><option value="">全部等级</option><option value="A">A 级</option><option value="B">B 级</option><option value="C">C 级</option><option value="D">D 级</option></select>
          <button onClick={() => { setPage(1); loadData() }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
          <button onClick={() => { setKeyword(""); setLevelFilter(""); setPage(1) }} className="h-9 rounded-md border px-4 text-sm">重置</button>
          <span className="ml-auto text-xs text-slate-400">共 {data.total} 条</span>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
            <th className="px-4 py-3">客户名称</th><th className="px-4 py-3">联系方式</th><th className="px-4 py-3">等级</th><th className="px-4 py-3">成交状态</th><th className="px-4 py-3">负责人</th><th className="px-4 py-3">最近联系</th><th className="px-4 py-3 text-right">操作</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr>
            : data.items.length === 0 ? <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">暂无数据</td></tr>
            : data.items.map((customer) => (
              <tr key={customer.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{customer.name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{customer.phone || customer.email || "-"}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${levelColors[customer.level] ?? ""}`}>{customer.level}</span></td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${dealColors[customer.dealStatus] ?? ""}`}>{dealLabels[customer.dealStatus] ?? customer.dealStatus}</span></td>
                <td className="px-4 py-3 text-xs">{customer.ownerUserName || <span className="text-amber-600">公海</span>}</td>
                <td className="px-4 py-3 text-xs text-slate-400">{customer.contactLastTime ? new Date(customer.contactLastTime).toLocaleDateString("zh-CN") : "-"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => { setEditing(customer); setShowForm(true) }} className="mr-2 text-blue-600">编辑</button>
                  <button onClick={() => handleDelete(customer)} className="text-red-600">删除</button>
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
            <h2 className="mb-4 text-base font-semibold">{editing ? "编辑客户" : "新增客户"}</h2>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleSubmit({ name: fd.get("name"), phone: fd.get("phone") || undefined, email: fd.get("email") || undefined, industry: fd.get("industry") || undefined, level: fd.get("level"), source: fd.get("source") || undefined, remark: fd.get("remark") || undefined }) }} className="space-y-3">
              <div><label className="mb-1 block text-xs text-slate-600">客户名称 *</label><input name="name" required defaultValue={editing?.name ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-xs text-slate-600">手机号</label><input name="phone" defaultValue={editing?.phone ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
                <div><label className="mb-1 block text-xs text-slate-600">邮箱</label><input name="email" type="email" defaultValue={editing?.email ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-xs text-slate-600">行业</label><input name="industry" defaultValue={editing?.industry ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
                <div><label className="mb-1 block text-xs text-slate-600">等级</label><select name="level" defaultValue={editing?.level ?? "C"} className="h-9 w-full rounded-md border px-3 text-sm"><option value="A">A 级</option><option value="B">B 级</option><option value="C">C 级</option><option value="D">D 级</option></select></div>
              </div>
              <div><label className="mb-1 block text-xs text-slate-600">来源</label><input name="source" defaultValue="" className="h-9 w-full rounded-md border px-3 text-sm" placeholder="官网/转介绍/展会..." /></div>
              <div><label className="mb-1 block text-xs text-slate-600">备注</label><input name="remark" defaultValue={editing?.remark ?? ""} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowForm(false)} className="h-9 rounded-md border px-4 text-sm">取消</button><button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">确认</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
