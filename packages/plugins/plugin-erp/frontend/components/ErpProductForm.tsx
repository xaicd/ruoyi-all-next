"use client"

import React, { useState, useEffect } from "react"
import { ErpProductApi } from "../api/erp-product.api"
import type { ErpProductCreateDTO, ErpProductVO } from "@/modules/erp/backend/types/erp-product.types"

interface ErpProductFormProps {
  open: boolean
  initialData?: ErpProductVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ErpProductForm({ open, initialData, onClose, onSuccess }: ErpProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    bar_code: initialData?.bar_code ?? "",
    category_id: initialData?.category_id ?? undefined,
    unit_id: initialData?.unit_id ?? undefined,
    status: initialData?.status ?? undefined,
    standard: initialData?.standard ?? "",
    remark: initialData?.remark ?? "",
    expiry_day: initialData?.expiry_day ?? undefined,
    weight: initialData?.weight ?? undefined,
    purchase_price: initialData?.purchase_price ?? undefined,
    sale_price: initialData?.sale_price ?? undefined,
    min_price: initialData?.min_price ?? undefined,
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
        await ErpProductApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ErpProductApi.create(formData as ErpProductCreateDTO)
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
            {isEdit ? "编辑ErpProduct（源框架导入）" : "新增ErpProduct（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">产品名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品条码</label>
          <input
            type="text"
            value={formData.bar_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bar_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品条码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品分类编号</label>
          <input
            type="number"
            value={formData.category_id != null ? String(formData.category_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品分类编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">单位编号</label>
          <input
            type="number"
            value={formData.unit_id != null ? String(formData.unit_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入单位编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品规格</label>
          <input
            type="text"
            value={formData.standard ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, standard: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品规格"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品备注</label>
          <input
            type="text"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品备注"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">保质期天数</label>
          <input
            type="number"
            value={formData.expiry_day != null ? String(formData.expiry_day) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, expiry_day: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入保质期天数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">基础重量（kg）</label>
          <input
            type="number"
            value={formData.weight != null ? String(formData.weight) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入基础重量（kg）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">采购价格，单位：元</label>
          <input
            type="number"
            value={formData.purchase_price != null ? String(formData.purchase_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, purchase_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入采购价格，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">销售价格，单位：元</label>
          <input
            type="number"
            value={formData.sale_price != null ? String(formData.sale_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sale_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入销售价格，单位：元"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最低价格，单位：元</label>
          <input
            type="number"
            value={formData.min_price != null ? String(formData.min_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, min_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最低价格，单位：元"
            
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
