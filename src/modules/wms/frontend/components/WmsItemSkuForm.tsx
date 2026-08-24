"use client"

import React, { useState, useEffect } from "react"
import { WmsItemSkuApi } from "../api/wms-item-sku.api"
import type { WmsItemSkuCreateDTO, WmsItemSkuVO } from "@/modules/wms/backend/types/wms-item-sku.types"

interface WmsItemSkuFormProps {
  open: boolean
  initialData?: WmsItemSkuVO | null
  onClose: () => void
  onSuccess: () => void
}

export function WmsItemSkuForm({ open, initialData, onClose, onSuccess }: WmsItemSkuFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    item_id: initialData?.item_id ?? "",
    sku_code: initialData?.sku_code ?? "",
    sku_name: initialData?.sku_name ?? "",
    barcode: initialData?.barcode ?? "",
    price: initialData?.price ?? undefined,
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
        await WmsItemSkuApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await WmsItemSkuApi.create(formData as WmsItemSkuCreateDTO)
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
            {isEdit ? "编辑物料SKU" : "新增物料SKU"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">物料ID *</label>
          <input
            type="text"
            value={formData.item_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, item_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物料ID"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">SKU编码 *</label>
          <input
            type="text"
            value={formData.sku_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sku_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入SKU编码"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">规格名称 *</label>
          <input
            type="text"
            value={formData.sku_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sku_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规格名称"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">条形码</label>
          <input
            type="text"
            value={formData.barcode ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, barcode: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入条形码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">参考单价</label>
          <input
            type="number"
            value={formData.price != null ? String(formData.price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入参考单价"
            
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
