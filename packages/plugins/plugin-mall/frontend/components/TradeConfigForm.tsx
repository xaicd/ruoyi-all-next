"use client"

import React, { useState, useEffect } from "react"
import { TradeConfigApi } from "../api/trade-config.api"
import type { TradeConfigCreateDTO, TradeConfigVO } from "@/modules/mall/backend/types/trade-config.types"

interface TradeConfigFormProps {
  open: boolean
  initialData?: TradeConfigVO | null
  onClose: () => void
  onSuccess: () => void
}

export function TradeConfigForm({ open, initialData, onClose, onSuccess }: TradeConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    after_sale_refund_reasons: initialData?.after_sale_refund_reasons ?? "",
    after_sale_return_reasons: initialData?.after_sale_return_reasons ?? "",
    delivery_express_free_enabled: initialData?.delivery_express_free_enabled ?? false,
    delivery_express_free_price: initialData?.delivery_express_free_price ?? undefined,
    delivery_pick_up_enabled: initialData?.delivery_pick_up_enabled ?? false,
    brokerage_enabled: initialData?.brokerage_enabled ?? false,
    brokerage_enabled_condition: initialData?.brokerage_enabled_condition ?? undefined,
    brokerage_bind_mode: initialData?.brokerage_bind_mode ?? undefined,
    brokerage_poster_urls: initialData?.brokerage_poster_urls ?? "",
    brokerage_first_percent: initialData?.brokerage_first_percent ?? undefined,
    brokerage_second_percent: initialData?.brokerage_second_percent ?? undefined,
    brokerage_withdraw_min_price: initialData?.brokerage_withdraw_min_price ?? undefined,
    brokerage_withdraw_fee_percent: initialData?.brokerage_withdraw_fee_percent ?? undefined,
    brokerage_frozen_days: initialData?.brokerage_frozen_days ?? undefined,
    brokerage_withdraw_types: initialData?.brokerage_withdraw_types ?? "",
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
        await TradeConfigApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await TradeConfigApi.create(formData as TradeConfigCreateDTO)
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
            {isEdit ? "编辑TradeConfig（源框架导入）" : "新增TradeConfig（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">售后的退款理由</label>
          <input
            type="text"
            value={formData.after_sale_refund_reasons ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, after_sale_refund_reasons: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入售后的退款理由"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">售后的退货理由</label>
          <input
            type="text"
            value={formData.after_sale_return_reasons ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, after_sale_return_reasons: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入售后的退货理由"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="delivery_express_free_enabled"
            checked={Boolean(formData.delivery_express_free_enabled)}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_express_free_enabled: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="delivery_express_free_enabled" className="text-xs text-slate-700 font-medium">是否启用全场包邮</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">全场包邮的最小金额，单位：分</label>
          <input
            type="number"
            value={formData.delivery_express_free_price != null ? String(formData.delivery_express_free_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_express_free_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入全场包邮的最小金额，单位：分"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="delivery_pick_up_enabled"
            checked={Boolean(formData.delivery_pick_up_enabled)}
            onChange={(e) => setFormData((prev) => ({ ...prev, delivery_pick_up_enabled: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="delivery_pick_up_enabled" className="text-xs text-slate-700 font-medium">是否开启自提</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="brokerage_enabled"
            checked={Boolean(formData.brokerage_enabled)}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_enabled: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="brokerage_enabled" className="text-xs text-slate-700 font-medium">是否启用分佣</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">分佣模式</label>
          <input
            type="number"
            value={formData.brokerage_enabled_condition != null ? String(formData.brokerage_enabled_condition) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_enabled_condition: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分佣模式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">分销关系绑定模式</label>
          <input
            type="number"
            value={formData.brokerage_bind_mode != null ? String(formData.brokerage_bind_mode) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_bind_mode: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分销关系绑定模式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">分销海报图地址数组</label>
          <input
            type="text"
            value={formData.brokerage_poster_urls ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_poster_urls: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分销海报图地址数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">一级返佣比例</label>
          <input
            type="number"
            value={formData.brokerage_first_percent != null ? String(formData.brokerage_first_percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_first_percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入一级返佣比例"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">二级返佣比例</label>
          <input
            type="number"
            value={formData.brokerage_second_percent != null ? String(formData.brokerage_second_percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_second_percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入二级返佣比例"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户提现最低金额</label>
          <input
            type="number"
            value={formData.brokerage_withdraw_min_price != null ? String(formData.brokerage_withdraw_min_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_withdraw_min_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户提现最低金额"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户提现手续费百分比</label>
          <input
            type="number"
            value={formData.brokerage_withdraw_fee_percent != null ? String(formData.brokerage_withdraw_fee_percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_withdraw_fee_percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户提现手续费百分比"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">佣金冻结时间(天)</label>
          <input
            type="number"
            value={formData.brokerage_frozen_days != null ? String(formData.brokerage_frozen_days) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_frozen_days: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入佣金冻结时间(天)"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">提现方式</label>
          <input
            type="text"
            value={formData.brokerage_withdraw_types ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_withdraw_types: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入提现方式"
            
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
