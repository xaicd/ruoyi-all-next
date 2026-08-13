"use client"

import { useState, useEffect, useCallback } from "react"
import { request, API } from "@/modules/shared/frontend/lib/request"

// === Types ===
type Tenant = {
  id: string
  tenantCode: string
  name: string
  contactName: string | null
  contactPhone: string | null
  domain: string | null
  packageId: string | null
  packageName?: string | null
  status: string
  effectiveAt: string
  expireTime: string | null
  accountLimit: number | null
  accountUsed: number
  effectiveAccountLimit: number | null
  createdAt: string
}

type TenantPackage = { id: string; name: string; status: string; accountLimit: number | null }

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
    <div className="space-y-4 pb-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-9 w-1 rounded-full bg-blue-600" />
          <div><h1 className="text-lg font-semibold tracking-tight text-slate-900">租户管理</h1><p className="mt-0.5 text-sm text-slate-500">管理租户资料、服务套餐与首个管理员账号</p></div>
        </div>
        <button onClick={handleCreate} className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow">+ 新增租户</button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px_auto_auto]">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="租户编码 / 租户名称 / 联系人" className="h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"><option value="">全部状态</option><option value="ACTIVE">启用</option><option value="DISABLED">禁用</option></select>
          <button onClick={handleSearch} className="h-9 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800">查询</button>
          <button onClick={handleReset} className="h-9 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50">重置</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3"><span className="text-sm font-medium text-slate-800">租户列表</span><span className="text-xs text-slate-400">共 {data.total} 条记录</span></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead><tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-medium text-slate-500"><th className="px-5 py-3">租户名称</th><th className="px-4 py-3">租户编码</th><th className="px-4 py-3">联系人</th><th className="px-4 py-3">联系电话</th><th className="px-4 py-3">套餐</th><th className="px-4 py-3">生效时间</th><th className="px-4 py-3 text-center">已用 / 席位</th><th className="px-4 py-3">过期时间</th><th className="px-4 py-3">状态</th><th className="px-5 py-3 text-right">操作</th></tr></thead>
            <tbody>{loading ? <tr><td colSpan={10} className="px-4 py-14 text-center text-slate-400">加载中...</td></tr> : data.items.length === 0 ? <tr><td colSpan={10} className="px-4 py-14 text-center text-slate-400">暂无数据</td></tr> : data.items.map((t) => <tr key={t.id} className="border-b border-slate-100 last:border-0 transition hover:bg-blue-50/30"><td className="px-5 py-3.5 font-medium text-slate-800">{t.name}</td><td className="px-4 py-3.5"><code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">{t.tenantCode}</code></td><td className="px-4 py-3.5 text-slate-700">{t.contactName || "-"}</td><td className="px-4 py-3.5 text-slate-500">{t.contactPhone || "-"}</td><td className="px-4 py-3.5"><span className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">{t.packageName || "未分配"}</span></td><td className="px-4 py-3.5 text-slate-500">{new Date(t.effectiveAt).toLocaleDateString("zh-CN")}</td><td className="px-4 py-3.5 text-center font-medium text-slate-700">{t.accountUsed} / {t.effectiveAccountLimit ?? "不限"}</td><td className="px-4 py-3.5 text-slate-500">{t.expireTime ? new Date(t.expireTime).toLocaleDateString("zh-CN") : "长期"}</td><td className="px-4 py-3.5"><button onClick={() => handleToggleStatus(t)} className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium transition ${t.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-red-50 text-red-700 hover:bg-red-100"}`}>{t.status === "ACTIVE" ? "启用" : "禁用"}</button></td><td className="px-5 py-3.5 text-right"><div className="inline-flex gap-3 text-sm"><button onClick={() => handleAssignPackage(t)} className="text-violet-600 hover:text-violet-800">套餐</button><button onClick={() => handleEdit(t)} className="text-blue-600 hover:text-blue-800">编辑</button><button onClick={() => handleDelete(t)} className="text-red-500 hover:text-red-700">删除</button></div></td></tr>)}</tbody>
          </table>
        </div>
        {totalPages > 1 && <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3"><span className="text-xs text-slate-500">第 {page} / {totalPages} 页</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-8 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 disabled:cursor-not-allowed disabled:opacity-50">上一页</button><button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="h-8 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 disabled:cursor-not-allowed disabled:opacity-50">下一页</button></div></div>}
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
    tenantCode: tenant?.tenantCode ?? "", name: tenant?.name ?? "", contactName: tenant?.contactName ?? "", contactPhone: tenant?.contactPhone ?? "", domain: tenant?.domain ?? "",
    packageId: tenant?.packageId ?? "", status: tenant?.status ?? "ACTIVE", effectiveAt: tenant?.effectiveAt ? tenant.effectiveAt.split("T")[0] : "", expireTime: tenant?.expireTime ? tenant.expireTime.split("T")[0] : "",
    accountLimit: tenant?.accountLimit?.toString() ?? "", adminUsername: "", adminNickname: "", adminPassword: "", adminPhone: "", adminEmail: "",
  })
  const [packages, setPackages] = useState<TenantPackage[]>([])
  useEffect(() => { request.get(API.TENANT_PACKAGES, { page: 1, pageSize: 100 }).then((res) => { if (res.success && res.data) setPackages(res.data.items || []) }) }, [])

  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }))
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: Record<string, any> = { ...form }
    if (payload.effectiveAt) payload.effectiveAt = new Date(payload.effectiveAt).toISOString(); else delete payload.effectiveAt
    if (payload.expireTime) payload.expireTime = new Date(payload.expireTime).toISOString(); else payload.expireTime = null
    payload.accountLimit = payload.accountLimit ? Number(payload.accountLimit) : null
    if (!payload.domain) delete payload.domain
    if (tenant) ["adminUsername", "adminNickname", "adminPassword", "adminPhone", "adminEmail"].forEach((field) => delete payload[field])
    else { if (!payload.adminPhone) delete payload.adminPhone; if (!payload.adminEmail) delete payload.adminEmail }
    onSubmit(payload)
  }
  const fieldClass = "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
  const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => <label className="mb-1.5 block text-sm font-medium text-slate-700">{children}{required && <span className="ml-1 text-red-500">*</span>}</label>
  const Section = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"><div className="mb-4 flex items-start gap-3"><span className="mt-0.5 h-5 w-1 rounded-full bg-blue-600" /><div><h3 className="text-sm font-semibold text-slate-900">{title}</h3><p className="mt-0.5 text-xs text-slate-500">{description}</p></div></div>{children}</section>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div role="dialog" aria-modal="true" className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-white to-blue-50/70 px-6 py-5">
          <div><p className="mb-1 text-xs font-medium tracking-wide text-blue-600">TENANT MANAGEMENT</p><h2 className="text-xl font-semibold text-slate-900">{tenant ? "编辑租户" : "新增租户"}</h2><p className="mt-1 text-sm text-slate-500">{tenant ? "更新租户的基础资料、额度和服务状态。" : "创建租户后将同步初始化管理员账号和套餐权限。"}</p></div>
          <button type="button" onClick={onClose} aria-label="关闭" className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">×</button>
        </header>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-4 overflow-y-auto px-6 py-5">
            <Section title="租户基础资料" description="租户编码是唯一登录标识；名称、联系人和域名仅用于业务资料。">
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label required>租户编码</Label><input required disabled={Boolean(tenant)} value={form.tenantCode} onChange={(e) => update("tenantCode", e.target.value.toLowerCase())} placeholder="例如 cc-adm" pattern="[a-z][a-z0-9-]*[a-z0-9]" className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500`} /><p className="mt-1 text-xs text-slate-400">2–32 位小写字母、数字、连字符；创建后不可修改。</p></div>
                <div><Label required>租户名称</Label><input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="例如：华东演示租户" className={fieldClass} /></div>
                <div><Label>联系人</Label><input value={form.contactName} onChange={(e) => update("contactName", e.target.value)} placeholder="请输入联系人姓名" className={fieldClass} /></div>
                <div><Label>联系电话</Label><input value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} placeholder="请输入联系电话" className={fieldClass} /></div>
                <div><Label>绑定域名</Label><input value={form.domain} onChange={(e) => update("domain", e.target.value)} placeholder="demo.example.com（仅作业务域名）" className={fieldClass} /></div>
              </div>
            </Section>
            <Section title="服务与套餐" description="套餐提供默认菜单和席位；留空租户席位覆盖时使用套餐默认值。">
              <div className="grid gap-4 md:grid-cols-4">
                <div><Label>生效时间</Label><input type="date" value={form.effectiveAt} onChange={(e) => update("effectiveAt", e.target.value)} className={fieldClass} /></div>
                <div><Label>过期时间</Label><input type="date" value={form.expireTime} onChange={(e) => update("expireTime", e.target.value)} className={fieldClass} /></div>
                <div><Label>租户席位覆盖</Label><input type="number" min={1} value={form.accountLimit} onChange={(e) => update("accountLimit", e.target.value)} placeholder="留空继承套餐" className={fieldClass} /></div>
                <div><Label>状态</Label><select value={form.status} onChange={(e) => update("status", e.target.value)} className={fieldClass}><option value="ACTIVE">启用</option><option value="DISABLED">禁用</option></select></div>
              </div>
              {!tenant && <div className="mt-4"><Label required>租户套餐</Label><select required value={form.packageId} onChange={(e) => update("packageId", e.target.value)} className={fieldClass}><option value="">请选择可用套餐</option>{packages.filter((pkg) => pkg.status === "ACTIVE").map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}</select></div>}
            </Section>
            {!tenant && <Section title="首个租户管理员" description="创建后使用该账号、密码及上方租户编码登录租户控制台。">
              <div className="mb-4 flex gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm text-blue-800"><span>ℹ</span><p>系统会自动创建该租户的专属管理员角色，并按所选套餐分配安全菜单权限。</p></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div><Label required>管理员账号</Label><input required value={form.adminUsername} onChange={(e) => update("adminUsername", e.target.value)} placeholder="例如 cc-admin" className={fieldClass} /></div>
                <div><Label required>管理员昵称</Label><input required value={form.adminNickname} onChange={(e) => update("adminNickname", e.target.value)} placeholder="租户管理员" className={fieldClass} /></div>
                <div><Label required>管理员密码</Label><input required type="password" minLength={6} value={form.adminPassword} onChange={(e) => update("adminPassword", e.target.value)} placeholder="至少 6 位" className={fieldClass} /></div>
                <div><Label>管理员电话</Label><input value={form.adminPhone} onChange={(e) => update("adminPhone", e.target.value)} placeholder="可选" className={fieldClass} /></div>
                <div className="md:col-span-2"><Label>管理员邮箱</Label><input type="email" value={form.adminEmail} onChange={(e) => update("adminEmail", e.target.value)} placeholder="admin@example.com（可选）" className={fieldClass} /></div>
              </div>
            </Section>}
          </div>
          <footer className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4"><p className="text-xs text-slate-400">{tenant ? "保存后立即生效。" : "带 * 的字段为必填项。"}</p><div className="flex gap-3"><button type="button" onClick={onClose} className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">取消</button><button type="submit" className="h-10 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md">{tenant ? "保存修改" : "确认创建"}</button></div></footer>
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
