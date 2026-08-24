"use client"

import { useEffect, useState } from "react"
import { AigwEnterpriseApi } from "../api/enterprises.api"

interface EnterpriseItem {
  id: string
  name: string
  code: string
  province?: string
  city?: string
  industry?: string
  contactName?: string
  contactPhone?: string
  status: "ACTIVE" | "DISABLED"
  createdAt?: string
}

export default function AigwEnterprisesPage() {
  const [items, setItems] = useState<EnterpriseItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<EnterpriseItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    province: "广东省",
    city: "广州市",
    industry: "电信/运营商",
    contactName: "",
    contactPhone: "",
    status: "ACTIVE" as "ACTIVE" | "DISABLED",
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchList = async (p = page, kw = keyword) => {
    setLoading(true)
    try {
      const res = await AigwEnterpriseApi.page({ page: p, pageSize, keyword: kw || undefined })
      if (res.success && res.data) {
        setItems(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载企业列表失败:", err)
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
      name: "",
      code: "",
      province: "广东省",
      city: "广州市",
      industry: "电信/运营商",
      contactName: "",
      contactPhone: "",
      status: "ACTIVE",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: EnterpriseItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      code: item.code,
      province: item.province || "广东省",
      city: item.city || "广州市",
      industry: item.industry || "电信/运营商",
      contactName: item.contactName || "",
      contactPhone: item.contactPhone || "",
      status: item.status,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingItem) {
        await AigwEnterpriseApi.update(editingItem.id, formData)
      } else {
        await AigwEnterpriseApi.create(formData)
      }
      setIsModalOpen(false)
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "保存企业失败")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (item: EnterpriseItem) => {
    const nextStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    try {
      await AigwEnterpriseApi.update(item.id, { status: nextStatus })
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "状态更新失败")
    }
  }

  const handleDelete = async (item: EnterpriseItem) => {
    if (!confirm(`确定要删除企业「${item.name}」吗？`)) return
    try {
      await AigwEnterpriseApi.delete(item.id)
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
          <h1 className="text-xl font-bold tracking-tight text-slate-900">算力开户与企业客户</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            管理 AI 算力开户企业主体、企业编号、省份区域与对接联系人
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
            <span className="text-sm leading-none">+</span> 新增企业开户
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索企业名称 / 编号..."
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
          共 <span className="font-semibold text-slate-900">{total}</span> 家开户企业
        </div>
      </div>

      {/* 企业表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
              <tr>
                <th className="px-5 py-3">企业编号</th>
                <th className="px-5 py-3">企业主体名称</th>
                <th className="px-5 py-3">区域/城市</th>
                <th className="px-5 py-3">行业类型</th>
                <th className="px-5 py-3">联系人/电话</th>
                <th className="px-5 py-3">开户状态</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    正在加载企业开户列表...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    暂无开户企业数据
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                    <td className="px-5 py-3">
                      <code className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        {item.code}
                      </code>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-5 py-3">{item.province || "—"} / {item.city || "—"}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-medium border border-indigo-100">
                        {item.industry || "通用行业"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-700">
                      {item.contactName || "未填"} {item.contactPhone && `(${item.contactPhone})`}
                    </td>
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
                {editingItem ? "编辑企业开户" : "新增企业开户"}
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
                    企业主体名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如：广州智算科技发展有限公司"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    企业唯一编号 (Code) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如：GZ_ZHISUAN_01"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">省份区域</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">城市区域</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">对接联系人</label>
                  <input
                    type="text"
                    placeholder="如：张经理"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">联系人电话</label>
                  <input
                    type="text"
                    placeholder="13800000000"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
