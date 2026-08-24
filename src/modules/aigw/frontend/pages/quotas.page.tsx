"use client"

import { useEffect, useState } from "react"
import { AigwQuotaApi } from "../api/quotas.api"

interface QuotaItem {
  id: string
  enterpriseId: string
  enterpriseName: string
  monthlyTokenCap: number
  usedTokenCount: number
  warnThresholdRatio: number
  autoThrottle: boolean
  status: "ACTIVE" | "DISABLED"
  createdAt?: string
}

export default function AigwQuotasPage() {
  const [items, setItems] = useState<QuotaItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<QuotaItem | null>(null)
  const [form, setForm] = useState({
    enterpriseName: "",
    monthlyTokenCap: 50000000,
    warnThresholdRatio: 80,
    autoThrottle: true,
  })

  const fetchList = async (p = page) => {
    setLoading(true)
    try {
      const res = await AigwQuotaApi.page({ page: p, pageSize })
      if (res.success && res.data) {
        setItems(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载配额列表失败:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList(page)
  }, [page])

  const handleOpenModal = (item?: QuotaItem) => {
    if (item) {
      setEditingItem(item)
      setForm({
        enterpriseName: item.enterpriseName,
        monthlyTokenCap: item.monthlyTokenCap,
        warnThresholdRatio: item.warnThresholdRatio,
        autoThrottle: item.autoThrottle,
      })
    } else {
      setEditingItem(null)
      setForm({
        enterpriseName: "",
        monthlyTokenCap: 50000000,
        warnThresholdRatio: 80,
        autoThrottle: true,
      })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await AigwQuotaApi.update(editingItem.id, form)
      } else {
        await AigwQuotaApi.create(form)
      }
      setModalOpen(false)
      fetchList(page)
    } catch (err) {
      alert("保存失败")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除该企业的配额管控策略吗？")) return
    try {
      await AigwQuotaApi.delete(id)
      fetchList(page)
    } catch (err) {
      alert("删除失败")
    }
  }

  const filteredItems = items.filter(
    (item) => !keyword || item.enterpriseName.includes(keyword)
  )

  return (
    <div className="p-6 space-y-5">
      {/* 头部区域 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">企业算力配额与用量水线</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            管控政企客户月度 Token 消费上限封顶、高水位预警阈值与自动限流保护
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
            <span className="text-sm leading-none">+</span> 划拨/新增算力配额
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={(e) => { e.preventDefault(); fetchList(page) }} className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索企业名称..."
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
            onClick={() => setKeyword("")}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            重置
          </button>
        </form>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          共 <span className="font-semibold text-slate-900">{filteredItems.length}</span> 个管控企业
        </div>
      </div>

      {/* 视图展现 */}
      {viewMode === "table" ? (
        /* 配额表格 */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
                <tr>
                  <th className="px-5 py-3">企业名称</th>
                  <th className="px-5 py-3">月度算力封顶 (Token)</th>
                  <th className="px-5 py-3">本月已用 (Token)</th>
                  <th className="px-5 py-3">使用率水位</th>
                  <th className="px-5 py-3">预警阈值</th>
                  <th className="px-5 py-3">自动熔断限流</th>
                  <th className="px-5 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      正在加载配额列表...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      暂无配额管控记录
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const usageRatio = Math.min(100, Math.round(((item.usedTokenCount || 0) / (item.monthlyTokenCap || 1)) * 100))
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                        <td className="px-5 py-3 font-semibold text-slate-900">{item.enterpriseName}</td>
                        <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                          {item.monthlyTokenCap?.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 font-mono text-indigo-600 font-semibold">
                          {item.usedTokenCount?.toLocaleString()}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                              <div
                                className={`h-full ${usageRatio > 80 ? "bg-rose-500" : "bg-emerald-500"}`}
                                style={{ width: `${usageRatio}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] font-semibold text-slate-700">{usageRatio}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono">{item.warnThresholdRatio}%</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              item.autoThrottle
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.autoThrottle ? "已开启" : "未开启"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition px-2 py-1 hover:bg-blue-50 rounded"
                            >
                              [调整配额]
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-[11px] font-medium text-rose-600 hover:text-rose-800 transition px-2 py-1 hover:bg-rose-50 rounded"
                            >
                              [删除]
                            </button>
                          </div>
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
        /* 卡片网格视图 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const usageRatio = Math.min(100, Math.round(((item.usedTokenCount || 0) / (item.monthlyTokenCap || 1)) * 100))
            return (
              <div
                key={item.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-300 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{item.enterpriseName}</h3>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.autoThrottle ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.autoThrottle ? "自动熔断" : "仅预警"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>已用 / 封顶</span>
                      <span>
                        {((item.usedTokenCount || 0) / 10000).toFixed(0)}w / {((item.monthlyTokenCap || 0) / 10000).toFixed(0)}w
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${usageRatio > 80 ? "bg-rose-500" : "bg-blue-600"}`}
                        style={{ width: `${usageRatio}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 flex justify-between">
                    <span className="text-slate-400">预警水位阈值</span>
                    <strong className="font-mono text-slate-800">{item.warnThresholdRatio}%</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5 text-xs">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 font-medium rounded transition"
                  >
                    调整配额
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

      {/* CRUD Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? "编辑算力配额" : "划拨/新增算力配额"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">企业名称</label>
                <input
                  type="text"
                  required
                  placeholder="例如：中国电信股份有限公司"
                  value={form.enterpriseName}
                  onChange={(e) => setForm({ ...form, enterpriseName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">月度算力封顶 (Token)</label>
                <input
                  type="number"
                  required
                  value={form.monthlyTokenCap}
                  onChange={(e) => setForm({ ...form, monthlyTokenCap: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">预警阈值比例 (%)</label>
                <input
                  type="number"
                  required
                  value={form.warnThresholdRatio}
                  onChange={(e) => setForm({ ...form, warnThresholdRatio: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoThrottle"
                  checked={form.autoThrottle}
                  onChange={(e) => setForm({ ...form, autoThrottle: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="autoThrottle" className="text-slate-700 font-medium">达到预警线自动开启熔断限流</label>
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
