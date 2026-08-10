"use client"

import { useState, useEffect, useCallback } from "react"
import { request, API } from "@/modules/shared/frontend/lib/request"

type DeptNode = { id: string; name: string; parentId: string | null; sort: number; status: string; leaderId: string | null; phone: string | null; children: DeptNode[] }

export default function SystemDeptsPage() {
  const [tree, setTree] = useState<DeptNode[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<DeptNode | null>(null)
  const [parentId, setParentId] = useState<string | undefined>(undefined)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await request.get(API.DEPTS)
      if (res.success) setTree(res.data)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleCreate = (pid?: string) => { setEditing(null); setParentId(pid); setShowForm(true) }
  const handleEdit = (dept: DeptNode) => { setEditing(dept); setParentId(dept.parentId ?? undefined); setShowForm(true) }

  const handleDelete = async (dept: DeptNode) => {
    if (!confirm(`确认删除部门「${dept.name}」？`)) return
    const res = await request.delete(`${API.DEPTS}/${dept.id}`)
    if (res.success) loadData(); else alert(res.error)
  }

  const handleSubmit = async (formData: Record<string, any>) => {
    const res = editing
      ? await request.put(`${API.DEPTS}/${editing.id}`, formData)
      : await request.post(API.DEPTS, formData)
    if (res.success) { setShowForm(false); loadData() } else alert(res.error)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div><h1 className="text-lg font-semibold text-slate-900">部门管理</h1><p className="mt-0.5 text-sm text-slate-500">组织架构树形管理</p></div>
        <button onClick={() => handleCreate()} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">新增部门</button>
      </div>

      <div className="rounded-lg border bg-white p-4">
        {loading ? <p className="py-8 text-center text-slate-400">加载中...</p>
        : tree.length === 0 ? <p className="py-8 text-center text-slate-400">暂无数据</p>
        : <DeptTree nodes={tree} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} level={0} />}
      </div>

      {showForm && <DeptFormDialog dept={editing} parentId={parentId} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}
    </div>
  )
}

function DeptTree({ nodes, onEdit, onDelete, onCreate, level }: { nodes: DeptNode[]; onEdit: (d: DeptNode) => void; onDelete: (d: DeptNode) => void; onCreate: (pid: string) => void; level: number }) {
  return (
    <div className={level > 0 ? "ml-6 border-l pl-4" : ""}>
      {nodes.map((node) => (
        <div key={node.id} className="py-1.5">
          <div className="flex items-center gap-2 rounded px-2 py-1 hover:bg-slate-50">
            <span className="font-medium text-sm">{node.name}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${node.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{node.status === "ACTIVE" ? "启用" : "禁用"}</span>
            <span className="ml-auto flex gap-2 text-xs">
              <button onClick={() => onCreate(node.id)} className="text-green-600 hover:text-green-800">添加子部门</button>
              <button onClick={() => onEdit(node)} className="text-blue-600 hover:text-blue-800">编辑</button>
              <button onClick={() => onDelete(node)} className="text-red-600 hover:text-red-800">删除</button>
            </span>
          </div>
          {node.children?.length > 0 && <DeptTree nodes={node.children} onEdit={onEdit} onDelete={onDelete} onCreate={onCreate} level={level + 1} />}
        </div>
      ))}
    </div>
  )
}

function DeptFormDialog({ dept, parentId, onSubmit, onClose }: { dept: DeptNode | null; parentId?: string; onSubmit: (d: Record<string, any>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: dept?.name ?? "", parentId: dept?.parentId ?? parentId ?? "", sort: String(dept?.sort ?? 0), phone: dept?.phone ?? "", status: dept?.status ?? "ACTIVE" })
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-base font-semibold">{dept ? "编辑部门" : "新增部门"}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, sort: Number(form.sort), parentId: form.parentId || undefined }) }} className="space-y-3">
          <div><label className="mb-1 block text-xs text-slate-600">部门名称 *</label><input required value={form.name} onChange={(e) => update("name", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
          <div><label className="mb-1 block text-xs text-slate-600">上级部门 ID</label><input value={form.parentId} onChange={(e) => update("parentId", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" placeholder="留空为顶级" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-xs text-slate-600">排序</label><input type="number" value={form.sort} onChange={(e) => update("sort", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
            <div><label className="mb-1 block text-xs text-slate-600">状态</label><select value={form.status} onChange={(e) => update("status", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm"><option value="ACTIVE">启用</option><option value="DISABLED">禁用</option></select></div>
          </div>
          <div><label className="mb-1 block text-xs text-slate-600">电话</label><input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-9 rounded-md border px-4 text-sm">取消</button>
            <button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">确认</button>
          </div>
        </form>
      </div>
    </div>
  )
}
