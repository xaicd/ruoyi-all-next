"use client"

import React, { useState, useEffect } from "react"
import { DeliveryExpressTemplateChargeApi } from "../api/delivery-express-template-charge.api"
import type { DeliveryExpressTemplateChargeCreateDTO, DeliveryExpressTemplateChargeVO } from "@/modules/mall/backend/types/delivery-express-template-charge.types"

interface DeliveryExpressTemplateChargeFormProps {
  open: boolean
  initialData?: DeliveryExpressTemplateChargeVO | null
  onClose: () => void
  onSuccess: () => void
}

export function DeliveryExpressTemplateChargeForm({ open, initialData, onClose, onSuccess }: DeliveryExpressTemplateChargeFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    template_id: initialData?.template_id ?? undefined,
    area_ids: initialData?.area_ids ?? "",
    charge_mode: initialData?.charge_mode ?? undefined,
    start_count: initialData?.start_count ?? undefined,
    start_price: initialData?.start_price ?? undefined,
    extra_count: initialData?.extra_count ?? undefined,
    extra_price: initialData?.extra_price ?? undefined,
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
        await DeliveryExpressTemplateChargeApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await DeliveryExpressTemplateChargeApi.create(formData as DeliveryExpressTemplateChargeCreateDTO)
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
            {isEdit ? "编辑DeliveryExpressTemplateCharge（源框架导入）" : "新增DeliveryExpressTemplateCharge（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">配送计费方式</label>
          <input
            type="number"
            value={formData.charge_mode != null ? String(formData.charge_mode) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, charge_mode: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入配送计费方式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">首件数量(件数,重量，或体积)</label>
          <input
            type="number"
            value={formData.start_count != null ? String(formData.start_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入首件数量(件数,重量，或体积)"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">起步价，单位：分</label>
          <input
            type="number"
            value={formData.start_price != null ? String(formData.start_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入起步价，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">续件数量(件, 重量，或体积)</label>
          <input
            type="number"
            value={formData.extra_count != null ? String(formData.extra_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, extra_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入续件数量(件, 重量，或体积)"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">额外价，单位：分</label>
          <input
            type="number"
            value={formData.extra_price != null ? String(formData.extra_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, extra_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入额外价，单位：分"
            
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
