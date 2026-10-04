"use client"

import React, { useState, useEffect } from "react"
import { CouponTemplateApi } from "../api/coupon-template.api"
import type { CouponTemplateCreateDTO, CouponTemplateVO } from "@/modules/mall/backend/types/coupon-template.types"

interface CouponTemplateFormProps {
  open: boolean
  initialData?: CouponTemplateVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CouponTemplateForm({ open, initialData, onClose, onSuccess }: CouponTemplateFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    status: initialData?.status ?? undefined,
    total_count: initialData?.total_count ?? undefined,
    take_limit_count: initialData?.take_limit_count ?? undefined,
    take_type: initialData?.take_type ?? undefined,
    use_price: initialData?.use_price ?? undefined,
    product_scope: initialData?.product_scope ?? undefined,
    product_scope_values: initialData?.product_scope_values ?? "",
    validity_type: initialData?.validity_type ?? undefined,
    valid_start_time: initialData?.valid_start_time ?? "",
    valid_end_time: initialData?.valid_end_time ?? "",
    fixed_start_term: initialData?.fixed_start_term ?? undefined,
    fixed_end_term: initialData?.fixed_end_term ?? undefined,
    discount_type: initialData?.discount_type ?? undefined,
    discount_percent: initialData?.discount_percent ?? undefined,
    discount_price: initialData?.discount_price ?? undefined,
    discount_limit_price: initialData?.discount_limit_price ?? undefined,
    take_count: initialData?.take_count ?? undefined,
    use_count: initialData?.use_count ?? undefined,
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
        await CouponTemplateApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CouponTemplateApi.create(formData as CouponTemplateCreateDTO)
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
    <div data-testid="coupon-template-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑优惠劵模板 DO当用户领取时，会生成 优惠劵" : "新增优惠劵模板 DO当用户领取时，会生成 优惠劵"}
        data-testid="coupon-template-form"
        data-agent-scope="coupon-template:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑优惠劵模板 DO当用户领取时，会生成 优惠劵" : "新增优惠劵模板 DO当用户领取时，会生成 优惠劵"}
          </h3>
          <button onClick={onClose} data-testid="coupon-template-form-close" data-agent-target="coupon-template:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="coupon-template-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="coupon-template-name" className="block text-xs text-slate-600 mb-1">优惠劵名</label>
          <input
            type="text"
            id="coupon-template-name"
            data-testid="field-name"
            data-agent-target="coupon-template:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="优惠劵名"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠劵名"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-description" className="block text-xs text-slate-600 mb-1">优惠券说明</label>
          <input
            type="text"
            id="coupon-template-description"
            data-testid="field-description"
            data-agent-target="coupon-template:field:description"
            data-agent-state={formData.description ? "filled" : "empty"}
            aria-label="优惠券说明"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠券说明"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-status" className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            id="coupon-template-status"
            data-testid="field-status"
            data-agent-target="coupon-template:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-total_count" className="block text-xs text-slate-600 mb-1">发放数量</label>
          <input
            type="number"
            id="coupon-template-total_count"
            data-testid="field-total_count"
            data-agent-target="coupon-template:field:total_count"
            data-agent-state={formData.total_count == null || formData.total_count === "" ? "empty" : "filled"}
            aria-label="发放数量"
            value={formData.total_count != null ? String(formData.total_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发放数量"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-take_limit_count" className="block text-xs text-slate-600 mb-1">每人限领个数</label>
          <input
            type="number"
            id="coupon-template-take_limit_count"
            data-testid="field-take_limit_count"
            data-agent-target="coupon-template:field:take_limit_count"
            data-agent-state={formData.take_limit_count == null || formData.take_limit_count === "" ? "empty" : "filled"}
            aria-label="每人限领个数"
            value={formData.take_limit_count != null ? String(formData.take_limit_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, take_limit_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入每人限领个数"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-take_type" className="block text-xs text-slate-600 mb-1">领取方式</label>
          <input
            type="number"
            id="coupon-template-take_type"
            data-testid="field-take_type"
            data-agent-target="coupon-template:field:take_type"
            data-agent-state={formData.take_type == null || formData.take_type === "" ? "empty" : "filled"}
            aria-label="领取方式"
            value={formData.take_type != null ? String(formData.take_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, take_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入领取方式"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-use_price" className="block text-xs text-slate-600 mb-1">是否设置满多少金额可用，单位：分</label>
          <input
            type="number"
            id="coupon-template-use_price"
            data-testid="field-use_price"
            data-agent-target="coupon-template:field:use_price"
            data-agent-state={formData.use_price == null || formData.use_price === "" ? "empty" : "filled"}
            aria-label="是否设置满多少金额可用，单位：分"
            value={formData.use_price != null ? String(formData.use_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, use_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入是否设置满多少金额可用，单位：分"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-product_scope" className="block text-xs text-slate-600 mb-1">商品范围</label>
          <input
            type="number"
            id="coupon-template-product_scope"
            data-testid="field-product_scope"
            data-agent-target="coupon-template:field:product_scope"
            data-agent-state={formData.product_scope == null || formData.product_scope === "" ? "empty" : "filled"}
            aria-label="商品范围"
            value={formData.product_scope != null ? String(formData.product_scope) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_scope: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品范围"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-product_scope_values" className="block text-xs text-slate-600 mb-1">商品范围编号的数组</label>
          <input
            type="text"
            id="coupon-template-product_scope_values"
            data-testid="field-product_scope_values"
            data-agent-target="coupon-template:field:product_scope_values"
            data-agent-state={formData.product_scope_values ? "filled" : "empty"}
            aria-label="商品范围编号的数组"
            value={formData.product_scope_values ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_scope_values: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品范围编号的数组"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-validity_type" className="block text-xs text-slate-600 mb-1">生效日期类型</label>
          <input
            type="number"
            id="coupon-template-validity_type"
            data-testid="field-validity_type"
            data-agent-target="coupon-template:field:validity_type"
            data-agent-state={formData.validity_type == null || formData.validity_type === "" ? "empty" : "filled"}
            aria-label="生效日期类型"
            value={formData.validity_type != null ? String(formData.validity_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, validity_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生效日期类型"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-valid_start_time" className="block text-xs text-slate-600 mb-1">固定日期 - 生效开始时间</label>
          <input
            type="text"
            id="coupon-template-valid_start_time"
            data-testid="field-valid_start_time"
            data-agent-target="coupon-template:field:valid_start_time"
            data-agent-state={formData.valid_start_time ? "filled" : "empty"}
            aria-label="固定日期 - 生效开始时间"
            value={formData.valid_start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, valid_start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入固定日期 - 生效开始时间"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-valid_end_time" className="block text-xs text-slate-600 mb-1">固定日期 - 生效结束时间</label>
          <input
            type="text"
            id="coupon-template-valid_end_time"
            data-testid="field-valid_end_time"
            data-agent-target="coupon-template:field:valid_end_time"
            data-agent-state={formData.valid_end_time ? "filled" : "empty"}
            aria-label="固定日期 - 生效结束时间"
            value={formData.valid_end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, valid_end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入固定日期 - 生效结束时间"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-fixed_start_term" className="block text-xs text-slate-600 mb-1">领取日期 - 开始天数</label>
          <input
            type="number"
            id="coupon-template-fixed_start_term"
            data-testid="field-fixed_start_term"
            data-agent-target="coupon-template:field:fixed_start_term"
            data-agent-state={formData.fixed_start_term == null || formData.fixed_start_term === "" ? "empty" : "filled"}
            aria-label="领取日期 - 开始天数"
            value={formData.fixed_start_term != null ? String(formData.fixed_start_term) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, fixed_start_term: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入领取日期 - 开始天数"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-fixed_end_term" className="block text-xs text-slate-600 mb-1">领取日期 - 结束天数</label>
          <input
            type="number"
            id="coupon-template-fixed_end_term"
            data-testid="field-fixed_end_term"
            data-agent-target="coupon-template:field:fixed_end_term"
            data-agent-state={formData.fixed_end_term == null || formData.fixed_end_term === "" ? "empty" : "filled"}
            aria-label="领取日期 - 结束天数"
            value={formData.fixed_end_term != null ? String(formData.fixed_end_term) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, fixed_end_term: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入领取日期 - 结束天数"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-discount_type" className="block text-xs text-slate-600 mb-1">折扣类型</label>
          <input
            type="number"
            id="coupon-template-discount_type"
            data-testid="field-discount_type"
            data-agent-target="coupon-template:field:discount_type"
            data-agent-state={formData.discount_type == null || formData.discount_type === "" ? "empty" : "filled"}
            aria-label="折扣类型"
            value={formData.discount_type != null ? String(formData.discount_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入折扣类型"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-discount_percent" className="block text-xs text-slate-600 mb-1">折扣百分比</label>
          <input
            type="number"
            id="coupon-template-discount_percent"
            data-testid="field-discount_percent"
            data-agent-target="coupon-template:field:discount_percent"
            data-agent-state={formData.discount_percent == null || formData.discount_percent === "" ? "empty" : "filled"}
            aria-label="折扣百分比"
            value={formData.discount_percent != null ? String(formData.discount_percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入折扣百分比"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-discount_price" className="block text-xs text-slate-600 mb-1">优惠金额，单位：分</label>
          <input
            type="number"
            id="coupon-template-discount_price"
            data-testid="field-discount_price"
            data-agent-target="coupon-template:field:discount_price"
            data-agent-state={formData.discount_price == null || formData.discount_price === "" ? "empty" : "filled"}
            aria-label="优惠金额，单位：分"
            value={formData.discount_price != null ? String(formData.discount_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入优惠金额，单位：分"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-discount_limit_price" className="block text-xs text-slate-600 mb-1">折扣上限，仅在 等于 时生效</label>
          <input
            type="number"
            id="coupon-template-discount_limit_price"
            data-testid="field-discount_limit_price"
            data-agent-target="coupon-template:field:discount_limit_price"
            data-agent-state={formData.discount_limit_price == null || formData.discount_limit_price === "" ? "empty" : "filled"}
            aria-label="折扣上限，仅在 等于 时生效"
            value={formData.discount_limit_price != null ? String(formData.discount_limit_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_limit_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入折扣上限，仅在 等于 时生效"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-take_count" className="block text-xs text-slate-600 mb-1">领取优惠券的数量</label>
          <input
            type="number"
            id="coupon-template-take_count"
            data-testid="field-take_count"
            data-agent-target="coupon-template:field:take_count"
            data-agent-state={formData.take_count == null || formData.take_count === "" ? "empty" : "filled"}
            aria-label="领取优惠券的数量"
            value={formData.take_count != null ? String(formData.take_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, take_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入领取优惠券的数量"
            
          />
        </div>

        <div>
          <label htmlFor="coupon-template-use_count" className="block text-xs text-slate-600 mb-1">使用优惠券的次数</label>
          <input
            type="number"
            id="coupon-template-use_count"
            data-testid="field-use_count"
            data-agent-target="coupon-template:field:use_count"
            data-agent-state={formData.use_count == null || formData.use_count === "" ? "empty" : "filled"}
            aria-label="使用优惠券的次数"
            value={formData.use_count != null ? String(formData.use_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, use_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入使用优惠券的次数"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="coupon-template-form-cancel"
              data-agent-target="coupon-template:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="coupon-template-form-submit"
              data-agent-target="coupon-template:submit"
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
