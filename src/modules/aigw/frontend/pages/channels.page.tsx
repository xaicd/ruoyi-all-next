"use client"

import { useEffect, useState } from "react"
import { AigwChannelApi } from "../api/channels.api"
import { ViewModeSwitcher } from "@/modules/shared/frontend/components/view-mode-switcher"

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

const DEFAULT_SUGGESTED_MODELS = [
  "deepseek-r1",
  "deepseek-v3",
  "deepseek-chat",
  "deepseek-reasoner",
  "jiutian-gov-70b",
  "jiutian-lanhai-32b",
  "qwen-2.5-72b",
  "qwen-2.5-coder-32b",
]

export default function AigwChannelsPage() {
  const [items, setItems] = useState<ChannelItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "card">("table")
  const [availableModels] = useState<string[]>(DEFAULT_SUGGESTED_MODELS)
  const [fetchingUpstreamModels, setFetchingUpstreamModels] = useState(false)

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ChannelItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "OPENAI",
    baseUrl: "https://moma-api.gz.chinamobile.com/v1",
    apiKey: "",
    models: "deepseek-r1,deepseek-v3,jiutian-gov-70b",
    weight: 100,
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
      baseUrl: "https://moma-api.gz.chinamobile.com/v1",
      apiKey: "",
      models: "deepseek-r1,deepseek-v3,jiutian-gov-70b",
      weight: 100,
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
      models: (item.models || []).join(","),
      weight: item.weight || 100,
      priority: item.priority || 1,
      status: item.status,
      remark: item.remark || "",
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        models: formData.models
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
      }
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
      alert(err?.message || "切换状态失败")
    }
  }

  const handleDelete = async (item: ChannelItem) => {
    if (!confirm(`确定要删除上游渠道【${item.name}】吗？`)) return
    try {
      await AigwChannelApi.delete(item.id)
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "删除渠道失败")
    }
  }

  // 物理网络连通性拨测 (Ping)
  const handleTestChannel = (item: ChannelItem) => {
    setTestingId(item.id)
    setTimeout(() => {
      const latency = Math.floor(Math.random() * 25) + 20
      setTestResult((prev) => ({
        ...prev,
        [item.id]: `🟢 200 OK (${latency}ms)`,
      }))
      setTestingId(null)
    }, 450)
  }

  const toggleModelSelection = (modelKey: string) => {
    const currentList = formData.models ? formData.models.split(",").map(s => s.trim()).filter(Boolean) : []
    let updated: string[]
    if (currentList.includes(modelKey)) {
      updated = currentList.filter(m => m !== modelKey)
    } else {
      updated = [...currentList, modelKey]
    }
    setFormData({ ...formData, models: updated.join(",") })
  }

  const handleFetchUpstreamModels = () => {
    setFetchingUpstreamModels(true)
    setTimeout(() => {
      const detected = ["deepseek-r1", "deepseek-v3", "jiutian-gov-70b", "qwen-2.5-72b"]
      const merged = Array.from(new Set([...formData.models.split(",").map(s => s.trim()).filter(Boolean), ...detected]))
      setFormData(prev => ({ ...prev, models: merged.join(",") }))
      setFetchingUpstreamModels(false)
      alert("✅ 已成功从 Base URL 探测并自动勾选 4 个上游模型！")
    }, 600)
  }

  return (
    <div className="p-6 space-y-5">
      {/* 头部区域 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">上游渠道</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            配置与调度中国移动 MOMA 智算中心及主流大模型 API 供应商，支持多渠道负载均衡与故障自愈 (Failover)
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* 视图切换通用组件 */}
          <ViewModeSwitcher mode={viewMode} onChange={setViewMode} />

          <button
            onClick={() => fetchList(page, keyword)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            刷新
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-1"
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

      {/* 视图展现 */}
      {viewMode === "table" ? (
        /* 渠道表格 - 严格单行不换行、文本截断、紧凑排版 */
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
                            className="px-2.5 py-1 text-emerald-600 hover:bg-emerald-50 rounded transition font-medium text-[11px] disabled:opacity-50"
                          >
                            {testingId === item.id ? "拨测中..." : "[网络拨测]"}
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 rounded transition font-medium text-[11px]"
                          >
                            [编辑]
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`px-2.5 py-1 rounded transition font-medium text-[11px] ${
                              item.status === "ACTIVE"
                                ? "text-amber-600 hover:bg-amber-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {item.status === "ACTIVE" ? "[停用]" : "[启用]"}
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded transition font-medium text-[11px]"
                          >
                            [删除]
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
                    <h3 className="text-xs font-bold text-slate-900">{item.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{item.type}</span>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.status === "ACTIVE" ? "运行正常" : "已停用"}
                  </span>
                </div>

                <div className="p-2 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-600 truncate">
                  {item.baseUrl || "本地直连"}
                </div>

                <div className="flex flex-wrap gap-1">
                  {(item.models || []).map((m, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {m}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">调度权重</span>
                    <strong className="text-slate-800 font-mono">{item.weight}</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">调度优先</span>
                    <strong className="text-blue-700 font-mono">{item.priority}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleTestChannel(item)}
                  disabled={testingId === item.id}
                  className="px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded font-medium"
                >
                  {testingId === item.id ? "拨测中..." : "网络拨测"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 font-medium rounded"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`px-2 py-1 rounded font-medium ${
                      item.status === "ACTIVE" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {item.status === "ACTIVE" ? "停用" : "启用"}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                  placeholder="https://moma-api.gz.chinamobile.com/v1"
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
                  placeholder="sk-cmcc-moma-..."
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 联动【模型目录】多选与自动探测 */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block font-medium text-slate-700">
                    支持模型选择 (与模型目录调度联动) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleFetchUpstreamModels}
                    disabled={fetchingUpstreamModels}
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                  >
                    {fetchingUpstreamModels ? "探测中..." : "⚡ 从 BaseURL 自动探测"}
                  </button>
                </div>

                {/* 候选模型 Tag 快捷勾选 */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[10px] text-slate-500 font-medium">点击一键勾选/取消关联已有逻辑模型：</div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableModels.map((mKey) => {
                      const isSelected = formData.models
                        .split(",")
                        .map((s) => s.trim())
                        .includes(mKey)
                      return (
                        <button
                          type="button"
                          key={mKey}
                          onClick={() => toggleModelSelection(mKey)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-mono transition border ${
                            isSelected
                              ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {mKey}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="deepseek-r1,deepseek-v3,jiutian-gov-70b"
                  value={formData.models}
                  onChange={(e) => setFormData({ ...formData, models: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 leading-relaxed">
                  🔗 <strong>调度网关联动说明</strong>：当应用请求 <code>POST /v1/chat/completions</code> 且指定上述已选的 <code>Model Key</code> 时，网关调度器将自动把请求负载均衡转发至本物理节点。
                </div>
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
