"use client"

import { useEffect, useState } from "react"
import { request } from "@/modules/shared/frontend/lib/request"

interface UsageItem {
  id: string
  tokenId?: string
  model?: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost?: number
  ip?: string
  createdAt?: string
}

export default function AigwUsagesPage() {
  const [items, setItems] = useState<UsageItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  const fetchList = async (p = page, kw = keyword) => {
    setLoading(true)
    try {
      const res = await request.get("/api/v1/admin/aigw/usages", {
        params: { page: p, pageSize, keyword: kw || undefined },
      })
      if (res.success && res.data) {
        setItems(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载用量日志失败:", err)
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

  return (
    <div className="p-6 space-y-5">
      {/* 头部 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">用量日志与审计</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            实时审计 API 请求流水、Token 消耗分布、模型响应时间与计费账单
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
            onClick={() => fetchList(page, keyword)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            刷新数据
          </button>
        </div>
      </div>

      {/* 搜索 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索模型 / IP / Token ID..."
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
          共记录 <span className="font-semibold text-slate-900">{total}</span> 条请求日志
        </div>
      </div>

      {/* 视图展现 */}
      {viewMode === "table" ? (
        /* 表格 - 严格单行不换行、文本截断 */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
                <tr>
                  <th className="px-5 py-3">流水 ID</th>
                  <th className="px-5 py-3">调用模型</th>
                  <th className="px-5 py-3">Prompt</th>
                  <th className="px-5 py-3">Completion</th>
                  <th className="px-5 py-3">总 Token 消耗</th>
                  <th className="px-5 py-3">客户端 IP</th>
                  <th className="px-5 py-3 text-right">请求时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      正在加载用量日志...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      暂无用量流水数据
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-500">
                        <span className="max-w-[120px] truncate inline-block align-middle" title={item.id}>
                          {item.id}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 font-mono">
                          {item.model || "deepseek-chat"}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-600">
                        {item.promptTokens || 0}
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-600">
                        {item.completionTokens || 0}
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-slate-900 font-mono text-[11px]">
                          {item.totalTokens || 0}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-500">
                        {item.ip || "127.0.0.1"}
                      </td>
                      <td className="px-5 py-3 text-right text-[11px] text-slate-400 font-mono">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : "刚刚"}
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
                    <h3 className="text-xs font-bold text-slate-900 font-mono">{item.model || "deepseek-chat"}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {item.id.slice(0, 16)}...</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : "刚刚"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] py-1 bg-slate-50 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Prompt</span>
                    <strong className="font-mono text-slate-700">{item.promptTokens || 0}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Completion</span>
                    <strong className="font-mono text-slate-700">{item.completionTokens || 0}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total</span>
                    <strong className="font-mono text-blue-700">{item.totalTokens || 0}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>IP: {item.ip || "127.0.0.1"}</span>
                <span>Token: {item.tokenId?.slice(0, 8) || "Direct"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
