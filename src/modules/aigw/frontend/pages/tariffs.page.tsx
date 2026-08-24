"use client"

import { useEffect, useState } from "react"
import { AigwTariffApi } from "../api/tariffs.api"

interface TariffItem {
  id: string
  name: string
  modelPattern: string
  unitPrice: number
  offPeakRatio: number
  status: "ACTIVE" | "DISABLED"
  createdAt?: string
}

export default function AigwTariffsPage() {
  const [items, setItems] = useState<TariffItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TariffItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    modelPattern: "deepseek/*",
    unitPrice: 0.002,
    offPeakRatio: 0.5,
    status: "ACTIVE" as "ACTIVE" | "DISABLED",
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchList = async (p = page, kw = keyword) => {
    setLoading(true)
    try {
      const res = await AigwTariffApi.page({ page: p, pageSize })
      if (res.success && res.data) {
        let list = res.data.items || []
        if (kw) list = list.filter((i: any) => i.name.includes(kw) || i.modelPattern.includes(kw))
        setItems(list)
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载资费规则失败:", err)
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
      modelPattern: "deepseek/*",
      unitPrice: 0.002,
      offPeakRatio: 0.5,
      status: "ACTIVE",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: TariffItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      modelPattern: item.modelPattern,
      unitPrice: item.unitPrice,
      offPeakRatio: item.offPeakRatio,
      status: item.status,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingItem) {
        await AigwTariffApi.update(editingItem.id, formData)
      } else {
        await AigwTariffApi.create(formData)
      }
      setIsModalOpen(false)
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "保存资费规则失败")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (item: TariffItem) => {
    const nextStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    try {
      await AigwTariffApi.update(item.id, { status: nextStatus })
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "状态更新失败")
    }
  }

  const handleDelete = async (item: TariffItem) => {
    if (!confirm(`确定要删除资费规则「${item.name}」吗？`)) return
    try {
      await AigwTariffApi.delete(item.id)
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
          <h1 className="text-xl font-bold tracking-tight text-slate-900">资费策略与闲时折扣</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            配置不同模型通配符的基准 Token 单价、闲时 (夜间 22:00~08:00) 阶梯折扣倍率
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
            <span className="text-sm leading-none">+</span> 新增资费规则
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索规则名称 / 模型匹配..."
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
          共 <span className="font-semibold text-slate-900">{total}</span> 条资费策略
        </div>
      </div>

      {/* 资费表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
              <tr>
                <th className="px-5 py-3">策略名称</th>
                <th className="px-5 py-3">模型通配匹配</th>
                <th className="px-5 py-3">基准单价 (元/kToken)</th>
                <th className="px-5 py-3">闲时折扣倍率</th>
                <th className="px-5 py-3">状态</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    正在加载资费规则列表...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    暂无资费规则
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                    <td className="px-5 py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="px-5 py-3">
                      <code className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-semibold">
                        {item.modelPattern}
                      </code>
                    </td>
                    <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                      ¥ {item.unitPrice} / kToken
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[11px] font-medium border border-amber-200 font-mono">
                        {item.offPeakRatio * 10} 折 ({item.offPeakRatio * 100}%)
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          item.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {item.status === "ACTIVE" ? "生效中" : "已停用"}
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
                {editingItem ? "编辑资费规则" : "新增资费规则"}
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
                    策略名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如：DeepSeek 闲时 5 折资费"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    模型匹配通配符 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如：deepseek/*"
                    value={formData.modelPattern}
                    onChange={(e) => setFormData({ ...formData, modelPattern: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    基准单价 (元/kToken)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0.002 })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    闲时折扣倍率 (0.1~1.0)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="1.0"
                    value={formData.offPeakRatio}
                    onChange={(e) => setFormData({ ...formData, offPeakRatio: parseFloat(e.target.value) || 0.5 })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
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
