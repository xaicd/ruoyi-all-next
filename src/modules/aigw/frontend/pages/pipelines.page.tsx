"use client"

import { useEffect, useState } from "react"
import { AigwSplitApi } from "../api/pipelines.api"

interface PipelineItem {
  id: string
  carrierName: string
  month: string
  totalTokens: string
  totalAmount: string
  carrierShare: string
  platformShare: string
  status: "SETTLED" | "UNSETTLED" | string
  createdAt?: string
}

export default function AigwPipelinesPage() {
  const [items, setItems] = useState<PipelineItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PipelineItem | null>(null)
  const [form, setForm] = useState({
    carrierName: "中国移动通信集团 (广州/韶关集群)",
    month: "2026-08",
    totalTokens: "10000000",
    totalAmount: "100",
    carrierShare: "30",
    platformShare: "70",
    status: "SETTLED",
  })

  const fetchList = async (p = page) => {
    setLoading(true)
    try {
      const res = await AigwSplitApi.page({ page: p, pageSize })
      if (res.success && res.data) {
        setItems(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载清分流水失败:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList(page)
  }, [page])

  const handleOpenModal = (item?: PipelineItem) => {
    if (item) {
      setEditingItem(item)
      setForm({
        carrierName: item.carrierName,
        month: item.month,
        totalTokens: item.totalTokens,
        totalAmount: item.totalAmount,
        carrierShare: item.carrierShare,
        platformShare: item.platformShare,
        status: item.status,
      })
    } else {
      setEditingItem(null)
      setForm({
        carrierName: "中国电信广东省分公司",
        month: "2026-08",
        totalTokens: "10000000",
        totalAmount: "100",
        carrierShare: "30",
        platformShare: "70",
        status: "SETTLED",
      })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await AigwSplitApi.update(editingItem.id, form)
      } else {
        await AigwSplitApi.create(form)
      }
      setModalOpen(false)
      fetchList(page)
    } catch (err) {
      alert("保存失败")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除该笔清分流水记录吗？")) return
    try {
      await AigwSplitApi.delete(id)
      fetchList(page)
    } catch (err) {
      alert("删除失败")
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* 头部区域 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">运营商清分结算流水</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            实时按月度汇总中国移动 AI 算力集群消费比例与三方抽成清分对账单
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
            onClick={() => fetchList(page)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            刷新
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-1"
          >
            <span className="text-sm leading-none">+</span> 生成清分对账单
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="text-xs text-slate-600 font-medium">
          清分账期：<span className="font-mono bg-slate-100 px-2 py-0.5 rounded">2026-08 (本月)</span>
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          共 <span className="font-semibold text-slate-900">{total}</span> 笔清分对账记录
        </div>
      </div>

      {/* 视图展现 */}
      {viewMode === "table" ? (
        /* 流水表格 */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
                <tr>
                  <th className="px-5 py-3">合作运营商</th>
                  <th className="px-5 py-3">清分账期</th>
                  <th className="px-5 py-3">月度总算力 Token</th>
                  <th className="px-5 py-3">总流水金额</th>
                  <th className="px-5 py-3">运营商分成 (30%~35%)</th>
                  <th className="px-5 py-3">平台留存 (65%~70%)</th>
                  <th className="px-5 py-3">结算状态</th>
                  <th className="px-5 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      正在加载清分流水...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      暂无清分流水记录
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                      <td className="px-5 py-3 font-semibold text-slate-900">{item.carrierName}</td>
                      <td className="px-5 py-3 font-mono">{item.month}</td>
                      <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                        {Number(item.totalTokens)?.toLocaleString()} Token
                      </td>
                      <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                        ¥ {item.totalAmount}
                      </td>
                      <td className="px-5 py-3 font-mono font-semibold text-emerald-600">
                        ¥ {item.carrierShare}
                      </td>
                      <td className="px-5 py-3 font-mono font-semibold text-blue-600">
                        ¥ {item.platformShare}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            item.status === "SETTLED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {item.status === "SETTLED" ? "已对账结算" : "待二阶段划拨"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition px-2 py-1 hover:bg-blue-50 rounded"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
      ) : (
        /* 卡片网格视图 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-300 transition"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{item.carrierName}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">账期: {item.month}</span>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.status === "SETTLED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.status === "SETTLED" ? "已对账结算" : "待划拨"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">月度 Token</span>
                    <strong className="text-slate-800 font-mono">
                      {(Number(item.totalTokens) / 10000).toFixed(0)}w
                    </strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">总流水</span>
                    <strong className="text-slate-900 font-mono">¥ {item.totalAmount}</strong>
                  </div>
                  <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                    <span className="text-emerald-600 block text-[10px]">运营商分成</span>
                    <strong className="text-emerald-700 font-mono">¥ {item.carrierShare}</strong>
                  </div>
                  <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                    <span className="text-blue-600 block text-[10px]">平台留存</span>
                    <strong className="text-blue-700 font-mono">¥ {item.platformShare}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5 text-xs">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 font-medium rounded transition"
                >
                  编辑对账
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded transition"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? "编辑清分对账单" : "生成二阶段清分对账单"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">合作运营商</label>
                <input
                  type="text"
                  required
                  value={form.carrierName}
                  onChange={(e) => setForm({ ...form, carrierName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">清分账期</label>
                  <input
                    type="text"
                    required
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">月度 Token 算力</label>
                  <input
                    type="text"
                    required
                    value={form.totalTokens}
                    onChange={(e) => setForm({ ...form, totalTokens: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">总金额 (元)</label>
                  <input
                    type="text"
                    required
                    value={form.totalAmount}
                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">运营商分成</label>
                  <input
                    type="text"
                    required
                    value={form.carrierShare}
                    onChange={(e) => setForm({ ...form, carrierShare: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">平台留存</label>
                  <input
                    type="text"
                    required
                    value={form.platformShare}
                    onChange={(e) => setForm({ ...form, platformShare: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
