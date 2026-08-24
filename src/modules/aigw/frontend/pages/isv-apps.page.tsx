"use client"

import { useEffect, useState } from "react"
import { AigwIsvAppApi, type IsvAppItem } from "../api/isv-apps.api"

export default function AigwIsvAppsPage() {
  const [items, setItems] = useState<IsvAppItem[]>([])
  const [total, setTotal] = useState(0)
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<IsvAppItem | null>(null)
  const [formData, setFormData] = useState({
    appCode: "",
    name: "",
    vendor: "",
    category: "OFFICE" as "OFFICE" | "DEV" | "WORKFLOW" | "CUSTOM",
    momaModelTarget: "deepseek-v3-moma",
    commissionRate: 0.3,
    authSecret: "",
    activeSeatsCount: 0,
    status: "ACTIVE" as "ACTIVE" | "DISABLED",
    icon: "💼",
    description: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchList = async (kw = keyword) => {
    setLoading(true)
    try {
      const res = await AigwIsvAppApi.list({ keyword: kw || undefined })
      setItems(res.items || [])
      setTotal(res.total || 0)
    } catch (err) {
      console.error("加载智能体应用失败:", err)
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
      appCode: "",
      name: "",
      vendor: "",
      category: "OFFICE",
      momaModelTarget: "deepseek-v3-moma",
      commissionRate: 0.3,
      authSecret: `sec_${Math.random().toString(36).slice(2, 10)}`,
      activeSeatsCount: 0,
      status: "ACTIVE",
      icon: "🤖",
      description: "",
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: IsvAppItem) => {
    setEditingItem(item)
    setFormData({
      appCode: item.appCode,
      name: item.name,
      vendor: item.vendor,
      category: item.category,
      momaModelTarget: item.momaModelTarget,
      commissionRate: item.commissionRate,
      authSecret: item.authSecret,
      activeSeatsCount: item.activeSeatsCount,
      status: item.status,
      icon: item.icon || "🤖",
      description: item.description || "",
    })
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (item: IsvAppItem) => {
    const nextStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    try {
      await AigwIsvAppApi.update(item.id, { status: nextStatus })
      fetchList()
    } catch (err: any) {
      alert(`更新状态失败: ${err.message}`)
    }
  }

  const handleDelete = async (item: IsvAppItem) => {
    if (!confirm(`确定下架并删除智能体应用 ${item.name} 吗？`)) return
    try {
      await AigwIsvAppApi.delete(item.id)
      fetchList()
    } catch (err: any) {
      alert(`删除失败: ${err.message}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingItem) {
        await AigwIsvAppApi.update(editingItem.id, formData)
      } else {
        await AigwIsvAppApi.create(formData)
      }
      setIsModalOpen(false)
      fetchList()
    } catch (err: any) {
      alert(`提交失败: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* 1. 页面 Header 规范 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            中国移动政企智能体应用生态分发池
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            聚合中移九天、腾讯 WorkBuddy、阿里 Qoder 等政企专版 Agent，统一鉴权并绑定移动 MOMA 算力管道与政企账单统付
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
            <span>+ 接入新智能体</span>
          </button>
        </div>
      </div>

      {/* 2. 搜索栏 Search Container 规范 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索应用名称、代码或厂商..."
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
          已接入 <span className="text-slate-900 font-bold">{total}</span> 个政企专版智能体
        </div>
      </div>

      {/* 3.1 表格列表视图 (严格单行 UI 规范，无折行无跨行) */}
      {viewMode === "table" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="px-5 py-3 whitespace-nowrap min-w-[240px]">智能体应用</th>
                  <th className="px-5 py-3 whitespace-nowrap min-w-[180px]">厂商 / 定位</th>
                  <th className="px-5 py-3 whitespace-nowrap min-w-[180px]">绑定 MOMA 算力通道</th>
                  <th className="px-5 py-3 whitespace-nowrap">ISV 分润</th>
                  <th className="px-5 py-3 whitespace-nowrap">政企席位</th>
                  <th className="px-5 py-3 whitespace-nowrap">状态</th>
                  <th className="px-5 py-3 whitespace-nowrap text-right min-w-[190px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-xs text-slate-400">
                      {loading ? "加载中..." : "暂无智能体应用数据"}
                    </td>
                  </tr>
                ) : (
                  items.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition">
                      {/* 列 1: 严格单行应用名称 + code */}
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-2.5" title={app.description || app.name}>
                          <span className="text-xl p-1 bg-slate-100 rounded-lg flex-shrink-0">{app.icon}</span>
                          <span className="font-bold text-slate-900">{app.name}</span>
                          <span className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-500 rounded">
                            {app.appCode}
                          </span>
                        </div>
                      </td>

                      {/* 列 2: 严格单行厂商 + 分类 */}
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span>{app.vendor}</span>
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">
                            {app.category === "OFFICE"
                              ? "协同办公"
                              : app.category === "DEV"
                              ? "研发信创"
                              : app.category === "WORKFLOW"
                              ? "工作流"
                              : "BYOK"}
                          </span>
                        </div>
                      </td>

                      {/* 列 3: 严格单行算力通道 */}
                      <td className="px-5 py-3.5 text-xs font-mono font-semibold text-blue-700 whitespace-nowrap">
                        {app.momaModelTarget}
                      </td>

                      {/* 列 4: 严格单行分润 */}
                      <td className="px-5 py-3.5 text-xs font-bold text-amber-600 font-mono whitespace-nowrap">
                        {(app.commissionRate * 100).toFixed(0)}%
                      </td>

                      {/* 列 5: 严格单行席位数 */}
                      <td className="px-5 py-3.5 text-xs font-mono font-bold text-slate-800 whitespace-nowrap">
                        {app.activeSeatsCount.toLocaleString()} 席位
                      </td>

                      {/* 列 6: 状态 Badge */}
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            app.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {app.status === "ACTIVE" ? "已激活" : "已暂停"}
                        </span>
                      </td>

                      {/* 列 7: 操作列 */}
                      <td className="px-5 py-3.5 text-xs text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="px-2 py-1 text-blue-600 hover:bg-blue-50 font-medium rounded transition"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleToggleStatus(app)}
                          className={`px-2 py-1 font-medium rounded transition ${
                            app.status === "ACTIVE"
                              ? "text-amber-600 hover:bg-amber-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {app.status === "ACTIVE" ? "停用" : "启用"}
                        </button>
                        <button
                          onClick={() => handleDelete(app)}
                          className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded transition"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3.2 卡片网格视图 (Card View Mode: 展开完整政企场景描述与架构大卡) */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((app) => (
            <div
              key={app.id}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-300 transition"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 bg-slate-100 rounded-xl">{app.icon}</span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">{app.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">code: {app.appCode}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                      app.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {app.status === "ACTIVE" ? "已激活" : "已暂停"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  {app.description || "暂无应用描述"}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">算力通道</span>
                    <strong className="text-blue-700 font-mono">{app.momaModelTarget}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">活跃席位</span>
                    <strong className="text-slate-800 font-mono">{app.activeSeatsCount.toLocaleString()} 席</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  厂商: <strong className="text-slate-700 font-normal">{app.vendor}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(app)}
                    className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 font-medium rounded transition"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleToggleStatus(app)}
                    className={`px-2 py-1 rounded text-xs font-medium transition ${
                      app.status === "ACTIVE" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {app.status === "ACTIVE" ? "停用" : "启用"}
                  </button>
                  <button
                    onClick={() => handleDelete(app)}
                    className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded transition"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. 新增 / 编辑弹窗 Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {editingItem ? "编辑智能体应用" : "接入新智能体应用"}
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
                  <label className="block text-slate-700 font-semibold mb-1">应用名称 *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="如: 中移九天专属助理"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">应用 Code *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingItem}
                    value={formData.appCode}
                    onChange={(e) => setFormData({ ...formData, appCode: e.target.value })}
                    placeholder="如: jiutian-gov"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">厂商名称 *</label>
                  <input
                    type="text"
                    required
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="如: 中国移动通信集团"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">图标 Emoji</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="如: 🇨🇳"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">应用类别</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="OFFICE">协同办公</option>
                    <option value="DEV">研发信创</option>
                    <option value="WORKFLOW">工作流</option>
                    <option value="CUSTOM">BYOK 生态</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ISV 分润比例</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">绑定 MOMA 算力通道 *</label>
                <input
                  type="text"
                  required
                  value={formData.momaModelTarget}
                  onChange={(e) => setFormData({ ...formData, momaModelTarget: e.target.value })}
                  placeholder="deepseek-v3-moma / jiutian-gov-special"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">政企场景描述</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="说明该智能体在政企客户中的主要价值与使用场景..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
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
                  {submitting ? "保存中..." : "确定保存"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
