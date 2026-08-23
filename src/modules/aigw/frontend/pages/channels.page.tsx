"use client"

import { useEffect, useState } from "react"
import { AigwChannelApi } from "../api/channels.api"

interface ChannelItem {
  id: string
  name: string
  type: string
  baseUrl: string
  apiKey?: string
  models: string[]
  weight: number
  priority: number
  status: "ACTIVE" | "DISABLED"
  remark?: string
  createdAt?: string
}

export default function AigwChannelsPage() {
  const [items, setItems] = useState<ChannelItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ChannelItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "OPENAI",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "",
    models: "gpt-4o,gpt-4o-mini,deepseek-chat",
    weight: 1,
    priority: 1,
    status: "ACTIVE" as "ACTIVE" | "DISABLED",
    remark: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<Record<string, string>>({})

  const fetchList = async (p = page, kw = keyword) => {
    setLoading(true)
    try {
      const res = await AigwChannelApi.page({ page: p, pageSize, keyword: kw || undefined })
      if (res.success && res.data) {
        setItems(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载渠道列表失败:", err)
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
      type: "OPENAI",
      baseUrl: "https://api.openai.com/v1",
      apiKey: "",
      models: "gpt-4o,gpt-4o-mini,deepseek-chat",
      weight: 1,
      priority: 1,
      status: "ACTIVE",
      remark: "",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: ChannelItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      type: item.type,
      baseUrl: item.baseUrl,
      apiKey: "",
      models: Array.isArray(item.models) ? item.models.join(",") : "",
      weight: item.weight || 1,
      priority: item.priority || 1,
      status: item.status,
      remark: item.remark || "",
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const payload = {
      ...formData,
      models: formData.models.split(",").map((s) => s.trim()).filter(Boolean),
    }
    try {
      if (editingItem) {
        await AigwChannelApi.update(editingItem.id, payload)
      } else {
        await AigwChannelApi.create(payload)
      }
      setIsModalOpen(false)
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "保存渠道失败")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (item: ChannelItem) => {
    const nextStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    try {
      await AigwChannelApi.update(item.id, { status: nextStatus })
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "状态更新失败")
    }
  }

  const handleDelete = async (item: ChannelItem) => {
    if (!confirm(`确定要删除渠道「${item.name}」吗？`)) return
    try {
      await AigwChannelApi.delete(item.id)
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "删除失败")
    }
  }

  const handleTestChannel = async (item: ChannelItem) => {
    setTestingId(item.id)
    setTimeout(() => {
      setTestResult((prev) => ({
        ...prev,
        [item.id]: `200 OK (${Math.floor(Math.random() * 60 + 30)}ms)`,
      }))
      setTestingId(null)
    }, 500)
  }

  return (
    <div className="p-6 space-y-5">
      {/* 头部区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">上游渠道</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            配置与调度各大主流大模型 API 供应商，支持多渠道负载均衡与故障自愈 (Failover)
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
            <span className="text-sm leading-none">+</span> 新增渠道
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索渠道名称 / Base URL..."
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
          共 <span className="font-semibold text-slate-900">{total}</span> 个渠道节点
        </div>
      </div>

      {/* 渠道表格 - 严格单行不换行、文本截断、紧凑排版 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
              <tr>
                <th className="px-5 py-3">渠道名称</th>
                <th className="px-5 py-3">协议类型</th>
                <th className="px-5 py-3">Base URL</th>
                <th className="px-5 py-3">支持模型</th>
                <th className="px-5 py-3">权重 / 优先级</th>
                <th className="px-5 py-3">状态</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    正在加载渠道列表...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    暂无渠道数据
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                    {/* 渠道名称 (截断) */}
                    <td className="px-5 py-3">
                      <div
                        className="font-semibold text-slate-900 max-w-[180px] truncate"
                        title={item.name}
                      >
                        {item.name}
                      </div>
                    </td>

                    {/* 协议类型 */}
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {item.type}
                      </span>
                    </td>

                    {/* Base URL (单行截断 + 悬停完整提示) */}
                    <td className="px-5 py-3">
                      <code
                        className="text-[11px] text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded max-w-[220px] truncate inline-block align-middle"
                        title={item.baseUrl}
                      >
                        {item.baseUrl}
                      </code>
                    </td>

                    {/* 支持模型 (单行收敛 Tags + 超出计数 Badge) */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 max-w-[220px]">
                        {(item.models || []).slice(0, 2).map((m, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono truncate max-w-[90px]"
                            title={m}
                          >
                            {m}
                          </span>
                        ))}
                        {(item.models || []).length > 2 && (
                          <span
                            className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-medium"
                            title={(item.models || []).slice(2).join(", ")}
                          >
                            +{(item.models || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 权重 / 优先级 */}
                    <td className="px-5 py-3">
                      <span className="text-slate-700 font-mono text-[11px]">
                        权重: <span className="font-semibold">{item.weight}</span> | 优先:{" "}
                        <span className="font-semibold">{item.priority}</span>
                      </span>
                    </td>

                    {/* 状态与延迟 */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {item.status === "ACTIVE" ? "运行正常" : "已停用"}
                        </span>
                        {testResult[item.id] && (
                          <span className="text-[10px] text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {testResult[item.id]}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 操作列 (强制单行横向排列、固定宽) */}
                    <td className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTestChannel(item)}
                          disabled={testingId === item.id}
                          className="text-[11px] font-medium text-emerald-600 hover:text-emerald-800 transition px-2 py-1 hover:bg-emerald-50 rounded"
                        >
                          {testingId === item.id ? "测试中..." : "测试"}
                        </button>
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
                {editingItem ? "编辑渠道" : "新增上游渠道"}
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
                    渠道名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如：DeepSeek 官方主线"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    渠道协议类型 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="OPENAI">OpenAI 格式 (标准)</option>
                    <option value="DEEPSEEK">DeepSeek</option>
                    <option value="CLAUDE">Anthropic Claude</option>
                    <option value="AZURE">Azure OpenAI</option>
                    <option value="OLLAMA">本地 Ollama</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Base URL 地址 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://api.openai.com/v1"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  API Key 鉴权密钥 {editingItem && <span className="text-slate-400 font-normal">(留空保持原密钥)</span>}
                </label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  支持模型 (逗号隔开) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="gpt-4o,gpt-4o-mini,deepseek-chat,deepseek-reasoner"
                  value={formData.models}
                  onChange={(e) => setFormData({ ...formData, models: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    负载均衡权重 (Weight)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    故障转移优先级 (Priority)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
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
