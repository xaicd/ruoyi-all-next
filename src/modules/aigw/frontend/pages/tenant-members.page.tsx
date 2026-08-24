"use client"

import { useEffect, useState } from "react"
import { AigwTenantMemberApi, type MemberAllocationItem } from "../api/tenant-members.api"

export default function AigwTenantMembersPage() {
  const [items, setItems] = useState<MemberAllocationItem[]>([])
  const [total, setTotal] = useState(0)
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MemberAllocationItem | null>(null)
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    deptName: "数智创新部",
    monthlyTokenCap: 10_000_000,
    momaBeansBalance: 10000,
    allowedApps: ["workbuddy", "qoder"] as string[],
    status: "ACTIVE" as "ACTIVE" | "DISABLED",
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchList = async (kw = keyword) => {
    setLoading(true)
    try {
      const res = await AigwTenantMemberApi.list({ keyword: kw || undefined })
      setItems(res.items || [])
      setTotal(res.total || 0)
    } catch (err) {
      console.error("加载政企成员失败:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormData({
      phone: "",
      name: "",
      deptName: "数智创新部",
      monthlyTokenCap: 10_000_000,
      momaBeansBalance: 10000,
      allowedApps: ["workbuddy", "qoder"],
      status: "ACTIVE",
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: MemberAllocationItem) => {
    setEditingItem(item)
    setFormData({
      phone: item.phone,
      name: item.name,
      deptName: item.deptName,
      monthlyTokenCap: item.monthlyTokenCap,
      momaBeansBalance: item.momaBeansBalance,
      allowedApps: item.allowedApps || ["workbuddy"],
      status: item.status,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingItem) {
        await AigwTenantMemberApi.update(editingItem.id, formData)
      } else {
        await AigwTenantMemberApi.create(formData)
      }
      setIsModalOpen(false)
      fetchList()
    } catch (err: any) {
      alert(err.message || "保存失败")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleApp = (appCode: string) => {
    if (formData.allowedApps.includes(appCode)) {
      setFormData({
        ...formData,
        allowedApps: formData.allowedApps.filter((a) => a !== appCode),
      })
    } else {
      setFormData({
        ...formData,
        allowedApps: [...formData.allowedApps, appCode],
      })
    }
  }

  const handleToggleStatus = async (item: MemberAllocationItem) => {
    const nextStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    try {
      await AigwTenantMemberApi.update(item.id, { status: nextStatus })
      fetchList()
    } catch (err: any) {
      alert(err.message || "更新状态失败")
    }
  }

  const handleDelete = async (item: MemberAllocationItem) => {
    if (!confirm("确定要移除该员工的算力与智能体授权吗？")) return
    try {
      await AigwTenantMemberApi.delete(item.id)
      fetchList()
    } catch (err: any) {
      alert(err.message || "删除失败")
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* 1. 页面 Header 规范 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            政企成员管理与算力份额分配
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            通过手机号打通各大智能体原生客户端鉴权，按人/部门管控月度 Token 额度与移动豆
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 视图切换按钮 */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>☰</span>
              <span>列表视图</span>
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
                viewMode === "card"
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>⊞</span>
              <span>卡片视图</span>
            </button>
          </div>

          <button
            onClick={() => fetchList()}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 shadow-xs transition"
          >
            {loading ? "刷新中..." : "刷新"}
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition flex items-center gap-1.5"
          >
            <span>+ 导入/添加员工</span>
          </button>
        </div>
      </div>

      {/* 2. 搜索栏 Search Container 规范 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索员工姓名、手机号或部门..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-72 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            onClick={() => fetchList(keyword)}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition"
          >
            查询
          </button>
          <button
            onClick={() => {
              setKeyword("")
              fetchList("")
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            重置
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          共 <span className="text-slate-900 font-bold">{total}</span> 位政企已授权员工
        </div>
      </div>

      {/* 3. 视图切换 */}
      {viewMode === "table" ? (
        /* 3.1 表格 Table 规范 */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 font-semibold tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-5 py-3 whitespace-nowrap min-w-[220px]">员工姓名 / 登录手机号</th>
                  <th className="px-5 py-3 whitespace-nowrap min-w-[140px]">所属部门</th>
                  <th className="px-5 py-3 whitespace-nowrap min-w-[180px]">已授权智能体</th>
                  <th className="px-5 py-3 whitespace-nowrap min-w-[180px]">月度 Token 消费水位</th>
                  <th className="px-5 py-3 whitespace-nowrap">移动豆余量</th>
                  <th className="px-5 py-3 whitespace-nowrap">状态</th>
                  <th className="px-5 py-3 text-right whitespace-nowrap min-w-[180px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-xs text-slate-400">
                      {loading ? "加载中..." : "暂无成员授权数据"}
                    </td>
                  </tr>
                ) : (
                  items.map((mem) => {
                    const usagePct = mem.monthlyTokenCap > 0 ? Math.min(100, Math.round((mem.usedTokens / mem.monthlyTokenCap) * 100)) : 0
                    return (
                      <tr key={mem.id} className="hover:bg-slate-50/50 transition whitespace-nowrap">
                        <td className="px-5 py-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{mem.name}</span>
                            <span className="text-[11px] text-blue-600 font-mono">📱 {mem.phone}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3 text-xs text-slate-600 font-medium">
                          {mem.deptName}
                        </td>

                        <td className="px-5 py-3 text-xs">
                          <div className="flex flex-wrap gap-1">
                            {(mem.allowedApps || []).map((app) => (
                              <span
                                key={app}
                                className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-mono font-medium"
                              >
                                {app}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-5 py-3 text-xs">
                          <div className="space-y-1 min-w-[150px]">
                            <div className="flex justify-between text-[11px] font-mono text-slate-500">
                              <span>{(mem.usedTokens / 10000).toFixed(0)}w</span>
                              <span>/ {(mem.monthlyTokenCap / 10000).toFixed(0)}w</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  usagePct > 90
                                    ? "bg-rose-500"
                                    : usagePct > 70
                                    ? "bg-amber-500"
                                    : "bg-blue-600"
                                }`}
                                style={{ width: `${usagePct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3 text-xs font-mono font-bold text-amber-600">
                          {mem.momaBeansBalance.toLocaleString()} 豆
                        </td>

                        <td className="px-5 py-3 text-xs">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              mem.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}
                          >
                            {mem.status === "ACTIVE" ? "正常" : "冻结"}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-xs text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleOpenEdit(mem)}
                            className="px-2 py-1 text-blue-600 hover:bg-blue-50 font-medium rounded transition"
                          >
                            配额调整
                          </button>
                          <button
                            onClick={() => handleToggleStatus(mem)}
                            className={`px-2 py-1 font-medium rounded transition ${
                              mem.status === "ACTIVE"
                                ? "text-amber-600 hover:bg-amber-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {mem.status === "ACTIVE" ? "冻结" : "解冻"}
                          </button>
                          <button
                            onClick={() => handleDelete(mem)}
                            className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded transition"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 3.2 卡片 Card 规范 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((mem) => {
            const usagePct = mem.monthlyTokenCap > 0 ? Math.min(100, Math.round((mem.usedTokens / mem.monthlyTokenCap) * 100)) : 0
            return (
              <div
                key={mem.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-300 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{mem.name}</h3>
                      <span className="text-[11px] text-blue-600 font-mono">📱 {mem.phone}</span>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                        mem.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {mem.status === "ACTIVE" ? "正常" : "冻结"}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 flex justify-between items-center">
                    <span>部门: {mem.deptName}</span>
                    <span className="font-mono font-bold text-amber-600">{mem.momaBeansBalance} 移动豆</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>Token 用量水位</span>
                      <span>{usagePct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          usagePct > 90 ? "bg-rose-500" : usagePct > 70 ? "bg-amber-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${usagePct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(mem.allowedApps || []).map((app) => (
                      <span key={app} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-mono">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5 text-xs">
                  <button
                    onClick={() => handleOpenEdit(mem)}
                    className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 font-medium rounded transition"
                  >
                    配额调整
                  </button>
                  <button
                    onClick={() => handleToggleStatus(mem)}
                    className={`px-2 py-1 rounded font-medium transition ${
                      mem.status === "ACTIVE" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {mem.status === "ACTIVE" ? "冻结" : "解冻"}
                  </button>
                  <button
                    onClick={() => handleDelete(mem)}
                    className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded transition"
                  >
                    删除
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. 新增 / 编辑 Modal Form 弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {editingItem ? "调整员工算力份额与智能体授权" : "添加政企员工算力授权"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">员工姓名 *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="如: 张工"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">登录手机号 (SSO唯一标识) *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="如: 13911112222"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">所属部门 *</label>
                  <input
                    type="text"
                    required
                    value={formData.deptName}
                    onChange={(e) => setFormData({ ...formData, deptName: e.target.value })}
                    placeholder="如: 技术研发中心"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">月度 Token 额度上限 *</label>
                  <input
                    type="number"
                    step={1_000_000}
                    required
                    value={formData.monthlyTokenCap}
                    onChange={(e) => setFormData({ ...formData, monthlyTokenCap: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">开通允许使用的智能体应用 *</label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    onClick={() => handleToggleApp("workbuddy")}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      formData.allowedApps.includes("workbuddy")
                        ? "bg-blue-50 border-blue-300 text-blue-800"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>💼</span>
                    <span className="font-semibold">WorkBuddy</span>
                  </label>

                  <label
                    onClick={() => handleToggleApp("qoder")}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      formData.allowedApps.includes("qoder")
                        ? "bg-blue-50 border-blue-300 text-blue-800"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>⚡</span>
                    <span className="font-semibold">Qoder</span>
                  </label>

                  <label
                    onClick={() => handleToggleApp("trae")}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      formData.allowedApps.includes("trae")
                        ? "bg-blue-50 border-blue-300 text-blue-800"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>🚀</span>
                    <span className="font-semibold">Trae</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition"
                >
                  {submitting ? "保存中..." : "确定分配"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
