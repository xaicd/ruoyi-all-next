"use client"

import { useEffect, useState } from "react"
import { AigwQuotaApi } from "../api/quotas.api"

interface QuotaItem {
  id: string
  enterpriseId: string
  grantedTokens: number
  remainTokens: number
  status: "ACTIVE" | "DISABLED"
  updatedAt?: string
}

export default function AigwQuotasPage() {
  const [items, setItems] = useState<QuotaItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchList = async (p = page, kw = keyword) => {
    setLoading(true)
    try {
      const res = await AigwQuotaApi.page({ page: p, pageSize, enterpriseId: kw || undefined })
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
      {/* 头部区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">配额管控</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            实时监控各大企业主体开户授信算力 Token 划拨、已知划拨总量与剩余可消费额度
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchList(page, keyword)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            刷新
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="搜索企业编号..."
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
          共 <span className="font-semibold text-slate-900">{total}</span> 个配额账号
        </div>
      </div>

      {/* 配额表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
              <tr>
                <th className="px-5 py-3">所属企业</th>
                <th className="px-5 py-3">已划拨总量 Token</th>
                <th className="px-5 py-3">剩余可用 Token</th>
                <th className="px-5 py-3">消耗比例</th>
                <th className="px-5 py-3">管控状态</th>
                <th className="px-5 py-3 text-right">最后更新时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    正在加载配额数据...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    暂无配额数据
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const usedPct = item.grantedTokens ? Math.min(100, Math.round(((item.grantedTokens - item.remainTokens) / item.grantedTokens) * 100)) : 0
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                      <td className="px-5 py-3">
                        <code className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                          {item.enterpriseId}
                        </code>
                      </td>
                      <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                        {item.grantedTokens?.toLocaleString()} Token
                      </td>
                      <td className="px-5 py-3 font-mono text-emerald-600 font-semibold">
                        {item.remainTokens?.toLocaleString()} Token
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 max-w-[140px]">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${usedPct}%` }} />
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">{usedPct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {item.status === "ACTIVE" ? "额度正常" : "受控预警"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-slate-400 text-[11px]">
                        {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
