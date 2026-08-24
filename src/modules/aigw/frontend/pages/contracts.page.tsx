"use client"

import { useEffect, useState } from "react"
import { AigwSettlementApi } from "../api/contracts.api"

interface ContractItem {
  id: string
  contractNo: string
  carrierName: string
  grantedTokens?: number
  amount?: number
  status: "ACTIVE" | "EXPIRED" | string
  createdAt?: string
}

export default function AigwContractsPage() {
  const [items, setItems] = useState<ContractItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ContractItem | null>(null)
  const [form, setForm] = useState({
    contractNo: "CM-2026-GD-0088",
    carrierName: "中国移动通信集团有限公司广东省分公司",
    grantedTokens: 50000000,
    amount: 500000,
    status: "ACTIVE",
  })

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

  const handleOpenModal = (item?: ContractItem) => {
    if (item) {
      setEditingItem(item)
      setForm({
        contractNo: item.contractNo,
        carrierName: item.carrierName,
        grantedTokens: item.grantedTokens || 50000000,
        amount: item.amount || 500000,
        status: item.status,
      })
    } else {
      setEditingItem(null)
      setForm({
        contractNo: `CT-2026-${Math.floor(Math.random() * 8999 + 1000)}`,
        carrierName: "中国电信股份有限公司广东省政企分公司",
        grantedTokens: 50000000,
        amount: 500000,
        status: "ACTIVE",
      })
    }
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await AigwSettlementApi.update(editingItem.id, form)
      } else {
        await AigwSettlementApi.create(form)
      }
      setModalOpen(false)
      fetchList(page)
    } catch (err) {
      alert("保存失败")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除该框架合同记录吗？")) return
    try {
      await AigwSettlementApi.delete(id)
      fetchList(page)
    } catch (err) {
      alert("删除失败")
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* 头部区域 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">招投标对公框架合同账务</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            管理 To B / To G 中国移动招投标采购框架协议合同标段与划拨资金对公台账
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
            onClick={() => fetchList(page)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition shadow-xs"
          >
            刷新
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-1"
          >
            <span className="text-sm leading-none">+</span> 录入框架合同标段
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

      {/* 视图展现 */}
      {viewMode === "table" ? (
        /* 合同表格 */
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
                  <th className="px-5 py-3 text-right">操作</th>
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
                      <td className="px-5 py-3 text-right whitespace-nowrap min-w-[190px]">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition px-2 py-1 hover:bg-blue-50 rounded"
                          >
                            [编辑标段]
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-[11px] font-medium text-rose-600 hover:text-rose-800 transition px-2 py-1 hover:bg-rose-50 rounded"
                          >
                            [删除]
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
                    <h3 className="text-xs font-bold text-slate-900">{item.carrierName}</h3>
                    <span className="text-[10px] text-indigo-600 font-mono font-semibold">
                      合同号: {item.contractNo}
                    </span>
                  </div>
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                    履约生效中
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">框架授信 Token</span>
                    <strong className="text-slate-800 font-mono">
                      {((item.grantedTokens || 0) / 10000).toFixed(0)}w
                    </strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">合同标段金额</span>
                    <strong className="text-emerald-700 font-mono">
                      ¥ {item.amount?.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5 text-xs">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 font-medium rounded transition"
                >
                  编辑标段
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-medium rounded transition"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? "编辑框架合同" : "录入招投标框架合同"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">合同编号</label>
                <input
                  type="text"
                  required
                  value={form.contractNo}
                  onChange={(e) => setForm({ ...form, contractNo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">招投标合作运营商</label>
                <input
                  type="text"
                  required
                  value={form.carrierName}
                  onChange={(e) => setForm({ ...form, carrierName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">框架授信 Token</label>
                  <input
                    type="number"
                    required
                    value={form.grantedTokens}
                    onChange={(e) => setForm({ ...form, grantedTokens: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">合同标段金额 (元)</label>
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
