"use client"

import React, { useState, useEffect, useCallback } from "react"
import { PayOrderApi } from "../api/pay-order.api"
import { PayOrderForm } from "../components/PayOrderForm"
import { Pagination } from "@/modules/shared/frontend/components/pagination"
import type { PayOrderVO, PayOrderPageQuery } from "@/modules/pay/backend/types/pay-order.types"

export function PayOrderListPage() {
    const [data, setData] = useState<PayOrderVO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)
  const [searchForm, setSearchForm] = useState<Record<string, any>>({})
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<PayOrderVO | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await PayOrderApi.page({ page, pageSize, ...searchForm })
      setData(res.items || [])
      setTotal(res.total || 0)
    } catch (err) {
      console.error("加载数据失败:", err)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, searchForm])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchData()
  }

  const handleReset = () => {
    setSearchForm({})
    setPage(1)
  }

  const handleAdd = () => {
    setEditItem(null)
    setFormOpen(true)
  }

  const handleEdit = (item: PayOrderVO) => {
    setEditItem(item)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("确定要删除该记录吗？")) return
    try {
      await PayOrderApi.delete(id)
      fetchData()
    } catch (err: any) {
      alert(err?.message || "删除失败")
    }
  }

  // Agent-Native: 根节点暴露就绪信号；弹窗打开时基底打 inert，让无障碍树只留弹窗一层
  const agentState = loading ? "loading" : formOpen ? "modal-open" : total === 0 ? "empty" : "ready"

  return (
    <div
      data-agent-scope="pay-order"
      data-agent-state={agentState}
      data-agent-page-ready={String(!loading)}
      className="p-6 space-y-4"
    >
      {/* 弹窗打开时基底内容 inert —— Agent 不会误点到被遮挡的元素 */}
      <div inert={formOpen ? true : undefined} className="space-y-4">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 data-testid="pay-order-title" className="text-xl font-bold tracking-tight text-slate-900">支付订单管理</h1>
          <p className="text-xs text-slate-500 mt-0.5">支付订单列表与配置管理</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            data-testid="pay-order-refresh"
            data-agent-target="pay-order:refresh"
            className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            刷新
          </button>
          <button
            onClick={handleAdd}
            data-testid="pay-order-create"
            data-agent-target="pay-order:create"
            className="px-3.5 py-1.5 text-xs text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-xs"
          >
            + 新增支付订单
          </button>
        </div>
      </div>

      {/* 搜索工具栏 */}
      <form
        onSubmit={handleSearch}
        data-testid="pay-order-search"
        data-agent-scope="pay-order:search"
        aria-label="支付订单搜索"
        className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">

          <button type="submit" data-testid="pay-order-search-submit" data-agent-target="pay-order:search" className="px-3 py-1 text-xs text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">查询</button>
          <button type="button" onClick={handleReset} data-testid="pay-order-search-reset" data-agent-target="pay-order:reset" className="px-3 py-1 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">重置</button>
        </div>
        <div className="text-xs text-slate-500">共 <span data-testid="pay-order-total" className="font-semibold text-slate-700">{total}</span> 条记录</div>
      </form>

      {/* 数据表格 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table data-testid="pay-order-table" aria-label="支付订单列表" className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">应用编号</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">渠道编号</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">渠道编码</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">用户编号</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">用户类型</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">商户订单编号</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider min-w-[140px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-400">加载中...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-400">暂无数据</td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    data-testid="pay-order-row"
                    data-agent-target="pay-order:row"
                    data-agent-state={editItem?.id === item.id ? "editing" : "idle"}
                    data-agent-id={item.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                  <td className="px-4 py-2.5 text-xs text-slate-700 max-w-[200px] truncate" title={String(item.app_id ?? "-")}>{String(item.app_id ?? "-")}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-700 max-w-[200px] truncate" title={String(item.channel_id ?? "-")}>{String(item.channel_id ?? "-")}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-700 max-w-[200px] truncate" title={String(item.channel_code ?? "-")}>{String(item.channel_code ?? "-")}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-700 max-w-[200px] truncate" title={String(item.user_id ?? "-")}>{String(item.user_id ?? "-")}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-700 max-w-[200px] truncate" title={String(item.user_type ?? "-")}>{String(item.user_type ?? "-")}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-700 max-w-[200px] truncate" title={String(item.merchant_order_id ?? "-")}>{String(item.merchant_order_id ?? "-")}</td>
                    <td className="px-4 py-2.5 text-xs text-right whitespace-nowrap space-x-2">
                      <button onClick={() => handleEdit(item)} data-testid="pay-order-edit" data-agent-target="pay-order:edit" data-agent-id={item.id} aria-label={"编辑 " + item.id} className="text-blue-600 hover:text-blue-800 font-medium">编辑</button>
                      <button onClick={() => handleDelete(item.id)} data-testid="pay-order-delete" data-agent-target="pay-order:delete" data-agent-id={item.id} aria-label={"删除 " + item.id} className="text-rose-600 hover:text-rose-800 font-medium">删除</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页组件 */}
        <div data-agent-target="pay-order:pagination" className="p-3 border-t border-slate-200">
          <Pagination
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(ps) => setPageSize(ps)}
          />
        </div>
      </div>

      </div>

      {/* 弹窗表单 */}
      <PayOrderForm
        open={formOpen}
        initialData={editItem}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  )
}
