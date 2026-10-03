"use client"

import React, { useState, useEffect } from "react"
import { CrmBusinessProductApi } from "../api/crm-business-product.api"
import type { CrmBusinessProductCreateDTO, CrmBusinessProductVO } from "@/modules/crm/backend/types/crm-business-product.types"

interface CrmBusinessProductFormProps {
  open: boolean
  initialData?: CrmBusinessProductVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmBusinessProductForm({ open, initialData, onClose, onSuccess }: CrmBusinessProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    business_id: initialData?.business_id ?? undefined,
    product_id: initialData?.product_id ?? undefined,
    product_price: initialData?.product_price ?? undefined,
    business_price: initialData?.business_price ?? undefined,
    count: initialData?.count ?? undefined,
    total_price: initialData?.total_price ?? undefined,
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
        await CrmBusinessProductApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmBusinessProductApi.create(formData as CrmBusinessProductCreateDTO)
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
            {isEdit ? "编辑CrmBusinessProduct（源框架导入）" : "新增CrmBusinessProduct（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">商机编号</label>
          <input
            type="number"
            value={formData.business_id != null ? String(formData.business_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, business_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商机编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品编号</label>
          <input
            type="number"
            value={formData.product_id != null ? String(formData.product_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品单价，单位：元</label>
          <input
            type="number"
            value={formData.product_price != null ? String(formData.product_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品单价，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商机价格, 单位：元</label>
          <input
            type="number"
            value={formData.business_price != null ? String(formData.business_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, business_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商机价格, 单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">数量</label>
          <input
            type="number"
            value={formData.count != null ? String(formData.count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">总计价格，单位：元</label>
          <input
            type="number"
            value={formData.total_price != null ? String(formData.total_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入总计价格，单位：元"
            
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
