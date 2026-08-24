"use client"

import { useEffect, useState } from "react"

interface InvoiceItem {
  id: string
  invoiceNo: string
  title: string
  taxNo: string
  amount: number
  type: "增值税专用发票" | "增值税普通发票"
  status: "ISSUED" | "PENDING"
  createdAt: string
}

export default function AigwInvoicesPage() {
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "inv-1", invoiceNo: "INV-202608-001", title: "中国电信股份有限公司广东省政企分公司", taxNo: "91440000123456789X", amount: 150000, type: "增值税专用发票", status: "ISSUED", createdAt: "2026-08-20" },
    { id: "inv-2", invoiceNo: "INV-202608-002", title: "中国移动通信集团浙江有限公司云中心", taxNo: "91330000987654321Y", amount: 80000, type: "增值税专用发票", status: "ISSUED", createdAt: "2026-08-21" },
  ])
  const [loading, setLoading] = useState(false)

  const fetchList = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 200)
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className="p-6 space-y-5">
      {/* 头部区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">对公结算发票与合规审计</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            开具与管理运营商及政企大客户 AI 算力对公结算增值税专用发票与税务开票记录
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchList}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            刷新
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="text-xs text-slate-600 font-medium">
          开票资质核验：<span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">全量三证合一已核验</span>
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          共 <span className="font-semibold text-slate-900">{items.length}</span> 张对公结算发票
        </div>
      </div>

      {/* 发票表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] uppercase text-slate-500 border-b border-slate-200 font-semibold tracking-wider whitespace-nowrap">
              <tr>
                <th className="px-5 py-3">发票代码/号码</th>
                <th className="px-5 py-3">开票抬头</th>
                <th className="px-5 py-3">纳税人识别号</th>
                <th className="px-5 py-3">开票金额</th>
                <th className="px-5 py-3">发票类型</th>
                <th className="px-5 py-3">开票状态</th>
                <th className="px-5 py-3 text-right">开票时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    正在加载发票列表...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    暂无对公发票记录
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition whitespace-nowrap">
                    <td className="px-5 py-3 font-mono">
                      <code className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                        {item.invoiceNo}
                      </code>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-900">{item.title}</td>
                    <td className="px-5 py-3 font-mono text-slate-500">{item.taxNo}</td>
                    <td className="px-5 py-3 font-mono font-semibold text-emerald-600">
                      ¥ {item.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-medium border border-indigo-100">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        已开具发票
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-slate-400 text-[11px]">
                      {item.createdAt}
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
