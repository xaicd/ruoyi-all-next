"use client"

import React, { useState, useEffect } from "react"
import { PayWalletRechargeApi } from "../api/pay-wallet-recharge.api"
import type { PayWalletRechargeCreateDTO, PayWalletRechargeVO } from "@/modules/pay/backend/types/pay-wallet-recharge.types"

interface PayWalletRechargeFormProps {
  open: boolean
  initialData?: PayWalletRechargeVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PayWalletRechargeForm({ open, initialData, onClose, onSuccess }: PayWalletRechargeFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    wallet_id: initialData?.wallet_id ?? undefined,
    total_price: initialData?.total_price ?? undefined,
    pay_price: initialData?.pay_price ?? undefined,
    bonus_price: initialData?.bonus_price ?? undefined,
    package_id: initialData?.package_id ?? undefined,
    pay_status: initialData?.pay_status ?? false,
    pay_order_id: initialData?.pay_order_id ?? undefined,
    pay_channel_code: initialData?.pay_channel_code ?? "",
    pay_time: initialData?.pay_time ?? "",
    pay_refund_id: initialData?.pay_refund_id ?? undefined,
    refund_total_price: initialData?.refund_total_price ?? undefined,
    refund_pay_price: initialData?.refund_pay_price ?? undefined,
    refund_bonus_price: initialData?.refund_bonus_price ?? undefined,
    refund_time: initialData?.refund_time ?? "",
    refund_status: initialData?.refund_status ?? undefined,
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
        await PayWalletRechargeApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PayWalletRechargeApi.create(formData as PayWalletRechargeCreateDTO)
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
            {isEdit ? "编辑PayWalletRecharge（源框架导入）" : "新增PayWalletRecharge（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">钱包编号</label>
          <input
            type="number"
            value={formData.wallet_id != null ? String(formData.wallet_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, wallet_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入钱包编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户实际到账余额</label>
          <input
            type="number"
            value={formData.total_price != null ? String(formData.total_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户实际到账余额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">实际支付金额</label>
          <input
            type="number"
            value={formData.pay_price != null ? String(formData.pay_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入实际支付金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">钱包赠送金额</label>
          <input
            type="number"
            value={formData.bonus_price != null ? String(formData.bonus_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bonus_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入钱包赠送金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">充值套餐编号</label>
          <input
            type="number"
            value={formData.package_id != null ? String(formData.package_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, package_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入充值套餐编号"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="pay_status"
            checked={Boolean(formData.pay_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="pay_status" className="text-xs text-slate-700 font-medium">是否已支付</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付订单编号</label>
          <input
            type="number"
            value={formData.pay_order_id != null ? String(formData.pay_order_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_order_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付订单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付成功的支付渠道</label>
          <input
            type="text"
            value={formData.pay_channel_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_channel_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付成功的支付渠道"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单支付时间</label>
          <input
            type="text"
            value={formData.pay_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单支付时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付退款单编号</label>
          <input
            type="number"
            value={formData.pay_refund_id != null ? String(formData.pay_refund_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_refund_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付退款单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款金额，包含赠送金额</label>
          <input
            type="number"
            value={formData.refund_total_price != null ? String(formData.refund_total_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_total_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款金额，包含赠送金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款支付金额</label>
          <input
            type="number"
            value={formData.refund_pay_price != null ? String(formData.refund_pay_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_pay_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款支付金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款钱包赠送金额</label>
          <input
            type="number"
            value={formData.refund_bonus_price != null ? String(formData.refund_bonus_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_bonus_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款钱包赠送金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款时间</label>
          <input
            type="text"
            value={formData.refund_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款状态</label>
          <input
            type="number"
            value={formData.refund_status != null ? String(formData.refund_status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款状态"
            
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
