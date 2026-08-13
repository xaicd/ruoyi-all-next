"use client"

import { useState, useEffect, useCallback } from "react"
import { request, API } from "@/modules/shared/frontend/lib/request"

// === Types ===
type Tenant = {
  id: string
  name: string
  contactName: string | null
  contactPhone: string | null
  domain: string | null
  packageId: string | null
  packageName?: string | null
  status: string
  expireTime: string | null
  accountCount: number
  createdAt: string
}

type TenantPackage = { id: string; name: string; status: string }

type PageData = { items: Tenant[]; total: number; page: number; pageSize: number }

// === Main Component ===
export default function SystemTenantsPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [showAssignPkg, setShowAssignPkg] = useState(false)
  const [assignTarget, setAssignTarget] = useState<Tenant | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await request.get(API.TENANTS, { page, pageSize: 20, keyword: keyword || undefined, status: statusFilter || undefined })
      if (result.success && result.data) setData(result.data)
    } finally {
      setLoading(false)
    }
  }, [page, keyword, statusFilter])

  useEffect(() => { loadData() }, [loadData])

  const handleSearch = () => { setPage(1); loadData() }
  const handleReset = () => { setKeyword(""); setStatusFilter(""); setPage(1) }
  const handleCreate = () => { setEditingTenant(null); setShowForm(true) }
  const handleEdit = (t: Tenant) => { setEditingTenant(t); setShowForm(true) }

  const handleDelete = async (t: Tenant) => {
    if (!confirm(`确认删除租户「${t.name}」？`)) return
    const result = await request.delete(`${API.TENANTS}/${t.id}`)
    if (result.success) loadData()
    else alert(result.error || "删除失败")
  }

  const handleToggleStatus = async (t: Tenant) => {
    const newStatus = t.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    const result = await request.patch(`${API.TENANTS}/${t.id}`, { action: "updateStatus", status: newStatus })
    if (result.success) loadData()
    else alert(result.error || "状态变更失败")
  }

  const handleAssignPackage = (t: Tenant) => { setAssignTarget(t); setShowAssignPkg(true) }

  const handleFormSubmit = async (formData: Record<string, any>) => {
    let result
    if (editingTenant) {
      result = await request.put(`${API.TENANTS}/${editingTenant.id}`, formData)
    } else {
      result = await request.post(API.TENANTS, formData)
    }
    if (result.success) { setShowForm(false); loadData() }
    else alert(result.error || "操作失败")
  }

  const handleAssignSubmit = async (packageId: string) => {
    if (!assignTarget) return
    const result = await request.post(`${API.TENANTS}/assign-package`, { tenantId: assignTarget.id, packageId })
    if (result.success) { setShowAssignPkg(false); loadData() }
    else alert(result.error || "分配套餐失败")
  }

  const totalPages = Math.ceil(data.total / data.pageSize)

  return (
    <div className="space-y-4">
      {/* 页头 */}
      <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">租户管理</h1>
          <p className="mt-0.5 text-sm text-slate-500">管理系统租户、套餐分配与状态</p>
        </div>
        <button onClick={handleCreate} className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">新增租户</button>
      </div>

      {/* 搜索栏 */}
      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="租户名称 / 联系人" className="h-9 w-56 rounded-md border px-3 text-sm" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-md border px-3 text-sm">
            <option value="">全部状态</option>
            <option value="ACTIVE">启用</option>
            <option value="DISABLED">禁用</option>
          </select>
          <button onClick={handleSearch} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
          <button onClick={handleReset} className="h-9 rounded-md border px-4 text-sm">重置</button>
          <span className="ml-auto text-xs text-slate-400">共 {data.total} 条</span>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
                <th className="px-4 py-3">租户名称</th>
                <th className="px-4 py-3">联系人</th>
                <th className="px-4 py-3">联系电话</th>
                <th className="px-4 py-3">套餐</th>
                <th className="px-4 py-3">账号额度</th>
                <th className="px-4 py-3">过期时间</th>
                <th className="px-4 py-3">状态</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr>
              ) : data.items.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">暂无数据</td></tr>
              ) : (
                data.items.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{t.name}</td>
                    <td className="px-4 py-3">{t.contactName || "-"}</td>
                    <td className="px-4 py-3 text-slate-500">{t.contactPhone || "-"}</td>
                    <td className="px-4 py-3 text-slate-500">{t.packageName || "未分配"}</td>
                    <td className="px-4 py-3">{t.accountCount}</td>
                    <td className="px-4 py-3 text-slate-500">{t.expireTime ? new Date(t.expireTime).toLocaleDateString("zh-CN") : "-"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleStatus(t)} className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${t.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {t.status === "ACTIVE" ? "启用" : "禁用"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleAssignPackage(t)} className="text-purple-600 hover:text-purple-800">套餐</button>
                      <button onClick={() => handleEdit(t)} className="text-blue-600 hover:text-blue-800">编辑</button>
                      <button onClick={() => handleDelete(t)} className="text-red-600 hover:text-red-800">删除</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-xs text-slate-500">第 {page} / {totalPages} 页</span>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">上一页</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">下一页</button>
            </div>
          </div>
        )}
      </div>

      {/* 新增/编辑弹窗 */}
      {showForm && <TenantFormDialog tenant={editingTenant} onSubmit={handleFormSubmit} onClose={() => setShowForm(false)} />}

      {/* 分配套餐弹窗 */}
      {showAssignPkg && assignTarget && <AssignPackageDialog tenant={assignTarget} onSubmit={handleAssignSubmit} onClose={() => setShowAssignPkg(false)} />}
    </div>
  )
}

// === Tenant Form Dialog ===
function TenantFormDialog({ tenant, onSubmit, onClose }: { tenant: Tenant | null; onSubmit: (data: Record<string, any>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: tenant?.name ?? "",
    contactName: tenant?.contactName ?? "",
    contactPhone: tenant?.contactPhone ?? "",
    domain: tenant?.domain ?? "",
    packageId: tenant?.packageId ?? "",
    status: tenant?.status ?? "ACTIVE",
    expireTime: tenant?.expireTime ? tenant.expireTime.split("T")[0] : "",
    accountCount: tenant?.accountCount ?? 1,
    adminUsername: "",
    adminNickname: "",
    adminPassword: "",
    adminPhone: "",
    adminEmail: "",
  })
  const [packages, setPackages] = useState<TenantPackage[]>([])

  useEffect(() => {
    request.get(API.TENANT_PACKAGES, { page: 1, pageSize: 100 }).then((res) => {
      if (res.success && res.data) setPackages(res.data.items || [])
    })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: Record<string, any> = { ...form }
    if (payload.expireTime) payload.expireTime = new Date(payload.expireTime).toISOString()
    else delete payload.expireTime
    if (!payload.domain) delete payload.domain
    if (tenant) {
      delete payload.adminUsername
      delete payload.adminNickname
      delete payload.adminPassword
      delete payload.adminPhone
      delete payload.adminEmail
    } else {
      if (!payload.adminPhone) delete payload.adminPhone
      if (!payload.adminEmail) delete payload.adminEmail
    }
    onSubmit(payload)
  }

  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-base font-semibold">{tenant ? "编辑租户" : "新增租户"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-600">租户名称 *</label>
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">联系人</label>
              <input value={form.contactName} onChange={(e) => update("contactName", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-600">联系电话</label>
              <input value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">绑定域名</label>
              <input value={form.domain} onChange={(e) => update("domain", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" placeholder="demo.example.com" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-600">账号额度</label>
              <input type="number" min={1} value={form.accountCount} onChange={(e) => update("accountCount", Number(e.target.value))} className="h-9 w-full rounded-md border px-3 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">过期时间</label>
              <input type="date" value={form.expireTime} onChange={(e) => update("expireTime", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">状态</label>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm">
                <option value="ACTIVE">启用</option>
                <option value="DISABLED">禁用</option>
              </select>
            </div>
          </div>
          {!tenant && (
            <>
              <div>
                <label className="mb-1 block text-xs text-slate-600">租户套餐 *</label>
                <select required value={form.packageId} onChange={(e) => update("packageId", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm">
                  <option value="">请选择可用套餐</option>
                  {packages.filter((pkg) => pkg.status === "ACTIVE").map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
                </select>
              </div>
              <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">首次创建会自动建立该租户的管理员账号和专属管理员角色。</div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-xs text-slate-600">管理员账号 *</label><input required value={form.adminUsername} onChange={(e) => update("adminUsername", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" placeholder="tenant_admin" /></div>
                <div><label className="mb-1 block text-xs text-slate-600">管理员昵称 *</label><input required value={form.adminNickname} onChange={(e) => update("adminNickname", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" placeholder="租户管理员" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-xs text-slate-600">管理员密码 *</label><input required type="password" minLength={6} value={form.adminPassword} onChange={(e) => update("adminPassword", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
                <div><label className="mb-1 block text-xs text-slate-600">管理员电话</label><input value={form.adminPhone} onChange={(e) => update("adminPhone", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
              </div>
              <div><label className="mb-1 block text-xs text-slate-600">管理员邮箱</label><input type="email" value={form.adminEmail} onChange={(e) => update("adminEmail", e.target.value)} className="h-9 w-full rounded-md border px-3 text-sm" /></div>
            </>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-9 rounded-md border px-4 text-sm">取消</button>
            <button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">确认</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// === Assign Package Dialog ===
function AssignPackageDialog({ tenant, onSubmit, onClose }: { tenant: Tenant; onSubmit: (packageId: string) => void; onClose: () => void }) {
  const [packages, setPackages] = useState<TenantPackage[]>([])
  const [selectedPkg, setSelectedPkg] = useState(tenant.packageId ?? "")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    request.get(API.TENANT_PACKAGES, { page: 1, pageSize: 100 }).then((res) => {
      if (res.success && res.data) {
        setPackages(res.data.items || [])
      }
      setLoading(false)
    })
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPkg) { alert("请选择套餐"); return }
    onSubmit(selectedPkg)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-1 text-base font-semibold">分配套餐</h2>
        <p className="mb-4 text-sm text-slate-500">为租户「{tenant.name}」分配套餐</p>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-400">加载套餐列表...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {packages.filter((p) => p.status === "ACTIVE").map((pkg) => (
                <label key={pkg.id} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${selectedPkg === pkg.id ? "border-blue-500 bg-blue-50" : "hover:bg-slate-50"}`}>
                  <input type="radio" name="package" value={pkg.id} checked={selectedPkg === pkg.id} onChange={() => setSelectedPkg(pkg.id)} className="accent-blue-600" />
                  <div>
                    <div className="text-sm font-medium">{pkg.name}</div>
                    <div className="text-xs text-slate-500">ID: {pkg.id}</div>
                  </div>
                </label>
              ))}
              {packages.filter((p) => p.status === "ACTIVE").length === 0 && (
                <div className="py-4 text-center text-sm text-slate-400">暂无可用套餐</div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="h-9 rounded-md border px-4 text-sm">取消</button>
              <button type="submit" className="h-9 rounded-md bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">确认分配</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
