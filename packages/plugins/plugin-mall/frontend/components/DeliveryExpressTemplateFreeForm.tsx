"use client"

import React, { useState, useEffect } from "react"
import { DeliveryExpressTemplateFreeApi } from "../api/delivery-express-template-free.api"
import type { DeliveryExpressTemplateFreeCreateDTO, DeliveryExpressTemplateFreeVO } from "@/modules/mall/backend/types/delivery-express-template-free.types"

interface DeliveryExpressTemplateFreeFormProps {
  open: boolean
  initialData?: DeliveryExpressTemplateFreeVO | null
  onClose: () => void
  onSuccess: () => void
}

export function DeliveryExpressTemplateFreeForm({ open, initialData, onClose, onSuccess }: DeliveryExpressTemplateFreeFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    template_id: initialData?.template_id ?? undefined,
    area_ids: initialData?.area_ids ?? "",
    free_price: initialData?.free_price ?? undefined,
    free_count: initialData?.free_count ?? undefined,
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
        await DeliveryExpressTemplateFreeApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await DeliveryExpressTemplateFreeApi.create(formData as DeliveryExpressTemplateFreeCreateDTO)
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
            {isEdit ? "编辑DeliveryExpressTemplateFree（源框架导入）" : "新增DeliveryExpressTemplateFree（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">配送模板编号</label>
          <input
            type="number"
            value={formData.template_id != null ? String(formData.template_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, template_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入配送模板编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">配送区域编号列表</label>
          <input
            type="text"
            value={formData.area_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, area_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入配送区域编号列表"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">包邮金额，单位：分</label>
          <input
            type="number"
            value={formData.free_price != null ? String(formData.free_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, free_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入包邮金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">包邮件数</label>
          <input
            type="number"
            value={formData.free_count != null ? String(formData.free_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, free_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入包邮件数"
            
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
