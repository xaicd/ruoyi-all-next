"use client"

import { useEffect, useState } from "react"
import { AigwInvoiceApi } from "../api/invoices.api"
import { ViewModeSwitcher, ViewMode } from "@/modules/shared/frontend/components/view-mode-switcher"
import { Pagination } from "@/modules/shared/frontend/components/pagination"

interface InvoiceItem {
  id: string
  invoiceNo: string
  title: string
  taxNo: string
  amount: number
  type: "增值税专用发票" | "增值税普通发票" | string
  status: "ISSUED" | "PENDING" | string
  createdAt: string
}

export default function AigwInvoicesPage() {
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InvoiceItem | null>(null)
  const [form, setForm] = useState({
    invoiceNo: "INV-202608-003",
    title: "中国移动通信集团有限公司广东省分公司",
    taxNo: "91440000123456789X",
    amount: 150000,
    type: "增值税专用发票",
    status: "ISSUED",
  })

  const fetchList = async (p = page, ps = pageSize, kw = keyword) => {
    setLoading(true)
    try {
      const res = await AigwInvoiceApi.page({ page: p, pageSize: ps })
      if (res.success && res.data) {
        let list = res.data.items || []
        if (kw) list = list.filter((i: any) => i.invoiceNo.includes(kw) || i.title.includes(kw))
        setItems(list)
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      console.error("加载发票列表失败:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList(page, pageSize, keyword)
  }, [page, pageSize])

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setPage(1)
    fetchList(1, pageSize, keyword)
  }

  const handleReset = () => {
    setKeyword("")
    setPage(1)
    fetchList(1, pageSize, "")
  }

  const handleOpenModal = (item?: InvoiceItem) => {
    if (item) {
      setEditingItem(item)
      setForm({
        invoiceNo: item.invoiceNo,
        title: item.title,
        taxNo: item.taxNo,
        amount: item.amount,
        type: item.type,
        status: item.status,
      })
    } else {
      setEditingItem(null)
      setForm({
        invoiceNo: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`,
        title: "中国移动通信集团有限公司广东省分公司",
        taxNo: "91440000123456789X",
        amount: 100000,
        type: "增值税专用发票",
        status: "ISSUED",
      })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await AigwInvoiceApi.update(editingItem.id, form)
      } else {
        await AigwInvoiceApi.create(form)
      }
      setModalOpen(false)
      fetchList(page, pageSize, keyword)
    } catch (err: any) {
      alert(err?.message || "操作失败")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要作废并删除该发票凭证吗？")) return
    try {
      await AigwInvoiceApi.delete(id)
      fetchList(page, pageSize, keyword)
    } catch (err: any) {
      alert(err?.message || "删除失败")
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* 头部 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">算力发票与财务开票</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            对公结算发票开具凭据、专票/普票申请记录与财务对账档案
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <ViewModeSwitcher mode={viewMode} onChange={setViewMode} />

          <button
            onClick={() => fetchList(page, pageSize, keyword)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            刷新
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-1"
          >
            <span className="text-sm leading-none">+</span> 开具发票
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="text-xs text-slate-600 font-medium">
          开票资质核验：<span className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">全量三证合一已核验</span>
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          共 <span className="font-semibold text-slate-900">{total}</span> 张对公结算发票
        </div>
      </div>

      {/* 视图展现 */}
      {viewMode === "table" ? (
        /* 发票表格 */
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
                  <th className="px-5 py-3 text-right">操作</th>
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
                        ¥ {item.amount?.toLocaleString()}
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
                      <td className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition px-2 py-1 hover:bg-blue-50 rounded"
                          >
                            [查看发票]
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-[11px] font-medium text-rose-600 hover:text-rose-800 transition px-2 py-1 hover:bg-rose-50 rounded"
                          >
                            [作废]
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
                    <h3 className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{item.title}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">发票号: {item.invoiceNo}</span>
                  </div>
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                    已开具
                  </span>
                </div>

                <div className="p-2 bg-slate-50 rounded-lg space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">纳税识别号:</span>
                    <span className="font-mono">{item.taxNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">发票类型:</span>
                    <span className="text-indigo-600 font-medium">{item.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">开票金额:</span>
                    <strong className="text-emerald-700 font-mono">¥ {item.amount?.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5 text-xs">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 font-medium rounded transition"
                >
                  查看发票
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded transition"
                >
                  作废
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 通用底部分页控件 */}
      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => {
          setPage(p)
          fetchList(p, pageSize, keyword)
        }}
        onPageSizeChange={(ps) => {
          setPageSize(ps)
          setPage(1)
          fetchList(1, ps, keyword)
        }}
      />

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? "编辑对公发票" : "开具对公结算发票"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">发票代码/号码</label>
                <input
                  type="text"
                  required
                  value={form.invoiceNo}
                  onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">开票抬头</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">纳税人识别号</label>
                  <input
                    type="text"
                    required
                    value={form.taxNo}
                    onChange={(e) => setForm({ ...form, taxNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">开票金额 (元)</label>
                  <input
                    type="number"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  保存提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
