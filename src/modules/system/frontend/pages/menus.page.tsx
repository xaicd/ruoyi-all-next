"use client"

import { useState, useEffect, useCallback } from "react"
import { request, API } from "@/modules/shared/frontend/lib/request"

type MenuNode = { id: string; name: string; type: string; permission: string | null; path: string | null; icon: string | null; sort: number; status: string; visible: boolean; children: MenuNode[] }

export default function SystemMenusPage() {
  const [tree, setTree] = useState<MenuNode[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<MenuNode | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await request.get(API.MENUS)
      if (res.success) setTree(res.data)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (menu: MenuNode) => {
    if (!confirm(`确认删除菜单「${menu.name}」？`)) return
    const res = await request.delete(`${API.MENUS}/${menu.id}`)
    if (res.success) loadData(); else alert(res.error)
  }

  const handleSubmit = async (formData: Record<string, any>) => {
    const res = editing
      ? await request.put(`${API.MENUS}/${editing.id}`, formData)
      : await request.post(API.MENUS, formData)
    if (res.success) { setShowForm(false); loadData() } else alert(res.error)
  }

  const typeLabel = (t: string) => t === "DIR" ? "目录" : t === "MENU" ? "菜单" : "按钮"
  const typeColor = (t: string) => t === "DIR" ? "bg-blue-50 text-blue-700" : t === "MENU" ? "bg-purple-50 text-purple-700" : "bg-yellow-50 text-yellow-700"

  const renderTree = (nodes: MenuNode[], level: number) => (
    <div className={level > 0 ? "ml-6 border-l pl-4" : ""}>
      {nodes.map((node) => (
        <div key={node.id} className="py-1">
          <div className="flex items-center gap-2 rounded px-2 py-1 hover:bg-slate-50 text-sm">
            {node.icon && <span className="text-slate-400">[{node.icon}]</span>}
            <span className="font-medium">{node.name}</span>
            <span className={`rounded px-1.5 py-0.5 text-xs ${typeColor(node.type)}`}>{typeLabel(node.type)}</span>
            {node.permission && <span className="text-xs text-slate-400">{node.permission}</span>}
            <span className="ml-auto flex gap-2 text-xs">
              <button onClick={() => { setEditing(node); setShowForm(true) }} className="text-blue-600">编辑</button>
              <button onClick={() => handleDelete(node)} className="text-red-600">删除</button>
            </span>
          </div>
          {node.children?.length > 0 && renderTree(node.children, level + 1)}
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div><h1 className="text-lg font-semibold text-slate-900">菜单管理</h1><p className="mt-0.5 text-sm text-slate-500">菜单权限树管理</p></div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">新增菜单</button>
      </div>
      <div className="rounded-lg border bg-white p-4">
        {loading ? <p className="py-8 text-center text-slate-400">加载中...</p>
        : tree.length === 0 ? <p className="py-8 text-center text-slate-400">暂无数据</p>
        : renderTree(tree, 0)}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-base font-semibold">{editing ? "编辑菜单" : "新增菜单"}</h2>
            <MenuForm menu={editing} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

function MenuForm({ menu, onSubmit, onClose }: { menu: MenuNode | null; onSubmit: (d: Record<string, any>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: menu?.name ?? "", type: menu?.type ?? "MENU", permission: menu?.permission ?? "", path: menu?.path ?? "", icon: menu?.icon ?? "", sort: String(menu?.sort ?? 0), status: menu?.status ?? "ACTIVE" })
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, sort: Number(form.sort), permission: form.permission || undefined, path: form.path || undefined, icon: form.icon || undefined }) }} className="space-y-3">
      <div><label className="mb-1 block text-xs text-slate-600">名称 *</label><input required value={form.name} onChange={(e) => update("name", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="mb-1 block text-xs text-slate-600">类型</label><select value={form.type} onChange={(e) => update("type", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm"><option value="DIR">目录</option><option value="MENU">菜单</option><option value="BUTTON">按钮</option></select></div>
        <div><label className="mb-1 block text-xs text-slate-600">排序</label><input type="number" value={form.sort} onChange={(e) => update("sort", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
      </div>
      <div><label className="mb-1 block text-xs text-slate-600">权限码</label><input value={form.permission} onChange={(e) => update("permission", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" placeholder="system:user:create" /></div>
      <div><label className="mb-1 block text-xs text-slate-600">路由路径</label><input value={form.path} onChange={(e) => update("path", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="mb-1 block text-xs text-slate-600">图标</label><input value={form.icon} onChange={(e) => update("icon", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
        <div><label className="mb-1 block text-xs text-slate-600">状态</label><select value={form.status} onChange={(e) => update("status", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm"><option value="ACTIVE">启用</option><option value="DISABLED">禁用</option></select></div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="h-9 rounded-md border px-4 text-sm">取消</button>
        <button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">确认</button>
      </div>
    </form>
  )
}
