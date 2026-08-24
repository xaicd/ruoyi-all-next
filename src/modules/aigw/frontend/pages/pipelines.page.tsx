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
  status: "SETTLED" | "UNSETTLED"
  createdAt?: string
}

export default function AigwPipelinesPage() {
  const [items, setItems] = useState<PipelineItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="p-6 space-y-5">
      {/* 头部区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">运营商二阶段清分流水</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            实时按月度汇总三大运营商 (电信/移动/联通) AI 算力消费比例与三方抽成清分对账单
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchList(page)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            刷新
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

      {/* 流水表格 */}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    正在加载清分流水...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
