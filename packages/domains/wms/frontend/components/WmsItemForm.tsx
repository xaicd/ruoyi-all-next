"use client"

import React, { useState, useEffect } from "react"
import { WmsItemApi } from "../api/wms-item.api"
import type { WmsItemCreateDTO, WmsItemVO } from "@/modules/wms/backend/types/wms-item.types"

interface WmsItemFormProps {
  open: boolean
  initialData?: WmsItemVO | null
  onClose: () => void
  onSuccess: () => void
}

export function WmsItemForm({ open, initialData, onClose, onSuccess }: WmsItemFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    item_code: initialData?.item_code ?? "",
    item_name: initialData?.item_name ?? "",
    category_id: initialData?.category_id ?? "",
    brand_id: initialData?.brand_id ?? "",
    unit: initialData?.unit ?? "",
    spec: initialData?.spec ?? "",
    status: initialData?.status ?? "",
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
        await WmsItemApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await WmsItemApi.create(formData as WmsItemCreateDTO)
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
            {isEdit ? "编辑物料主数据" : "新增物料主数据"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">物料编码 *</label>
          <input
            type="text"
            value={formData.item_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, item_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物料编码"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">物料名称 *</label>
          <input
            type="text"
            value={formData.item_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, item_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物料名称"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">分类ID</label>
          <input
            type="text"
            value={formData.category_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分类ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">品牌ID</label>
          <input
            type="text"
            value={formData.brand_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brand_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入品牌ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">基本单位</label>
          <input
            type="text"
            value={formData.unit ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入基本单位"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">规格型号</label>
          <input
            type="text"
            value={formData.spec ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, spec: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规格型号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">物料状态 *</label>
          <input
            type="text"
            value={formData.status ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物料状态"
            required
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
