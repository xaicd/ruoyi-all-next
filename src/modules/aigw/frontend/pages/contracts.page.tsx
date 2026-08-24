"use client"

import { useEffect, useState } from "react"
import { AigwSettlementApi } from "../api/contracts.api"

interface ContractItem {
  id: string
  contractNo: string
  carrierName: string
  grantedTokens: number
  amount: number
  status: "ACTIVE" | "EXPIRED"
  createdAt?: string
}

export default function AigwContractsPage() {
  const [items, setItems] = useState<ContractItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(true)

  const fetchList = async (p = page) => {
    setLoading(true)
    try {
      const res = await AigwSettlementApi.page({ page: p, pageSize })
      if (res.success && res.data) {
        setItems(res.data.items || [])
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载合同账单失败:", err)
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
          <h1 className="text-xl font-bold tracking-tight text-slate-900">招投标对公框架合同账务</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            管理 To B / To G 运营商招投标采购框架协议合同标段与划拨资金对公台账
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
          框架协议状态：<span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">履约执行中</span>
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          共 <span className="font-semibold text-slate-900">{total}</span> 份招投标框架合同
        </div>
      </div>

      {/* 合同表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
              <tr>
                <th className="px-5 py-3">框架合同编号</th>
                <th className="px-5 py-3">招投标合作运营商</th>
                <th className="px-5 py-3">框架授信总算力 Token</th>
                <th className="px-5 py-3">合同标段金额</th>
                <th className="px-5 py-3">履约状态</th>
                <th className="px-5 py-3 text-right">签订时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    正在加载合同账单...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    暂无合同账单记录
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                    <td className="px-5 py-3 font-mono">
                      <code className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-semibold">
                        {item.contractNo}
                      </code>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{item.carrierName}</td>
                    <td className="px-5 py-3 font-mono font-semibold text-slate-900">
                      {item.grantedTokens?.toLocaleString()} Token
                    </td>
                    <td className="px-5 py-3 font-mono font-semibold text-emerald-600">
                      ¥ {item.amount?.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        履约生效中
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-slate-400 text-[11px]">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
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
