"use client"

import React, { useState, useEffect } from "react"
import { TradeStatisticsApi } from "../api/trade-statistics.api"
import type { TradeStatisticsCreateDTO, TradeStatisticsVO } from "@/modules/mall/backend/types/trade-statistics.types"

interface TradeStatisticsFormProps {
  open: boolean
  initialData?: TradeStatisticsVO | null
  onClose: () => void
  onSuccess: () => void
}

export function TradeStatisticsForm({ open, initialData, onClose, onSuccess }: TradeStatisticsFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    time: initialData?.time ?? "",
    order_create_count: initialData?.order_create_count ?? undefined,
    order_pay_count: initialData?.order_pay_count ?? undefined,
    order_pay_price: initialData?.order_pay_price ?? undefined,
    after_sale_count: initialData?.after_sale_count ?? undefined,
    after_sale_refund_price: initialData?.after_sale_refund_price ?? undefined,
    brokerage_settlement_price: initialData?.brokerage_settlement_price ?? undefined,
    wallet_pay_price: initialData?.wallet_pay_price ?? undefined,
    recharge_pay_count: initialData?.recharge_pay_count ?? undefined,
    recharge_pay_price: initialData?.recharge_pay_price ?? undefined,
    recharge_refund_count: initialData?.recharge_refund_count ?? undefined,
    recharge_refund_price: initialData?.recharge_refund_price ?? undefined,
      })
    }
  }, [open, initialData])

  if (!open) return null

  const isEdit = Boolean(initialData?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isEdit && initialData?.id) {
        await TradeStatisticsApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await TradeStatisticsApi.create(formData as TradeStatisticsCreateDTO)
      }
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err?.message || "操作失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑TradeStatistics（源框架导入）" : "新增TradeStatistics（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">统计日期</label>
          <input
            type="text"
            value={formData.time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入统计日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">创建订单数</label>
          <input
            type="number"
            value={formData.order_create_count != null ? String(formData.order_create_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_create_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入创建订单数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付订单商品数</label>
          <input
            type="number"
            value={formData.order_pay_count != null ? String(formData.order_pay_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_pay_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付订单商品数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">总支付金额，单位：分</label>
          <input
            type="number"
            value={formData.order_pay_price != null ? String(formData.order_pay_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_pay_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入总支付金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款订单数</label>
          <input
            type="number"
            value={formData.after_sale_count != null ? String(formData.after_sale_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, after_sale_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款订单数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">总退款金额，单位：分</label>
          <input
            type="number"
            value={formData.after_sale_refund_price != null ? String(formData.after_sale_refund_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, after_sale_refund_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入总退款金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">佣金金额（已结算），单位：分</label>
          <input
            type="number"
            value={formData.brokerage_settlement_price != null ? String(formData.brokerage_settlement_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_settlement_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入佣金金额（已结算），单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">总支付金额（余额），单位：分</label>
          <input
            type="number"
            value={formData.wallet_pay_price != null ? String(formData.wallet_pay_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, wallet_pay_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入总支付金额（余额），单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">充值订单数</label>
          <input
            type="number"
            value={formData.recharge_pay_count != null ? String(formData.recharge_pay_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, recharge_pay_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入充值订单数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">充值金额，单位：分</label>
          <input
            type="number"
            value={formData.recharge_pay_price != null ? String(formData.recharge_pay_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, recharge_pay_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入充值金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">充值退款订单数</label>
          <input
            type="number"
            value={formData.recharge_refund_count != null ? String(formData.recharge_refund_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, recharge_refund_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入充值退款订单数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">充值退款金额，单位：分</label>
          <input
            type="number"
            value={formData.recharge_refund_price != null ? String(formData.recharge_refund_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, recharge_refund_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入充值退款金额，单位：分"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
