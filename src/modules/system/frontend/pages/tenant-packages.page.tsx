"use client"

import { useState, useEffect, useCallback } from "react"
import { request, API } from "@/modules/shared/frontend/lib/request"
import { Pagination } from "@/modules/shared/frontend/components/pagination"

type TenantPackage = {
  id: string
  name: string
  status: string
  accountLimit: number | null
  menuIds: string[]
  remark: string | null
  createdAt: string
  updatedAt: string
}

type PageData = { items: TenantPackage[]; total: number; page: number; pageSize: number }
type MenuNode = { id: string; name: string; type: string; permission: string | null; parentId: string | null; sort: number; children?: MenuNode[] }

export default function SystemTenantPackagesPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<TenantPackage | null>(null)
  const [loadError, setLoadError] = useState("")

  const loadData = useCallback(async (p = page, ps = pageSize, kw = keyword) => {
    setLoading(true)
    setLoadError("")
    try {
      const res = await request.get(API.TENANT_PACKAGES, { page: p, pageSize: ps, keyword: kw || undefined })
      if (res.success) setData(res.data)
      else setLoadError(res.error || "加载租户套餐失败")
    } finally { setLoading(false) }
  }, [page, pageSize, keyword])

  useEffect(() => {
    loadData(page, pageSize, keyword)
  }, [loadData, page, pageSize])

  const handleDelete = async (pkg: TenantPackage) => {
    if (!confirm(`确认删除套餐「${pkg.name}」？`)) return
    const res = await request.delete(`${API.TENANT_PACKAGES}/${pkg.id}`)
    if (res.success) loadData(page, pageSize, keyword); else alert(res.error)
  }

  const handleSubmit = async (formData: Record<string, any>) => {
    const res = editing
      ? await request.put(`${API.TENANT_PACKAGES}/${editing.id}`, formData)
      : await request.post(API.TENANT_PACKAGES, formData)
    if (res.success) { setShowForm(false); loadData(page, pageSize, keyword) } else alert(res.error)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">租户套餐管理</h1>
          <p className="mt-0.5 text-sm text-slate-500">配置租户可使用的功能菜单与权限范围</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">新增套餐</button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-white p-4">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索套餐名称"
          className="h-9 w-64 rounded-md border px-3 text-sm"
        />
        <button onClick={() => { setPage(1); loadData(1, pageSize, keyword) }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
        <button onClick={() => { setKeyword(""); setPage(1); loadData(1, pageSize, "") }} className="h-9 rounded-md border px-4 text-sm">重置</button>
        <span className="ml-auto text-xs text-slate-500">
          共 <span className="font-semibold text-slate-900">{data.total}</span> 个套餐
        </span>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {loadError}
        </div>
      )}

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
              <th className="px-4 py-3">套餐名称</th>
              <th className="px-4 py-3">账号限额</th>
              <th className="px-4 py-3">菜单权限</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">备注</th>
              <th className="px-4 py-3">更新时间</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">加载中...</td></tr>
            ) : data.items.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">暂无数据</td></tr>
            ) : (
              data.items.map((pkg) => (
                <tr key={pkg.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{pkg.name}</td>
                  <td className="px-4 py-3"><span className="rounded bg-violet-50 px-2 py-1 text-xs text-violet-700">{pkg.accountLimit === null ? "不限" : `${pkg.accountLimit} 席`}</span></td>
                  <td className="px-4 py-3">
                    {pkg.menuIds.length === 0 ? "未授权" : `${pkg.menuIds.length} 个`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pkg.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {pkg.status === "ACTIVE" ? "启用" : "禁用"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{pkg.remark || "-"}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(pkg.updatedAt).toLocaleDateString("zh-CN")}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => { setEditing(pkg); setShowForm(true) }} className="text-blue-600 hover:text-blue-800">编辑</button>
                    <button onClick={() => handleDelete(pkg)} className="text-red-600 hover:text-red-800">删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      {showForm && <TenantPackageFormDialog pkg={editing} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}
    </div>
  )
}

// === 套餐编辑弹窗 (含菜单树) ===
function TenantPackageFormDialog({ pkg, onSubmit, onClose }: {
  pkg: TenantPackage | null
  onSubmit: (d: Record<string, any>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({ name: pkg?.name ?? "", status: pkg?.status ?? "ACTIVE", accountLimit: pkg?.accountLimit?.toString() ?? "", remark: pkg?.remark ?? "" })
  const [menuTree, setMenuTree] = useState<MenuNode[]>([])
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set(pkg?.menuIds ?? []))
  const [loading, setLoading] = useState(true)
  const [expandAll, setExpandAll] = useState(false)

  useEffect(() => {
    request.get(API.TENANT_PACKAGE_MENUS).then((res) => {
      if (res.success) setMenuTree(res.data)
      setLoading(false)
    })
  }, [])

  const toggleCheck = (id: string, allChildren: string[]) => {
    const next = new Set(checkedIds)
    if (next.has(id)) {
      next.delete(id)
      allChildren.forEach(c => next.delete(c))
    } else {
      next.add(id)
    }
    setCheckedIds(next)
  }

  const getAllIds = (nodes: MenuNode[]): string[] => {
    const ids: string[] = []
    const collect = (ns: MenuNode[]) => ns.forEach(n => { ids.push(n.id); if (n.children?.length) collect(n.children) })
    collect(nodes)
    return ids
  }

  const handleSelectAll = () => setCheckedIds(new Set(getAllIds(menuTree)))
  const handleDeselectAll = () => setCheckedIds(new Set())

  const getAllChildIds = (node: MenuNode): string[] => {
    const ids: string[] = []
    const collect = (ns: MenuNode[]) => ns.forEach(n => { ids.push(n.id); if (n.children?.length) collect(n.children) })
    if (node.children?.length) collect(node.children)
    return ids
  }

  const renderTree = (nodes: MenuNode[], level: number) => (
    <div className={level > 0 ? "ml-5" : ""}>
      {nodes.map((node) => (
        <div key={node.id}>
          <label className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-slate-50 cursor-pointer">
            <input type="checkbox" checked={checkedIds.has(node.id)} onChange={() => toggleCheck(node.id, getAllChildIds(node))} className="rounded" />
            <span className={`text-xs ${node.type === "BUTTON" ? "text-slate-400" : node.type === "DIR" ? "font-medium" : ""}`}>
              {node.type === "BUTTON" ? "🔘" : node.type === "DIR" ? "📁" : "📄"} {node.name}
            </span>
            {node.permission && <span className="text-[10px] text-slate-300">{node.permission}</span>}
          </label>
          {node.children?.length ? renderTree(node.children, level + 1) : null}
        </div>
      ))}
    </div>
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...form, accountLimit: form.accountLimit ? Number(form.accountLimit) : null, menuIds: Array.from(checkedIds) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-base font-semibold">{pkg ? "编辑套餐" : "新增套餐"}</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-slate-600">套餐名称 *</label>
                <input required value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="h-9 w-full rounded-md border px-3 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-600">默认账号席位</label>
                <input type="number" min={1} value={form.accountLimit} onChange={(e) => setForm(p => ({ ...p, accountLimit: e.target.value }))} placeholder="留空表示不限" className="h-9 w-full rounded-md border px-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">备注</label>
              <input value={form.remark} onChange={(e) => setForm(p => ({ ...p, remark: e.target.value }))} className="h-9 w-full rounded-md border px-3 text-sm" />
            </div>
          </div>

          {/* Menu Tree */}
          <div className="mx-5 mb-2 rounded-lg border flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b bg-slate-50 px-3 py-2">
              <span className="text-xs font-medium text-slate-600">租户可授权菜单 ({checkedIds.size} 项已选)</span>
              <div className="flex gap-3 text-xs">
                <button type="button" onClick={handleSelectAll} className="text-blue-600 hover:text-blue-800">全选</button>
                <button type="button" onClick={handleDeselectAll} className="text-slate-500 hover:text-slate-700">全不选</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {loading ? <p className="text-xs text-slate-400">加载菜单中...</p>
                : menuTree.length === 0 ? <p className="text-xs text-slate-400">暂无菜单</p>
                : renderTree(menuTree, 0)}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t px-5 py-3">
            <button type="button" onClick={onClose} className="h-9 rounded-md border px-4 text-sm">取消</button>
            <button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">确认</button>
          </div>
        </form>
      </div>
    </div>
  )
}
