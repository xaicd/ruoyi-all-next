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
    <div data-testid="reward-activity-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑满减送活动" : "新增满减送活动"}
        data-testid="reward-activity-form"
        data-agent-scope="reward-activity:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑满减送活动" : "新增满减送活动"}
          </h3>
          <button onClick={onClose} data-testid="reward-activity-form-close" data-agent-target="reward-activity:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="reward-activity-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="reward-activity-name" className="block text-xs text-slate-600 mb-1">活动标题</label>
          <input
            type="text"
            id="reward-activity-name"
            data-testid="field-name"
            data-agent-target="reward-activity:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="活动标题"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入活动标题"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-status" className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            id="reward-activity-status"
            data-testid="field-status"
            data-agent-target="reward-activity:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-start_time" className="block text-xs text-slate-600 mb-1">开始时间</label>
          <input
            type="text"
            id="reward-activity-start_time"
            data-testid="field-start_time"
            data-agent-target="reward-activity:field:start_time"
            data-agent-state={formData.start_time ? "filled" : "empty"}
            aria-label="开始时间"
            value={formData.start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开始时间"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-end_time" className="block text-xs text-slate-600 mb-1">结束时间</label>
          <input
            type="text"
            id="reward-activity-end_time"
            data-testid="field-end_time"
            data-agent-target="reward-activity:field:end_time"
            data-agent-state={formData.end_time ? "filled" : "empty"}
            aria-label="结束时间"
            value={formData.end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束时间"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-remark" className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            id="reward-activity-remark"
            data-testid="field-remark"
            data-agent-target="reward-activity:field:remark"
            data-agent-state={formData.remark ? "filled" : "empty"}
            aria-label="备注"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入备注"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-condition_type" className="block text-xs text-slate-600 mb-1">条件类型</label>
          <input
            type="number"
            id="reward-activity-condition_type"
            data-testid="field-condition_type"
            data-agent-target="reward-activity:field:condition_type"
            data-agent-state={formData.condition_type == null || formData.condition_type === "" ? "empty" : "filled"}
            aria-label="条件类型"
            value={formData.condition_type != null ? String(formData.condition_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, condition_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入条件类型"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-product_scope" className="block text-xs text-slate-600 mb-1">商品范围</label>
          <input
            type="number"
            id="reward-activity-product_scope"
            data-testid="field-product_scope"
            data-agent-target="reward-activity:field:product_scope"
            data-agent-state={formData.product_scope == null || formData.product_scope === "" ? "empty" : "filled"}
            aria-label="商品范围"
            value={formData.product_scope != null ? String(formData.product_scope) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_scope: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品范围"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-product_scope_values" className="block text-xs text-slate-600 mb-1">商品 SPU 编号的数组</label>
          <input
            type="text"
            id="reward-activity-product_scope_values"
            data-testid="field-product_scope_values"
            data-agent-target="reward-activity:field:product_scope_values"
            data-agent-state={formData.product_scope_values ? "filled" : "empty"}
            aria-label="商品 SPU 编号的数组"
            value={formData.product_scope_values ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_scope_values: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品 SPU 编号的数组"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-rules" className="block text-xs text-slate-600 mb-1">优惠规则的数组</label>
          <input
            type="text"
            id="reward-activity-rules"
            data-testid="field-rules"
            data-agent-target="reward-activity:field:rules"
            data-agent-state={formData.rules ? "filled" : "empty"}
            aria-label="优惠规则的数组"
            value={formData.rules ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, rules: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠规则的数组"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-limit" className="block text-xs text-slate-600 mb-1">优惠门槛</label>
          <input
            type="number"
            id="reward-activity-limit"
            data-testid="field-limit"
            data-agent-target="reward-activity:field:limit"
            data-agent-state={formData.limit == null || formData.limit === "" ? "empty" : "filled"}
            aria-label="优惠门槛"
            value={formData.limit != null ? String(formData.limit) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, limit: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠门槛"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-discount_price" className="block text-xs text-slate-600 mb-1">优惠价格，单位：分</label>
          <input
            type="number"
            id="reward-activity-discount_price"
            data-testid="field-discount_price"
            data-agent-target="reward-activity:field:discount_price"
            data-agent-state={formData.discount_price == null || formData.discount_price === "" ? "empty" : "filled"}
            aria-label="优惠价格，单位：分"
            value={formData.discount_price != null ? String(formData.discount_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠价格，单位：分"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="reward-activity-free_delivery"
            data-testid="field-free_delivery"
            data-agent-target="reward-activity:field:free_delivery"
            data-agent-state={formData.free_delivery ? "on" : "off"}
            aria-label="是否包邮"
            checked={Boolean(formData.free_delivery)}
            onChange={(e) => setFormData((prev) => ({ ...prev, free_delivery: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="reward-activity-free_delivery" className="text-xs text-slate-700 font-medium">是否包邮</label>
        </div>

        <div>
          <label htmlFor="reward-activity-point" className="block text-xs text-slate-600 mb-1">赠送的积分</label>
          <input
            type="number"
            id="reward-activity-point"
            data-testid="field-point"
            data-agent-target="reward-activity:field:point"
            data-agent-state={formData.point == null || formData.point === "" ? "empty" : "filled"}
            aria-label="赠送的积分"
            value={formData.point != null ? String(formData.point) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, point: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入赠送的积分"
            
          />
        </div>

        <div>
          <label htmlFor="reward-activity-give_coupon_template_counts" className="block text-xs text-slate-600 mb-1">赠送的优惠劵</label>
          <input
            type="text"
            id="reward-activity-give_coupon_template_counts"
            data-testid="field-give_coupon_template_counts"
            data-agent-target="reward-activity:field:give_coupon_template_counts"
            data-agent-state={formData.give_coupon_template_counts ? "filled" : "empty"}
            aria-label="赠送的优惠劵"
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
              data-testid="reward-activity-form-cancel"
              data-agent-target="reward-activity:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="reward-activity-form-submit"
              data-agent-target="reward-activity:submit"
              data-agent-state={loading ? "busy" : "idle"}
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
