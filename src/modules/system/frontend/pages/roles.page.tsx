"use client"

import { useState, useEffect, useCallback } from "react"

type SystemRole = {
  id: string
  name: string
  code: string
  sort: number
  status: string
  dataScope: string
  remark: string | null
  createdAt: string
}

type PageData = { items: SystemRole[]; total: number; page: number; pageSize: number }

const API = "/api/v1/admin/system/roles"

export default function SystemRolesPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<SystemRole | null>(null)

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

  const handleDelete = async (role: SystemRole) => {
    if (!confirm(`确认删除角色「${role.name}」？`)) return
    const res = await fetch(`${API}/${role.id}`, { method: "DELETE" }).then((r) => r.json())
    if (res.success) loadData(); else alert(res.error)
  }

  const [showMenuAssign, setShowMenuAssign] = useState(false)
  const [assigningRole, setAssigningRole] = useState<SystemRole | null>(null)

  const handleAssignMenus = (role: SystemRole) => {
    setAssigningRole(role)
    setShowMenuAssign(true)
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
        <div>
          <h1 className="text-lg font-semibold text-slate-900">角色管理</h1>
          <p className="mt-0.5 text-sm text-slate-500">管理系统角色与数据权限</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">新增角色</button>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center gap-3">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadData()} placeholder="角色名 / 编码" className="h-9 w-56 rounded-md border px-3 text-sm" />
          <button onClick={() => { setPage(1); loadData() }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
          <button onClick={() => { setKeyword(""); setPage(1) }} className="h-9 rounded-md border px-4 text-sm">重置</button>
          <span className="ml-auto text-xs text-slate-400">共 {data.total} 条</span>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
            <th className="px-4 py-3">角色名称</th><th className="px-4 py-3">角色编码</th><th className="px-4 py-3">排序</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">数据范围</th><th className="px-4 py-3 text-right">操作</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr>
            : data.items.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">暂无数据</td></tr>
            : data.items.map((role) => (
              <tr key={role.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{role.name}</td>
                <td className="px-4 py-3 text-slate-500">{role.code}</td>
                <td className="px-4 py-3">{role.sort}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${role.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{role.status === "ACTIVE" ? "启用" : "禁用"}</span></td>
                <td className="px-4 py-3 text-xs text-slate-500">{role.dataScope}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleAssignMenus(role)} className="mr-2 text-green-600 hover:text-green-800">菜单</button>
                  <button onClick={() => { setEditing(role); setShowForm(true) }} className="mr-2 text-blue-600 hover:text-blue-800">编辑</button>
                  <button onClick={() => handleDelete(role)} className="text-red-600 hover:text-red-800">删除</button>
                </td>
              </tr>
            ))}
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

      {showForm && <RoleFormDialog role={editing} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}
      {showMenuAssign && assigningRole && <MenuAssignDialog role={assigningRole} onClose={() => setShowMenuAssign(false)} />}
    </div>
  )
}

function RoleFormDialog({ role, onSubmit, onClose }: { role: SystemRole | null; onSubmit: (d: Record<string, any>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: role?.name ?? "", code: role?.code ?? "", sort: String(role?.sort ?? 0), status: role?.status ?? "ACTIVE", dataScope: role?.dataScope ?? "ALL", remark: role?.remark ?? "" })
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-base font-semibold">{role ? "编辑角色" : "新增角色"}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, sort: Number(form.sort) }) }} className="space-y-3">
          <div><label className="mb-1 block text-xs text-slate-600">角色名称 *</label><input required value={form.name} onChange={(e) => update("name", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
          <div><label className="mb-1 block text-xs text-slate-600">角色编码 *</label><input required value={form.code} onChange={(e) => update("code", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" disabled={Boolean(role)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-xs text-slate-600">排序</label><input type="number" value={form.sort} onChange={(e) => update("sort", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
            <div><label className="mb-1 block text-xs text-slate-600">状态</label><select value={form.status} onChange={(e) => update("status", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm"><option value="ACTIVE">启用</option><option value="DISABLED">禁用</option></select></div>
          </div>
          <div><label className="mb-1 block text-xs text-slate-600">数据范围</label><select value={form.dataScope} onChange={(e) => update("dataScope", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm"><option value="ALL">全部</option><option value="DEPT">本部门</option><option value="DEPT_AND_CHILD">本部门及以下</option><option value="SELF">仅本人</option></select></div>
          <div><label className="mb-1 block text-xs text-slate-600">备注</label><input value={form.remark} onChange={(e) => update("remark", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-9 rounded-md border px-4 text-sm">取消</button>
            <button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">确认</button>
          </div>
        </form>
      </div>
    </div>
  )
}


// === 菜单分配弹窗（Tree 勾选） ===
function MenuAssignDialog({ role, onClose }: { role: SystemRole; onClose: () => void }) {
  const [menuTree, setMenuTree] = useState<any[]>([])
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // 加载菜单树
    fetch("/api/v1/admin/system/menus").then((r) => r.json()).then((res) => {
      if (res.success) setMenuTree(res.data)
      setLoading(false)
    })
    // TODO: 加载当前角色已分配的菜单
  }, [])

  const toggleCheck = (id: string, children: any[]) => {
    const next = new Set(checkedIds)
    if (next.has(id)) {
      next.delete(id)
      // 取消勾选时，也取消所有子节点
      const removeChildren = (nodes: any[]) => {
        for (const node of nodes) {
          next.delete(node.id)
          if (node.children?.length) removeChildren(node.children)
        }
      }
      removeChildren(children)
    } else {
      next.add(id)
    }
    setCheckedIds(next)
  }

  const handleSelectAll = () => {
    const all = new Set<string>()
    const collect = (nodes: any[]) => { for (const n of nodes) { all.add(n.id); if (n.children?.length) collect(n.children) } }
    collect(menuTree)
    setCheckedIds(all)
  }

  const handleDeselectAll = () => setCheckedIds(new Set())

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API}/${role.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assignMenus", menuIds: Array.from(checkedIds) }),
      }).then((r) => r.json())
      if (res.success) { alert("菜单分配成功"); onClose() }
      else alert(res.error)
    } finally { setSaving(false) }
  }

  const renderTree = (nodes: any[], level: number) => (
    <div className={level > 0 ? "ml-5" : ""}>
      {nodes.map((node: any) => (
        <div key={node.id} className="py-0.5">
          <label className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checkedIds.has(node.id)}
              onChange={() => toggleCheck(node.id, node.children || [])}
              className="rounded"
            />
            <span className="text-xs">{node.name}</span>
            {node.permission && <span className="text-[10px] text-slate-400">{node.permission}</span>}
          </label>
          {node.children?.length > 0 && renderTree(node.children, level + 1)}
        </div>
      ))}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">分配菜单权限</h2>
            <p className="mt-0.5 text-xs text-slate-500">角色：{role.name}（{role.code}）</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSelectAll} className="text-xs text-blue-600 hover:text-blue-800">全选</button>
            <button onClick={handleDeselectAll} className="text-xs text-slate-500 hover:text-slate-700">全不选</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {loading ? <p className="py-8 text-center text-slate-400">加载中...</p>
          : menuTree.length === 0 ? <p className="py-8 text-center text-slate-400">暂无菜单</p>
          : renderTree(menuTree, 0)}
        </div>
        <div className="flex items-center justify-between border-t px-5 py-3">
          <span className="text-xs text-slate-400">已选 {checkedIds.size} 项</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="h-9 rounded-md border px-4 text-sm">取消</button>
            <button onClick={handleSave} disabled={saving} className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "保存中..." : "确认分配"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
