"use client"

import { useEffect, useState, useCallback } from "react"
import { AigwSkuApi } from "../api/skus.api"
import type { AigwSkuRow, SkuCategory } from "@/modules/aigw/backend/repositories/aigw-sku.repository"
import { ViewModeSwitcher, ViewMode } from "@/modules/shared/frontend/components/view-mode-switcher"
import { Pagination } from "@/modules/shared/frontend/components/pagination"

const CATEGORY_MAP: Record<SkuCategory, { label: string; bg: string; text: string; border: string }> = {
  TOKEN_RECHARGE: { label: "通用充值包", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  MODEL_DEDICATED: { label: "专属模型包", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  SEAT_BUNDLE: { label: "席位套餐包", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  GPU_HOURS: { label: "GPU卡时包", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
}

const BADGE_MAP: Record<string, { label: string; bg: string; text: string }> = {
  HOT: { label: "热销", bg: "bg-rose-500", text: "text-white" },
  PROMO: { label: "特惠", bg: "bg-amber-500", text: "text-white" },
  NEW: { label: "首购尝鲜", bg: "bg-emerald-500", text: "text-white" },
  ENTERPRISE: { label: "政企专享", bg: "bg-indigo-600", text: "text-white" },
}

function formatTokens(tokens: number): string {
  if (!tokens) return "0 Token"
  if (tokens >= 1_000_000_000) return `${(tokens / 1_000_000_000).toFixed(tokens % 1_000_000_000 === 0 ? 0 : 1)} 亿 Token`
  if (tokens >= 10_000) return `${(tokens / 10_000).toLocaleString()} 万 Token`
  return `${tokens.toLocaleString()} Token`
}

interface SpecEntry {
  key: string
  value: string
}

export default function AigwSkusPage() {
  const [items, setItems] = useState<AigwSkuRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [viewMode, setViewMode] = useState<ViewMode>("card")

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AigwSkuRow | null>(null)
  
  // Form State
  const [form, setForm] = useState({
    code: "",
    name: "",
    category: "TOKEN_RECHARGE" as SkuCategory,
    tokens: 50_000_000,
    price: 199,
    originalPrice: "" as string | number,
    validityDays: 90,
    modelScope: "deepseek-r1, deepseek-v3",
    qpsLimit: "" as string | number,
    tpmLimit: "" as string | number,
    badge: "HOT",
    status: "ACTIVE" as "ACTIVE" | "DISABLED",
    remark: "",
  })

  // Dynamic specs & features
  const [specList, setSpecList] = useState<SpecEntry[]>([
    { key: "contextWindow", value: "64K 超长上下文" },
    { key: "priorityQueue", value: "VIP 极速通道" },
  ])
  const [featureList, setFeatureList] = useState<string[]>([
    "首字时延 < 250ms",
    "支持深度思维链 CoT 输出",
  ])

  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await AigwSkuApi.page({
        page,
        pageSize,
        category: selectedCategory === "ALL" ? undefined : selectedCategory,
      })
      if (res.success && res.data) {
        let list = res.data.items || []
        if (keyword) {
          list = list.filter((i) => i.name.includes(keyword) || i.code.includes(keyword))
        }
        setItems(list)
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载算力包失败:", err)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, selectedCategory, keyword])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const handleOpenAdd = () => {
    setEditingItem(null)
    setForm({
      code: `SKU_${Date.now().toString().slice(-6)}`,
      name: "",
      category: "TOKEN_RECHARGE",
      tokens: 50_000_000,
      price: 199,
      originalPrice: 299,
      validityDays: 90,
      modelScope: "*",
      qpsLimit: 50,
      tpmLimit: 400_000,
      badge: "HOT",
      status: "ACTIVE",
      remark: "",
    })
    setSpecList([
      { key: "contextWindow", value: "128K 超长上下文" },
      { key: "slaGuarantee", value: "99.95% 专网级保障" },
    ])
    setFeatureList(["首字时延 < 200ms", "即充即用毫秒级生效"])
    setModalOpen(true)
  }

  const handleOpenEdit = (item: AigwSkuRow) => {
    setEditingItem(item)
    setForm({
      code: item.code,
      name: item.name,
      category: item.category || "TOKEN_RECHARGE",
      tokens: item.tokens,
      price: item.price,
      originalPrice: item.originalPrice ?? "",
      validityDays: item.validityDays ?? 90,
      modelScope: (item.modelScope || ["*"]).join(", "),
      qpsLimit: item.qpsLimit ?? "",
      tpmLimit: item.tpmLimit ?? "",
      badge: item.badge || "",
      status: item.status as any,
      remark: item.remark || "",
    })
    const specs = item.specs ? Object.entries(item.specs).map(([key, value]) => ({ key, value })) : []
    setSpecList(specs.length > 0 ? specs : [{ key: "contextWindow", value: "64K" }])
    setFeatureList(item.features && item.features.length > 0 ? [...item.features] : ["支持专属队列"])
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const specsObj: Record<string, string> = {}
    specList.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsObj[s.key.trim()] = s.value.trim()
      }
    })

    const payload: Partial<AigwSkuRow> = {
      code: form.code,
      name: form.name,
      category: form.category,
      tokens: Number(form.tokens),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      validityDays: Number(form.validityDays),
      modelScope: form.modelScope.split(",").map((s) => s.trim()).filter(Boolean),
      qpsLimit: form.qpsLimit ? Number(form.qpsLimit) : undefined,
      tpmLimit: form.tpmLimit ? Number(form.tpmLimit) : undefined,
      badge: form.badge.trim() || undefined,
      specs: specsObj,
      features: featureList.filter((f) => f.trim().length > 0),
      status: form.status,
      remark: form.remark,
    }

    try {
      if (editingItem) {
        await AigwSkuApi.update(editingItem.id, payload)
      } else {
        await AigwSkuApi.create(payload)
      }
      setModalOpen(false)
      fetchList()
    } catch (err: any) {
      alert(err?.message || "保存失败")
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`确定要删除算力包【${name}】吗？`)) return
    try {
      await AigwSkuApi.delete(id)
      fetchList()
    } catch (err: any) {
      alert(err?.message || "删除失败")
    }
  }

  const handleToggleStatus = async (item: AigwSkuRow) => {
    const nextStatus = item.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    try {
      await AigwSkuApi.update(item.id, { status: nextStatus })
      fetchList()
    } catch (err: any) {
      alert(err?.message || "状态切换失败")
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      {/* 顶部 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">算力包 SKU 规格中心</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            配置政企算力加油包、专属大模型推理包、席位捆绑套餐与 GPU 卡时实例
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewModeSwitcher mode={viewMode} onChange={setViewMode} />
          <button
            onClick={() => fetchList()}
            className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium shadow-2xs"
          >
            刷新
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-xs"
          >
            + 新增算力规格
          </button>
        </div>
      </div>

      {/* 品类选项卡 */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl w-fit border border-slate-200">
        <button
          onClick={() => { setSelectedCategory("ALL"); setPage(1) }}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
            selectedCategory === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          全部品类 ({total})
        </button>
        {(["TOKEN_RECHARGE", "MODEL_DEDICATED", "SEAT_BUNDLE", "GPU_HOURS"] as SkuCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setPage(1) }}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              selectedCategory === cat ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {CATEGORY_MAP[cat].label}
          </button>
        ))}
      </div>

      {/* 搜索工具栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索算力包名称、SKU编码或适用模型..."
            className="w-72 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={() => { setPage(1); fetchList() }}
            className="px-3 py-1.5 text-xs text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            查询
          </button>
          <button
            onClick={() => { setKeyword(""); setSelectedCategory("ALL"); setPage(1) }}
            className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            重置
          </button>
        </div>
        <div className="text-xs text-slate-500">
          共 <span className="font-semibold text-slate-700">{items.length}</span> 个算力规格节点
        </div>
      </div>

      {/* 视图呈现：卡片网格 vs 表格 */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((sku) => {
            const cat = CATEGORY_MAP[sku.category] || CATEGORY_MAP.TOKEN_RECHARGE
            const badge = sku.badge ? BADGE_MAP[sku.badge] || { label: sku.badge, bg: "bg-blue-600", text: "text-white" } : null

            return (
              <div
                key={sku.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                {/* 营销角标 */}
                {badge && (
                  <div className={`absolute top-0 right-0 ${badge.bg} ${badge.text} text-[10px] font-bold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider`}>
                    {badge.label}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${cat.bg} ${cat.text} ${cat.border}`}>
                      {cat.label}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{sku.code}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sku.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sku.remark || "全平台高性能大模型算力包"}</p>

                  {/* 价格与 Token 额度 */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-blue-600 font-mono">¥{sku.price.toLocaleString()}</span>
                      {sku.originalPrice && sku.originalPrice > sku.price && (
                        <span className="text-xs text-slate-400 line-through font-mono">¥{sku.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="text-xs text-slate-500 ml-auto">
                        {sku.validityDays > 0 ? `有效期 ${sku.validityDays} 天` : "永久有效"}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-xs font-medium text-slate-700">
                      <span>包含算力额度</span>
                      <span className="font-bold text-slate-900 font-mono">{formatTokens(sku.tokens)}</span>
                    </div>
                  </div>

                  {/* 适用模型与调度参数 */}
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">适用模型:</span>
                      <div className="flex flex-wrap gap-1">
                        {(sku.modelScope || ["*"]).map((m, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">
                            {m === "*" ? "全模型通用" : m}
                          </span>
                        ))}
                      </div>
                    </div>
                    {(sku.qpsLimit || sku.tpmLimit) && (
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        {sku.qpsLimit && <span>并发保障: <strong className="text-slate-700 font-mono">{sku.qpsLimit} QPS</strong></span>}
                        {sku.tpmLimit && <span>吞吐限额: <strong className="text-slate-700 font-mono">{sku.tpmLimit.toLocaleString()} TPM</strong></span>}
                      </div>
                    )}
                  </div>

                  {/* 特性卖点 */}
                  {sku.features && sku.features.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {sku.features.slice(0, 3).map((f, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 规格参数详情 */}
                  {sku.specs && Object.keys(sku.specs).length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-1.5 text-[11px]">
                      {Object.entries(sku.specs).slice(0, 4).map(([k, v]) => (
                        <div key={k} className="truncate text-slate-500" title={`${k}: ${v}`}>
                          <span className="text-slate-400">{k}:</span> {v}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 卡片底部操作栏 */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-block w-2 h-2 rounded-full ${sku.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-300"}`} />
                    <span className="text-xs text-slate-500">{sku.status === "ACTIVE" ? "可售卖" : "已下架"}</span>
                  </div>
                  <div className="space-x-2 text-xs">
                    <button
                      onClick={() => handleToggleStatus(sku)}
                      className={`font-medium ${sku.status === "ACTIVE" ? "text-amber-600 hover:text-amber-800" : "text-emerald-600 hover:text-emerald-800"}`}
                    >
                      {sku.status === "ACTIVE" ? "下架" : "上架"}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(sku)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(sku.id, sku.name)}
                      className="text-rose-600 hover:text-rose-800 font-medium"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* 表格视图 */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase">算力包 / SKU</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase">品类</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase">包含额度</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase">定价 / 原价</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase">有效期</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase">并发/吞吐保障</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase">扩展规格数</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase">状态</th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-500 uppercase min-w-[150px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {items.map((sku) => {
                  const cat = CATEGORY_MAP[sku.category] || CATEGORY_MAP.TOKEN_RECHARGE
                  return (
                    <tr key={sku.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-2.5 text-xs">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          {sku.name}
                          {sku.badge && <span className="px-1.5 py-0.2 text-[9px] bg-rose-500 text-white rounded font-bold">{sku.badge}</span>}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">{sku.code}</div>
                      </td>
                      <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${cat.bg} ${cat.text} ${cat.border}`}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-900 font-mono whitespace-nowrap">
                        {formatTokens(sku.tokens)}
                      </td>
                      <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                        <span className="font-bold text-blue-600 font-mono">¥{sku.price.toLocaleString()}</span>
                        {sku.originalPrice && <span className="text-[11px] text-slate-400 line-through ml-1.5 font-mono">¥{sku.originalPrice}</span>}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap">
                        {sku.validityDays > 0 ? `${sku.validityDays} 天` : "永久"}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap font-mono">
                        {sku.qpsLimit ? `${sku.qpsLimit} QPS` : "-"} / {sku.tpmLimit ? `${(sku.tpmLimit / 1000)}k TPM` : "-"}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap font-mono">
                        {Object.keys(sku.specs || {}).length} 项规格
                      </td>
                      <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sku.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {sku.status === "ACTIVE" ? "可售卖" : "已下架"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-right whitespace-nowrap space-x-2">
                        <button onClick={() => handleToggleStatus(sku)} className={`font-medium ${sku.status === "ACTIVE" ? "text-amber-600 hover:text-amber-800" : "text-emerald-600 hover:text-emerald-800"}`}>
                          {sku.status === "ACTIVE" ? "下架" : "上架"}
                        </button>
                        <button onClick={() => handleOpenEdit(sku)} className="text-blue-600 hover:text-blue-800 font-medium">编辑</button>
                        <button onClick={() => handleDelete(sku.id, sku.name)} className="text-rose-600 hover:text-rose-800 font-medium">删除</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 分页 */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        <Pagination
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(ps) => setPageSize(ps)}
        />
      </div>

      {/* 新增 / 编辑弹窗 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingItem ? "编辑算力包规格" : "新建算力包规格"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
            </div>

            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 text-xs">
              {/* 基础参数 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">算力包名称 *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="如：DeepSeek-R1 5000万 Token 算力包"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">SKU 唯一编码 *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="如：DEEPSEEK_R1_50M"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">算力品类 *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as SkuCategory })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="TOKEN_RECHARGE">通用充值包</option>
                    <option value="MODEL_DEDICATED">专属模型定向包</option>
                    <option value="SEAT_BUNDLE">席位+算力捆绑套餐</option>
                    <option value="GPU_HOURS">GPU卡时/实例包</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">营销角标 (可选)</label>
                  <select
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">无角标</option>
                    <option value="HOT">HOT (热销)</option>
                    <option value="PROMO">PROMO (特惠)</option>
                    <option value="NEW">NEW (首购)</option>
                    <option value="ENTERPRISE">ENTERPRISE (政企专享)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">上架状态</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">正常可售 (ACTIVE)</option>
                    <option value="DISABLED">暂时下架 (DISABLED)</option>
                  </select>
                </div>
              </div>

              {/* 额度与价格 */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">包含 Token 额度 *</label>
                  <input
                    type="number"
                    required
                    value={form.tokens}
                    onChange={(e) => setForm({ ...form, tokens: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-blue-600 mt-0.5 block">{formatTokens(form.tokens)}</span>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">售卖价格 (¥) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">划线原价 (¥)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    placeholder="选填"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">有效期 (天)</label>
                  <input
                    type="number"
                    value={form.validityDays}
                    onChange={(e) => setForm({ ...form, validityDays: Number(e.target.value) })}
                    placeholder="0 为永久有效"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 适用模型与吞吐保障 */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">适用模型 (逗号隔开，* 代表全通)</label>
                  <input
                    type="text"
                    value={form.modelScope}
                    onChange={(e) => setForm({ ...form, modelScope: e.target.value })}
                    placeholder="deepseek-r1, deepseek-v3"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">并发保障 (QPS)</label>
                  <input
                    type="number"
                    value={form.qpsLimit}
                    onChange={(e) => setForm({ ...form, qpsLimit: e.target.value })}
                    placeholder="如 50"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Token 吞吐限额 (TPM)</label>
                  <input
                    type="number"
                    value={form.tpmLimit}
                    onChange={(e) => setForm({ ...form, tpmLimit: e.target.value })}
                    placeholder="如 400000"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 自定义扩展规格 (Key-Value Specs) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">自定义扩展规格矩阵 (Specs)</span>
                  <button
                    type="button"
                    onClick={() => setSpecList([...specList, { key: "", value: "" }])}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + 新增规格项
                  </button>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {specList.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => {
                          const next = [...specList]
                          next[idx].key = e.target.value
                          setSpecList(next)
                        }}
                        placeholder="参数键 (如 contextWindow)"
                        className="w-1/3 px-2.5 py-1 border border-slate-300 rounded text-xs font-mono"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => {
                          const next = [...specList]
                          next[idx].value = e.target.value
                          setSpecList(next)
                        }}
                        placeholder="规格值 (如 128K 超长上下文)"
                        className="flex-1 px-2.5 py-1 border border-slate-300 rounded text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setSpecList(specList.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 px-1 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 特性卖点清单 */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">营销卖点与特性勾选清单 (Features)</span>
                  <button
                    type="button"
                    onClick={() => setFeatureList([...featureList, ""])}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + 新增卖点
                  </button>
                </div>
                <div className="space-y-1.5 max-h-28 overflow-y-auto">
                  {featureList.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={f}
                        onChange={(e) => {
                          const next = [...featureList]
                          next[idx] = e.target.value
                          setFeatureList(next)
                        }}
                        placeholder="如：首字时延 < 200ms、开具数电专票"
                        className="flex-1 px-2.5 py-1 border border-slate-300 rounded text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setFeatureList(featureList.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 px-1 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">备注说明</label>
                <textarea
                  value={form.remark}
                  onChange={(e) => setForm({ ...form, remark: e.target.value })}
                  rows={2}
                  placeholder="面向客群、使用限制或交付说明..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-xs"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
