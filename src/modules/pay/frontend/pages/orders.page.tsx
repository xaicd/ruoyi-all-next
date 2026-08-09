"use client"

import { useState, useEffect, useCallback } from "react"

type PayOrder = { id: string; merchantOrderId: string; subject: string; amount: number; status: string; channelCode: string; channelOrderNo: string | null; successTime: string | null; createdAt: string }
type PageData = { items: PayOrder[]; total: number; page: number; pageSize: number }

const API = "/api/v1/admin/pay/orders"

const statusMap: Record<string, { label: string; color: string }> = {
  WAITING: { label: "待支付", color: "bg-yellow-50 text-yellow-700" },
  SUCCESS: { label: "已支付", color: "bg-green-50 text-green-700" },
  CLOSED: { label: "已关闭", color: "bg-slate-100 text-slate-600" },
  REFUND: { label: "已退款", color: "bg-purple-50 text-purple-700" },
}

function formatAmount(amount: number): string {
  return `¥${(amount / 100).toFixed(2)}`
}

export default function PayOrdersPage() {
  const [data, setData] = useState<PageData>({ items: [], total: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams({ page: String(page), pageSize: "20" })
      if (keyword) sp.set("keyword", keyword)
      if (statusFilter) sp.set("status", statusFilter)
      const res = await fetch(`${API}?${sp}`).then((r) => r.json())
      if (res.success) setData(res.data)
    } finally { setLoading(false) }
  }, [page, keyword, statusFilter])

  useEffect(() => { loadData() }, [loadData])

  const totalPages = Math.ceil(data.total / data.pageSize)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h1 className="text-lg font-semibold text-slate-900">支付订单</h1>
        <p className="mt-0.5 text-sm text-slate-500">查看与管理支付订单记录</p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadData()} placeholder="订单号 / 商品名" className="h-9 w-56 rounded-md border px-3 text-sm" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-md border px-3 text-sm">
            <option value="">全部状态</option>
            <option value="WAITING">待支付</option>
            <option value="SUCCESS">已支付</option>
            <option value="CLOSED">已关闭</option>
            <option value="REFUND">已退款</option>
          </select>
          <button onClick={() => { setPage(1); loadData() }} className="h-9 rounded-md bg-slate-900 px-4 text-sm text-white">查询</button>
          <button onClick={() => { setKeyword(""); setStatusFilter(""); setPage(1) }} className="h-9 rounded-md border px-4 text-sm">重置</button>
          <span className="ml-auto text-xs text-slate-400">共 {data.total} 条</span>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left text-xs font-medium text-slate-500">
            <th className="px-4 py-3">商户订单号</th><th className="px-4 py-3">商品</th><th className="px-4 py-3">金额</th><th className="px-4 py-3">渠道</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">支付时间</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">加载中...</td></tr>
            : data.items.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">暂无数据</td></tr>
            : data.items.map((order) => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3"><code className="text-xs">{order.merchantOrderId}</code></td>
                <td className="px-4 py-3 font-medium">{order.subject}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{formatAmount(order.amount)}</td>
                <td className="px-4 py-3"><span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{order.channelCode}</span></td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusMap[order.status]?.color ?? ""}`}>{statusMap[order.status]?.label ?? order.status}</span></td>
                <td className="px-4 py-3 text-xs text-slate-500">{order.successTime ? new Date(order.successTime).toLocaleString("zh-CN") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && <div className="flex items-center justify-between border-t px-4 py-3"><span className="text-xs text-slate-500">第 {page}/{totalPages} 页</span><div className="flex gap-1"><button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">上一页</button><button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="h-8 rounded border px-3 text-xs disabled:opacity-50">下一页</button></div></div>}
      </div>
    </div>
  )
}
