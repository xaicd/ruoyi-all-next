"use client"

import { useEffect, useState } from "react"
import { AigwSeatApi } from "../api/seats.api"

interface SeatItem {
  id: string
  enterpriseId: string
  userName: string
  userEmail?: string
  appType: "WORKBUDDY" | "QODER" | "TRAE"
  monthlyTokenCap: number
  usedTokenCount: number
  status: "ACTIVE" | "DISABLED"
  createdAt?: string
}

export default function AigwSeatsPage() {
  const [items, setItems] = useState<SeatItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SeatItem | null>(null)
  const [formData, setFormData] = useState({
    enterpriseId: "CT_GD_GOV",
    userName: "",
    userEmail: "",
    appType: "WORKBUDDY" as "WORKBUDDY" | "QODER" | "TRAE",
    monthlyTokenCap: 50000000,
    status: "ACTIVE" as "ACTIVE" | "DISABLED",
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchList = async (p = page, kw = keyword) => {
    setLoading(true)
    try {
      const res = await AigwSeatApi.page({ page: p, pageSize, enterpriseId: kw || undefined })
      if (res.success && res.data) {
        setItems(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载席位列表失败:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList(page, keyword)
  }, [page])

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setPage(1)
    fetchList(1, keyword)
  }

  const handleReset = () => {
    setKeyword("")
    setPage(1)
    fetchList(1, "")
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      enterpriseId: "CT_GD_GOV",
      userName: "",
      userEmail: "",
      appType: "WORKBUDDY",
      monthlyTokenCap: 50000000,
      status: "ACTIVE",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: SeatItem) => {
    setEditingItem(item)
    setFormData({
      enterpriseId: item.enterpriseId,
      userName: item.userName,
      userEmail: item.userEmail || "",
      appType: item.appType,
      monthlyTokenCap: item.monthlyTokenCap,
      status: item.status,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingItem) {
        await AigwSeatApi.update(editingItem.id, formData)
      } else {
        await AigwSeatApi.create(formData)
      }
      setIsModalOpen(false)
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "保存席位失败")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (item: SeatItem) => {
    const nextStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    try {
      await AigwSeatApi.update(item.id, { status: nextStatus })
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "状态更新失败")
    }
  }

  const handleDelete = async (item: SeatItem) => {
    if (!confirm(`确定要删除席位「${item.userName}」吗？`)) return
    try {
      await AigwSeatApi.delete(item.id)
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "删除失败")
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* 头部区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">席位分配与授权</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            管理开发者客户端 IDE (WorkBuddy/Qoder/Trae) 开发者席位授权与月度 Token 配额上限
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchList(page, keyword)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            刷新
          </button>
          <button
            onClick={openCreateModal}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-1"
          >
            <span className="text-sm leading-none">+</span> 新增席位授权
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索授权邮箱 / 企业编号..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition"
          >
            查询
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            重置
          </button>
        </form>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          共 <span className="font-semibold text-slate-900">{total}</span> 个授权席位
        </div>
      </div>

      {/* 席位表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
              <tr>
                <th className="px-5 py-3">所属企业</th>
                <th className="px-5 py-3">开发者姓名/邮箱</th>
                <th className="px-5 py-3">客户端应用类型</th>
                <th className="px-5 py-3">月度 Token 配额</th>
                <th className="px-5 py-3">已使用 Token</th>
                <th className="px-5 py-3">席位状态</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    正在加载席位授权列表...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    暂无席位数据
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                    <td className="px-5 py-3">
                      <code className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        {item.enterpriseId}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-900">{item.userName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.userEmail || "未绑定邮箱"}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-medium border border-indigo-100">
                        {item.appType}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono">{item.monthlyTokenCap?.toLocaleString()} Token</td>
                    <td className="px-5 py-3 font-mono text-slate-500">{item.usedTokenCount?.toLocaleString()} Token</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          item.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {item.status === "ACTIVE" ? "正常" : "禁用"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition px-2 py-1 hover:bg-blue-50 rounded"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`text-[11px] font-medium px-2 py-1 rounded transition ${
                            item.status === "ACTIVE"
                              ? "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                              : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                          }`}
                        >
                          {item.status === "ACTIVE" ? "停用" : "启用"}
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-[11px] font-medium text-rose-600 hover:text-rose-800 transition px-2 py-1 hover:bg-rose-50 rounded"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 弹窗表单 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? "编辑席位授权" : "新增席位授权"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    所属企业编号 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如：CT_GD_GOV"
                    value={formData.enterpriseId}
                    onChange={(e) => setFormData({ ...formData, enterpriseId: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    客户端应用类型 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.appType}
                    onChange={(e) => setFormData({ ...formData, appType: e.target.value as any })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="WORKBUDDY">WorkBuddy IDE</option>
                    <option value="QODER">Qoder Agent</option>
                    <option value="TRAE">Trae IDE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    开发者姓名 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如：张三 (高级工程师)"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    开发者邮箱 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="dev_seat@telecom.gd.cn"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  月度 Token 配额上限 (Monthly Token Cap)
                </label>
                <input
                  type="number"
                  min="1000"
                  value={formData.monthlyTokenCap}
                  onChange={(e) => setFormData({ ...formData, monthlyTokenCap: parseInt(e.target.value) || 50000000 })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3.5 py-1.5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "正在保存..." : "确认保存"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
