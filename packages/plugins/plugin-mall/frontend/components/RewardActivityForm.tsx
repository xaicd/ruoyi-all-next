"use client"

import React, { useState, useEffect } from "react"
import { RewardActivityApi } from "../api/reward-activity.api"
import type { RewardActivityCreateDTO, RewardActivityVO } from "@/modules/mall/backend/types/reward-activity.types"

interface RewardActivityFormProps {
  open: boolean
  initialData?: RewardActivityVO | null
  onClose: () => void
  onSuccess: () => void
}

export function RewardActivityForm({ open, initialData, onClose, onSuccess }: RewardActivityFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    status: initialData?.status ?? undefined,
    start_time: initialData?.start_time ?? "",
    end_time: initialData?.end_time ?? "",
    remark: initialData?.remark ?? "",
    condition_type: initialData?.condition_type ?? undefined,
    product_scope: initialData?.product_scope ?? undefined,
    product_scope_values: initialData?.product_scope_values ?? "",
    rules: initialData?.rules ?? "",
    limit: initialData?.limit ?? undefined,
    discount_price: initialData?.discount_price ?? undefined,
    free_delivery: initialData?.free_delivery ?? false,
    point: initialData?.point ?? undefined,
    give_coupon_template_counts: initialData?.give_coupon_template_counts ?? "",
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
        await RewardActivityApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await RewardActivityApi.create(formData as RewardActivityCreateDTO)
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
            {isEdit ? "编辑RewardActivity（源框架导入）" : "新增RewardActivity（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">活动标题</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入活动标题"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开始时间</label>
          <input
            type="text"
            value={formData.start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开始时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">结束时间</label>
          <input
            type="text"
            value={formData.end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入备注"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">条件类型</label>
          <input
            type="number"
            value={formData.condition_type != null ? String(formData.condition_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, condition_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入条件类型"
            
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
          <label className="block text-xs text-slate-600 mb-1">商品 SPU 编号的数组</label>
          <input
            type="text"
            value={formData.product_scope_values ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_scope_values: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品 SPU 编号的数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠规则的数组</label>
          <input
            type="text"
            value={formData.rules ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, rules: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠规则的数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠门槛</label>
          <input
            type="number"
            value={formData.limit != null ? String(formData.limit) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, limit: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠门槛"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">优惠价格，单位：分</label>
          <input
            type="number"
            value={formData.discount_price != null ? String(formData.discount_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠价格，单位：分"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="free_delivery"
            checked={Boolean(formData.free_delivery)}
            onChange={(e) => setFormData((prev) => ({ ...prev, free_delivery: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="free_delivery" className="text-xs text-slate-700 font-medium">是否包邮</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">赠送的积分</label>
          <input
            type="number"
            value={formData.point != null ? String(formData.point) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, point: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入赠送的积分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">赠送的优惠劵</label>
          <input
            type="text"
            value={formData.give_coupon_template_counts ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, give_coupon_template_counts: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入赠送的优惠劵"
            
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
