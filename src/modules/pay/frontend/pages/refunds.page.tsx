"use client"

import { useState, useEffect, useCallback } from "react"

type PayRefund = { id: string; orderId: string; merchantOrderId: string; reason: string; amount: number; status: string; channelCode: string; channelRefundNo: string | null; successTime: string | null; createdAt: string }
type PageData = { items: PayRefund[]; total: number; page: number; pageSize: number }

const API = "/api/v1/admin/pay/refunds"

const statusMap: Record<string, { label: string; color: string }> = {
  WAITING: { label: "退款中", color: "bg-yellow-50 text-yellow-700" },
  SUCCESS: { label: "已退款", color: "bg-green-50 text-green-700" },
  FAIL: { label: "退款失败", color: "bg-red-50 text-red-700" },
}

function formatAmount(amount: number): string {
  return `¥${(amount / 100).toFixed(2)}`
}

export default function PayRefundsPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams({ page: String(page), pageSize: "20" })
      if (keyword) sp.set("keyword", keyword)
      const res = await fetch(`${API}?${sp}`).then((r) => r.json())
      if (res.success) setData(res.data)
    } finally { setLoading(false) }
  }, [page, keyword])

  useEffect(() => { loadData() }, [loadData])

  const totalPages = Math.ceil(data.total / data.pageSize)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-semibold text-slate-900">退款订单</h1>
        <p className="mt-0.5 text-sm text-slate-500">查看退款记录与状态</p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center gap-3">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadData()} placeholder="订单号 / 退款原因" className="h-9 w-56 rounded-md border px-3 text-sm" />
          <button onClick={() => { setPage(1); loadData() }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
          <button onClick={() => { setKeyword(""); setPage(1) }} className="h-9 rounded-md border px-4 text-sm">重置</button>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
            <th className="px-4 py-3">商户订单号</th><th className="px-4 py-3">退款原因</th><th className="px-4 py-3">退款金额</th><th className="px-4 py-3">渠道</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">退款时间</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr>
            : data.items.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">暂无数据</td></tr>
            : data.items.map((refund) => (
              <tr key={refund.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3"><code className="text-xs">{refund.merchantOrderId}</code></td>
                <td className="px-4 py-3">{refund.reason}</td>
                <td className="px-4 py-3 font-medium text-red-600">{formatAmount(refund.amount)}</td>
                <td className="px-4 py-3"><span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{refund.channelCode}</span></td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusMap[refund.status]?.color ?? ""}`}>{statusMap[refund.status]?.label ?? refund.status}</span></td>
                <td className="px-4 py-3 text-xs text-slate-500">{refund.successTime ? new Date(refund.successTime).toLocaleString("zh-CN") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && <div className="flex items-center justify-between border-t px-4 py-3"><span className="text-xs text-slate-500">第 {page}/{totalPages} 页</span><div className="flex gap-1"><button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">上一页</button><button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">下一页</button></div></div>}
      </div>
    </div>
  )
}
