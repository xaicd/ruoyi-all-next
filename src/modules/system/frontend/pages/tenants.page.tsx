"use client"

import { useState, useEffect, useCallback } from "react"
import { request, API } from "@/modules/shared/frontend/lib/request"
import { Pagination } from "@/modules/shared/frontend/components/pagination"

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
type TenantSubscription = { id: string; packageId: string; packageName: string | null; effectiveAt: string; expireAt: string | null; accountLimit: number | null; status: string; changeType: string; remark: string | null; createdAt: string }

type PageData = { items: Tenant[]; total: number; page: number; pageSize: number }

function defaultTenantExpireDate(): string {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 10)
  return date.toISOString().split("T")[0]
}

// === Main Component ===
export default function SystemTenantsPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 10 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showForm, setShowForm] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [showAssignPkg, setShowAssignPkg] = useState(false)
  const [assignTarget, setAssignTarget] = useState<Tenant | null>(null)
  const [historyTarget, setHistoryTarget] = useState<Tenant | null>(null)

  const loadData = useCallback(async (p = page, ps = pageSize, kw = keyword, st = statusFilter) => {
    setLoading(true)
    try {
      const result = await request.get(API.TENANTS, { page: p, pageSize: ps, keyword: kw || undefined, status: st || undefined })
      if (result.success && result.data) setData(result.data)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, keyword, statusFilter])

  useEffect(() => { loadData(page, pageSize, keyword, statusFilter) }, [loadData, page, pageSize])

  const handleSearch = () => { setPage(1); loadData(1, pageSize, keyword, statusFilter) }
  const handleReset = () => { setKeyword(""); setStatusFilter(""); setPage(1); loadData(1, pageSize, "", "") }
  const handleCreate = () => { setEditingTenant(null); setShowForm(true) }
  const handleEdit = (tenant: Tenant) => { setEditingTenant(tenant); setShowForm(true) }

  const handleDelete = async (tenant: Tenant) => {
    if (!confirm(`确定要删除租户「${tenant.name} (${tenant.tenantCode})」吗？`)) return
    const result = await request.delete(`${API.TENANTS}/${tenant.id}`)
    if (result.success) loadData(page, pageSize, keyword, statusFilter); else alert(result.error || "删除失败")
  }

  const handleToggleStatus = async (tenant: Tenant) => {
    const nextStatus = tenant.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    const result = await request.patch(`${API.TENANTS}/${tenant.id}`, { action: "updateStatus", status: nextStatus })
    if (result.success) loadData(page, pageSize, keyword, statusFilter); else alert(result.error || "状态更新失败")
  }

  const handleFormSubmit = async (formData: Record<string, any>) => {
    const result = editingTenant
      ? await request.put(`${API.TENANTS}/${editingTenant.id}`, formData)
      : await request.post(API.TENANTS, formData)
    if (result.success) { setShowForm(false); loadData(page, pageSize, keyword, statusFilter) } else alert(result.error || "保存失败")
  }

  const handleAssignSubmit = async (packageId: string) => {
    if (!assignTarget) return
    const result = await request.post(`${API.TENANTS}/assign-package`, { tenantId: assignTarget.id, packageId })
    if (result.success) { setShowAssignPkg(false); loadData(page, pageSize, keyword, statusFilter) } else alert(result.error || "分配套餐失败")
  }

  return (
    <div className="space-y-4">
      {/* 页头 */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">租户管理</h1>
          <p className="mt-0.5 text-xs text-slate-500">管理多租户实体、租户套餐授权、账号限额与生命周期</p>
        </div>
        <button onClick={handleCreate} className="inline-flex h-9 items-center justify-center rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700">
          + 新增租户
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <input
          type="text"
          placeholder="搜索租户名称 / 编码 / 联系人..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="">全部状态</option>
          <option value="ACTIVE">正常</option>
          <option value="DISABLED">停用</option>
        </select>
        <button onClick={handleSearch} className="h-9 rounded-lg bg-slate-900 px-4 text-xs font-medium text-white hover:bg-slate-800 transition">查询</button>
        <button onClick={handleReset} className="h-9 rounded-lg bg-slate-100 px-4 text-xs font-medium text-slate-600 hover:bg-slate-200 transition">重置</button>
        <span className="ml-auto text-xs text-slate-500">
          共 <span className="font-semibold text-slate-900">{data.total}</span> 个租户
        </span>
      </div>

      {/* 列表 */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">租户编码</th>
                <th className="px-5 py-3">租户名称</th>
                <th className="px-5 py-3">绑定套餐</th>
                <th className="px-5 py-3">账号使用 / 限额</th>
                <th className="px-5 py-3">状态</th>
                <th className="px-5 py-3">有效期至</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-xs text-slate-400">正在加载租户列表...</td></tr>
              ) : data.items.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-xs text-slate-400">暂无租户数据</td></tr>
              ) : (
                data.items.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3 font-mono font-semibold text-indigo-600">{tenant.tenantCode}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">{tenant.name}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                        {tenant.packageName || "未指定套餐"}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono">
                      {tenant.accountUsed} / {tenant.effectiveAccountLimit ?? "不限"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${tenant.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {tenant.status === "ACTIVE" ? "正常" : "停用"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{tenant.expireTime ? tenant.expireTime.split("T")[0] : "永久"}</td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button onClick={() => { setAssignTarget(tenant); setShowAssignPkg(true) }} className="mr-2 text-indigo-600 hover:text-indigo-800">分配套餐</button>
                      <button onClick={() => setHistoryTarget(tenant)} className="mr-2 text-slate-600 hover:text-slate-800">履约历史</button>
                      <button onClick={() => handleEdit(tenant)} className="mr-2 text-blue-600 hover:text-blue-800">编辑</button>
                      <button onClick={() => handleToggleStatus(tenant)} className="mr-2 text-amber-600 hover:text-amber-800">{tenant.status === "ACTIVE" ? "停用" : "启用"}</button>
                      <button onClick={() => handleDelete(tenant)} className="text-rose-600 hover:text-rose-800">删除</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 通用底部分页控件 */}
      <Pagination
        total={data.total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => {
          setPage(p)
          loadData(p, pageSize, keyword, statusFilter)
        }}
        onPageSizeChange={(ps) => {
          setPageSize(ps)
          setPage(1)
          loadData(1, ps, keyword, statusFilter)
        }}
      />

      {/* 新增/编辑弹窗 */}
      {showForm && <TenantFormDialog tenant={editingTenant} onSubmit={handleFormSubmit} onClose={() => setShowForm(false)} />}

      {/* 分配套餐弹窗 */}
      {showAssignPkg && assignTarget && <AssignPackageDialog tenant={assignTarget} onSubmit={handleAssignSubmit} onClose={() => setShowAssignPkg(false)} />}
      {historyTarget && <SubscriptionHistoryDialog tenant={historyTarget} onClose={() => setHistoryTarget(null)} />}
    </div>
  )
}

// === Tenant Form Dialog ===
function TenantFormDialog({ tenant, onSubmit, onClose }: { tenant: Tenant | null; onSubmit: (data: Record<string, any>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    tenantCode: tenant?.tenantCode ?? "", name: tenant?.name ?? "", contactName: tenant?.contactName ?? "", contactPhone: tenant?.contactPhone ?? "", domain: tenant?.domain ?? "",
    packageId: tenant?.packageId ?? "", status: tenant?.status ?? "ACTIVE", effectiveAt: tenant?.effectiveAt ? tenant.effectiveAt.split("T")[0] : "", expireTime: tenant?.expireTime ? tenant.expireTime.split("T")[0] : defaultTenantExpireDate(),
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
            <Section title="服务与套餐" description="新租户默认自生效日起 10 年到期；套餐提供默认菜单和席位，留空租户席位覆盖时使用套餐默认值。">
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


function SubscriptionHistoryDialog({ tenant, onClose }: { tenant: Tenant; onClose: () => void }) {
  const [items, setItems] = useState<TenantSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    request.get<TenantSubscription[]>(`${API.TENANT_SUBSCRIPTIONS}/${tenant.id}/subscriptions`)
      .then((result) => {
        if (!active) return
        if (result.success && result.data) setItems(result.data)
        else setError(result.error || "加载订阅历史失败")
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [tenant.id])

  const formatDate = (value: string | null) => value ? new Date(value).toLocaleDateString("zh-CN") : "长期"
  const changeLabel: Record<string, string> = { CREATE: "创建", PACKAGE_CHANGE: "变更套餐", MANUAL: "人工调整", MIGRATION: "历史初始化" }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="text-base font-semibold text-slate-900">订阅历史</h2><p className="mt-1 text-sm text-slate-500">租户「{tenant.name}」的套餐、有效期与额度变更记录</p></div><button type="button" onClick={onClose} aria-label="关闭" className="h-8 w-8 rounded text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button></header>
        <div className="max-h-[60vh] overflow-auto"><table className="w-full min-w-[700px] text-sm"><thead><tr className="border-b bg-slate-50 text-left text-xs text-slate-500"><th className="px-4 py-3">变更时间</th><th className="px-4 py-3">套餐</th><th className="px-4 py-3">有效期</th><th className="px-4 py-3">席位覆盖</th><th className="px-4 py-3">来源</th><th className="px-4 py-3">状态</th></tr></thead><tbody>{loading ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr> : error ? <tr><td colSpan={6} className="px-4 py-12 text-center text-red-600">{error}</td></tr> : items.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">暂无订阅记录</td></tr> : items.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="px-4 py-3 text-slate-500">{new Date(item.createdAt).toLocaleString("zh-CN")}</td><td className="px-4 py-3 font-medium text-slate-800">{item.packageName || item.packageId}</td><td className="px-4 py-3 text-slate-600">{formatDate(item.effectiveAt)} 至 {formatDate(item.expireAt)}</td><td className="px-4 py-3 text-slate-600">{item.accountLimit ?? "继承套餐"}</td><td className="px-4 py-3 text-slate-600">{changeLabel[item.changeType] || item.changeType}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${item.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{item.status === "ACTIVE" ? "当前有效" : "已替代"}</span></td></tr>)}</tbody></table></div>
        <footer className="flex justify-end border-t border-slate-100 px-5 py-3"><button type="button" onClick={onClose} className="h-9 rounded-lg border border-slate-200 px-4 text-sm text-slate-700 hover:bg-slate-50">关闭</button></footer>
      </div>
    </div>
  )
}
