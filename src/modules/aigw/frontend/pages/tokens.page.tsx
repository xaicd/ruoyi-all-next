"use client"

import { useEffect, useState } from "react"
import { AigwTokenApi } from "../api/tokens.api"

interface TokenItem {
  id: string
  name: string
  key: string
  quota: number
  usedQuota: number
  unlimitedQuota?: boolean
  status: "ACTIVE" | "DISABLED"
  expiredAt?: string | null
  createdAt?: string
}

export default function AigwTokensPage() {
  const [items, setItems] = useState<TokenItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TokenItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    quota: 500000,
    unlimitedQuota: false,
    status: "ACTIVE" as "ACTIVE" | "DISABLED",
    expiredAt: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [createdTokenResult, setCreatedTokenResult] = useState<string | null>(null)

  const fetchList = async (p = page, kw = keyword) => {
    setLoading(true)
    try {
      const res = await AigwTokenApi.page({ page: p, pageSize, keyword: kw || undefined })
      if (res.success && res.data) {
        setItems(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载令牌列表失败:", err)
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
    setCreatedTokenResult(null)
    setFormData({
      name: "",
      quota: 500000,
      unlimitedQuota: false,
      status: "ACTIVE",
      expiredAt: "",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: TokenItem) => {
    setEditingItem(item)
    setCreatedTokenResult(null)
    setFormData({
      name: item.name,
      quota: item.quota,
      unlimitedQuota: item.unlimitedQuota || false,
      status: item.status,
      expiredAt: item.expiredAt ? item.expiredAt.slice(0, 10) : "",
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingItem) {
        await AigwTokenApi.update(editingItem.id, formData)
        setIsModalOpen(false)
      } else {
        const res = await AigwTokenApi.create(formData)
        if (res.data?.key) {
          setCreatedTokenResult(res.data.key)
        } else {
          setIsModalOpen(false)
        }
      }
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "保存令牌失败")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (item: TokenItem) => {
    const nextStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    try {
      await AigwTokenApi.update(item.id, { status: nextStatus })
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "状态更新失败")
    }
  }

  const handleDelete = async (item: TokenItem) => {
    if (!confirm(`确定要删除令牌「${item.name}」吗？`)) return
    try {
      await AigwTokenApi.delete(item.id)
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "删除失败")
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatQuota = (val?: number) => {
    if (val === undefined || val === null) return "0"
    if (val >= 1000000) return (val / 1000000).toFixed(2) + "M"
    if (val >= 1000) return (val / 1000).toFixed(1) + "k"
    return String(val)
  }

  return (
    <div className="p-6 space-y-5">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">调用令牌 (API Keys)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            生成与分发兼容 OpenAI 协议的访问令牌，支持按租户限额与过期时间控制
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
            <span className="text-sm leading-none">+</span> 生成新令牌
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索令牌名称 / Key..."
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
          共 <span className="font-semibold text-slate-900">{total}</span> 个活跃令牌
        </div>
      </div>

      {/* 表格 - 严格单行不换行、文本截断 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
              <tr>
                <th className="px-5 py-3">令牌名称</th>
                <th className="px-5 py-3">API 密钥 (Key)</th>
                <th className="px-5 py-3">总配额 / 已消耗</th>
                <th className="px-5 py-3">配额使用率</th>
                <th className="px-5 py-3">状态</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    正在加载令牌列表...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    暂无已生成的访问令牌
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const percent = item.unlimitedQuota
                    ? 0
                    : Math.min(100, Math.round(((item.usedQuota || 0) / (item.quota || 1)) * 100))
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                      {/* 令牌名称 (截断) */}
                      <td className="px-5 py-3">
                        <div
                          className="font-semibold text-slate-900 max-w-[180px] truncate"
                          title={item.name}
                        >
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.expiredAt ? `到期: ${item.expiredAt.slice(0, 10)}` : "永不过期"}
                        </div>
                      </td>

                      {/* API Key */}
                      <td className="px-5 py-3">
                        <div className="inline-flex items-center gap-1.5 max-w-[220px]">
                          <code
                            className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono truncate max-w-[160px] inline-block"
                            title={item.key}
                          >
                            {item.key}
                          </code>
                          <button
                            onClick={() => copyToClipboard(item.key, item.id)}
                            className="text-[10px] text-blue-600 hover:text-blue-800 transition"
                          >
                            {copiedId === item.id ? "已复制" : "复制"}
                          </button>
                        </div>
                      </td>

                      {/* 配额 */}
                      <td className="px-5 py-3">
                        <span className="text-[11px] font-mono text-slate-700">
                          {item.unlimitedQuota ? "无限额度" : `${formatQuota(item.quota)} Token`} /{" "}
                          <span className="text-slate-400">{formatQuota(item.usedQuota)}</span>
                        </span>
                      </td>

                      {/* 进度条 */}
                      <td className="px-5 py-3">
                        {item.unlimitedQuota ? (
                          <span className="text-[11px] text-slate-400">不限</span>
                        ) : (
                          <div className="w-28">
                            <div className="flex justify-between text-[10px] mb-0.5 font-mono text-slate-500">
                              <span>{percent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  percent > 90
                                    ? "bg-rose-500"
                                    : percent > 60
                                    ? "bg-amber-500"
                                    : "bg-blue-600"
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </td>

                      {/* 状态 */}
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {item.status === "ACTIVE" ? "生效中" : "已禁用"}
                        </span>
                      </td>

                      {/* 操作列 (单行横向) */}
                      <td className="px-5 py-3 text-right whitespace-nowrap min-w-[170px]">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition px-2 py-1 hover:bg-blue-50 rounded"
                          >
                            调整
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`text-[11px] font-medium px-2 py-1 rounded transition ${
                              item.status === "ACTIVE"
                                ? "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                                : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                            }`}
                          >
                            {item.status === "ACTIVE" ? "禁用" : "启用"}
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
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {createdTokenResult ? "令牌生成成功" : editingItem ? "调整令牌配额" : "生成新调用令牌"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {createdTokenResult ? (
              <div className="p-5 space-y-3.5 text-xs">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="font-semibold text-emerald-900 mb-1">
                    请妥善保管您的 API Key（仅显示一次）：
                  </div>
                  <div className="flex items-center justify-between bg-white border border-emerald-300 rounded-lg p-2">
                    <code className="font-mono text-emerald-700 break-all select-all">
                      {createdTokenResult}
                    </code>
                    <button
                      onClick={() => copyToClipboard(createdTokenResult, "created")}
                      className="ml-2 px-2.5 py-1 text-xs font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700 transition shrink-0"
                    >
                      {copiedId === "created" ? "已复制" : "复制"}
                    </button>
                  </div>
                </div>
                <div className="text-slate-500">
                  您可以在 OpenAI SDK 或任何支持标准 OpenAI API 格式的客户端中使用此 Key 调用模型中台网关。
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-1.5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    我知道了
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    令牌名称 / 用途备注 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如：生产环境客服助手 / 研发测试 Key"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-slate-700">
                      Token 配额上限
                    </label>
                    <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.unlimitedQuota}
                        onChange={(e) => setFormData({ ...formData, unlimitedQuota: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      设为无限额度
                    </label>
                  </div>
                  <input
                    type="number"
                    min="1000"
                    step="10000"
                    disabled={formData.unlimitedQuota}
                    value={formData.quota}
                    onChange={(e) => setFormData({ ...formData, quota: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    过期时间 (可选，留空为永不过期)
                  </label>
                  <input
                    type="date"
                    value={formData.expiredAt}
                    onChange={(e) => setFormData({ ...formData, expiredAt: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    {submitting ? "正在生成..." : "确认生成"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
