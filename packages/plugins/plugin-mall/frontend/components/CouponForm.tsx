"use client"

import React, { useState, useEffect } from "react"
import { CouponApi } from "../api/coupon.api"
import type { CouponCreateDTO, CouponVO } from "@/modules/mall/backend/types/coupon.types"

interface CouponFormProps {
  open: boolean
  initialData?: CouponVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CouponForm({ open, initialData, onClose, onSuccess }: CouponFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    template_id: initialData?.template_id ?? undefined,
    name: initialData?.name ?? "",
    status: initialData?.status ?? undefined,
    user_id: initialData?.user_id ?? undefined,
    take_type: initialData?.take_type ?? undefined,
    use_price: initialData?.use_price ?? undefined,
    valid_start_time: initialData?.valid_start_time ?? "",
    valid_end_time: initialData?.valid_end_time ?? "",
    product_scope: initialData?.product_scope ?? undefined,
    product_scope_values: initialData?.product_scope_values ?? "",
    discount_type: initialData?.discount_type ?? undefined,
    discount_percent: initialData?.discount_percent ?? undefined,
    discount_price: initialData?.discount_price ?? undefined,
    discount_limit_price: initialData?.discount_limit_price ?? undefined,
    use_order_id: initialData?.use_order_id ?? undefined,
    use_time: initialData?.use_time ?? "",
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
        await CouponApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CouponApi.create(formData as CouponCreateDTO)
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
            {isEdit ? "编辑Coupon（源框架导入）" : "新增Coupon（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠劵模板编号</label>
          <input
            type="number"
            value={formData.template_id != null ? String(formData.template_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, template_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠劵模板编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠劵名</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠劵名"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠码状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠码状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">领取类型</label>
          <input
            type="number"
            value={formData.take_type != null ? String(formData.take_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, take_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入领取类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">是否设置满多少金额可用，单位：分</label>
          <input
            type="number"
            value={formData.use_price != null ? String(formData.use_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, use_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入是否设置满多少金额可用，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生效开始时间</label>
          <input
            type="text"
            value={formData.valid_start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, valid_start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生效开始时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生效结束时间</label>
          <input
            type="text"
            value={formData.valid_end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, valid_end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生效结束时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品范围</label>
          <input
            type="number"
            value={formData.product_scope != null ? String(formData.product_scope) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_scope: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品范围"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品范围编号的数组</label>
          <input
            type="text"
            value={formData.product_scope_values ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_scope_values: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品范围编号的数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">折扣类型</label>
          <input
            type="number"
            value={formData.discount_type != null ? String(formData.discount_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入折扣类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">折扣百分比</label>
          <input
            type="number"
            value={formData.discount_percent != null ? String(formData.discount_percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入折扣百分比"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠金额，单位：分</label>
          <input
            type="number"
            value={formData.discount_price != null ? String(formData.discount_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">折扣上限，仅在 等于 时生效</label>
          <input
            type="number"
            value={formData.discount_limit_price != null ? String(formData.discount_limit_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_limit_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入折扣上限，仅在 等于 时生效"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">使用订单号</label>
          <input
            type="number"
            value={formData.use_order_id != null ? String(formData.use_order_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, use_order_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入使用订单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">使用时间</label>
          <input
            type="text"
            value={formData.use_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, use_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入使用时间"
            
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
