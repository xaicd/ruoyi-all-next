"use client"

import { useEffect, useState } from "react"
import { AigwModelApi } from "../api/models.api"
import { AigwChannelApi } from "../api/channels.api"
import { ViewModeSwitcher, ViewMode } from "@/modules/shared/frontend/components/view-mode-switcher"

interface ModelItem {
  id: string
  name: string
  modelKey: string
  provider: string
  inputRatio: number
  outputRatio: number
  status: "ACTIVE" | "DISABLED"
  sort: number
  description?: string
  createdAt?: string
}

const PRESET_PROVIDERS = [
  "中移九天",
  "中移 MOMA",
  "DeepSeek",
  "阿里通义",
  "智谱 GLM",
  "月之暗面",
  "本地 Ollama",
]

export default function AigwModelsPage() {
  const [items, setItems] = useState<ModelItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState("")
  const [providerFilter, setProviderFilter] = useState("ALL")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "card">("table")
  const [channelsList, setChannelsList] = useState<any[]>([])

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ModelItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    modelKey: "",
    provider: "DeepSeek",
    inputRatio: 1.0,
    outputRatio: 2.0,
    sort: 0,
    status: "ACTIVE" as "ACTIVE" | "DISABLED",
    description: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const fetchList = async (p = page, kw = keyword) => {
    setLoading(true)
    try {
      const res = await AigwModelApi.page({ page: p, pageSize, keyword: kw || undefined })
      if (res.success && res.data) {
        setItems(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载模型列表失败:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadChannels = async () => {
    try {
      const res = await AigwChannelApi.page({ page: 1, pageSize: 100 })
      if (res.success && res.data?.items) {
        setChannelsList(res.data.items)
      }
    } catch (err) {
      // fallback
    }
  }

  useEffect(() => {
    fetchList(page, keyword)
    loadChannels()
  }, [page])

  const getChannelsForModel = (modelKey: string) => {
    return channelsList.filter((c) => (c.models || []).includes(modelKey))
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setPage(1)
    fetchList(1, keyword)
  }

  const handleReset = () => {
    setKeyword("")
    setProviderFilter("ALL")
    setPage(1)
    fetchList(1, "")
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({
      name: "",
      modelKey: "",
      provider: "DeepSeek",
      inputRatio: 1.0,
      outputRatio: 2.0,
      sort: 0,
      status: "ACTIVE",
      description: "",
    })
    setIsModalOpen(true)
  }

  const openEditModal = (item: ModelItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      modelKey: item.modelKey,
      provider: item.provider,
      inputRatio: item.inputRatio,
      outputRatio: item.outputRatio,
      sort: item.sort || 0,
      status: item.status,
      description: item.description || "",
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editingItem) {
        await AigwModelApi.update(editingItem.id, formData)
      } else {
        await AigwModelApi.create(formData)
      }
      setIsModalOpen(false)
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "保存模型失败")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (item: ModelItem) => {
    const nextStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    try {
      await AigwModelApi.update(item.id, { status: nextStatus })
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "切换状态失败")
    }
  }

  const handleDelete = async (item: ModelItem) => {
    if (!confirm(`确定要删除模型【${item.name}】吗？`)) return
    try {
      await AigwModelApi.delete(item.id)
      fetchList(page, keyword)
    } catch (err: any) {
      alert(err?.message || "删除模型失败")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const distinctProviders = Array.from(new Set(items.map((m) => m.provider).filter(Boolean)))

  const filteredItems = items.filter((item) => {
    if (providerFilter !== "ALL" && item.provider !== providerFilter) return false
    return true
  })

  return (
    <div className="p-6 space-y-5">
      {/* 头部区域 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">模型目录与费率</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            维护对外暴露的统一模型服务、输入/输出 Token 计费倍率，并自动关联底层物理供货渠道
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* 通用视图切换组件 */}
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
            <span className="text-sm leading-none">+</span> 新增模型
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索模型名称 / ModelKey / 提供商..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">全部提供商 ({distinctProviders.length})</option>
            {distinctProviders.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
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
          共 <span className="font-semibold text-slate-900">{total}</span> 个可用模型
        </div>
      </div>

      {/* 视图展现 */}
      {viewMode === "table" ? (
        /* 模型表格 - 严格单行不换行、文本截断 */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
                <tr>
                  <th className="px-5 py-3">模型名称</th>
                  <th className="px-5 py-3">Model Key (调用代码)</th>
                  <th className="px-5 py-3">提供商</th>
                  <th className="px-5 py-3">挂载供货渠道 (高可用)</th>
                  <th className="px-5 py-3">输入倍率</th>
                  <th className="px-5 py-3">输出倍率</th>
                  <th className="px-5 py-3">状态</th>
                  <th className="px-5 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      正在加载模型目录...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      暂无匹配的模型数据
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const supplyingChannels = getChannelsForModel(item.modelKey)
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                        {/* 模型名称 (截断) */}
                        <td className="px-5 py-3">
                          <div
                            className="font-semibold text-slate-900 max-w-[180px] truncate"
                            title={item.name}
                          >
                            {item.name}
                          </div>
                        </td>

                        {/* ModelKey (带一键复制) */}
                        <td className="px-5 py-3">
                          <div className="inline-flex items-center gap-1.5 max-w-[180px]">
                            <code
                              className="text-[11px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono truncate max-w-[130px] inline-block font-semibold"
                              title={item.modelKey}
                            >
                              {item.modelKey}
                            </code>
                            <button
                              onClick={() => copyToClipboard(item.modelKey)}
                              className="text-[10px] text-slate-400 hover:text-slate-700 transition"
                            >
                              {copiedKey === item.modelKey ? "已复制" : "复制"}
                            </button>
                          </div>
                        </td>

                        {/* 提供商 */}
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 font-mono">
                            {item.provider}
                          </span>
                        </td>

                        {/* 挂载供货渠道 */}
                        <td className="px-5 py-3">
                          {supplyingChannels.length > 0 ? (
                            <div className="inline-flex items-center gap-1 max-w-[200px] overflow-hidden">
                              {supplyingChannels.map((c) => (
                                <span
                                  key={c.id}
                                  className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-medium truncate max-w-[100px]"
                                  title={`${c.name} (权重:${c.weight})`}
                                >
                                  {c.name.replace("中国移动", "中移")}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                              ⚠️ 暂无关联渠道
                            </span>
                          )}
                        </td>

                        {/* 输入倍率 */}
                        <td className="px-5 py-3 font-mono text-[11px] text-slate-700 font-semibold">
                          {item.inputRatio}x
                        </td>

                        {/* 输出倍率 */}
                        <td className="px-5 py-3 font-mono text-[11px] text-slate-700 font-semibold">
                          {item.outputRatio}x
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
                            {item.status === "ACTIVE" ? "启用中" : "已禁用"}
                          </span>
                        </td>

                        {/* 操作列 (单行横向) */}
                        <td className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(item)}
                              className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition px-2 py-1 hover:bg-blue-50 rounded"
                            >
                              [编辑]
                            </button>
                            <button
                              onClick={() => handleToggleStatus(item)}
                              className={`text-[11px] font-medium px-2 py-1 rounded transition ${
                                item.status === "ACTIVE"
                                  ? "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                                  : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                              }`}
                            >
                              {item.status === "ACTIVE" ? "[禁用]" : "[启用]"}
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
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
            const supplyingChannels = getChannelsForModel(item.modelKey)
            return (
              <div
                key={item.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-blue-300 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{item.name}</h3>
                      <span className="text-[10px] text-blue-600 font-mono font-semibold">{item.modelKey}</span>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.status === "ACTIVE" ? "启用中" : "已禁用"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.description || "提供商绑定大模型"}
                  </p>

                  {/* 供货渠道 */}
                  <div className="p-2 bg-slate-50 rounded-lg text-[11px] space-y-1">
                    <span className="text-slate-400 block text-[10px]">物理供货渠道 ({supplyingChannels.length} 个):</span>
                    <div className="flex flex-wrap gap-1">
                      {supplyingChannels.length > 0 ? (
                        supplyingChannels.map((c) => (
                          <span key={c.id} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-mono">
                            {c.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-amber-600 text-[10px]">⚠️ 暂无关联渠道</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">输入倍率</span>
                      <strong className="text-slate-800 font-mono">{item.inputRatio}x</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">输出倍率</span>
                      <strong className="text-slate-800 font-mono">{item.outputRatio}x</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] font-medium">{item.provider}</span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 rounded font-medium text-[11px]"
                    >
                      [编辑]
                    </button>
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`px-2.5 py-1 rounded font-medium text-[11px] ${
                        item.status === "ACTIVE" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {item.status === "ACTIVE" ? "[禁用]" : "[启用]"}
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded font-medium text-[11px]"
                    >
                      [删除]
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 模态弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? "编辑模型与资费" : "新增自定义逻辑模型"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  模型名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：DeepSeek-R1 深度推理 / 中移九天政务大模型"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Model Key (API 调用代码) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="deepseek-reasoner"
                    value={formData.modelKey}
                    onChange={(e) => setFormData({ ...formData, modelKey: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    模型品牌/提供商 (支持自定义) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="preset-providers-datalist"
                    placeholder="输入或选择提供商"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <datalist id="preset-providers-datalist">
                    {PRESET_PROVIDERS.map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {PRESET_PROVIDERS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({ ...formData, provider: p })}
                        className={`px-1.5 py-0.5 rounded text-[10px] transition border ${
                          formData.provider === p
                            ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 实时关联渠道展示 */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-800 flex items-center justify-between">
                  <span>🔗 底层供货机房 (单向自动汇总)</span>
                  <span className="text-[10px] font-normal text-slate-500">
                    共 {getChannelsForModel(formData.modelKey).length} 个可用节点
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {getChannelsForModel(formData.modelKey).length > 0 ? (
                    getChannelsForModel(formData.modelKey).map((c) => (
                      <span key={c.id} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-mono">
                        ✓ {c.name} (权重:{c.weight})
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      💡 提示：在「上游渠道」配置好机房并填写该 ModelKey 后，网关将自动为此模型分发流量。
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    输入倍率 (Input Ratio)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.inputRatio}
                    onChange={(e) => setFormData({ ...formData, inputRatio: parseFloat(e.target.value) || 1.0 })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    输出倍率 (Output Ratio)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.outputRatio}
                    onChange={(e) => setFormData({ ...formData, outputRatio: parseFloat(e.target.value) || 2.0 })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">描述与备注</label>
                <textarea
                  rows={2}
                  placeholder="模型特性与适用场景..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
