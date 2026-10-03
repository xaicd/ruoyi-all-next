"use client"

import React, { useState, useEffect } from "react"
import { MesProRouteProductApi } from "../api/mes-pro-route-product.api"
import type { MesProRouteProductCreateDTO, MesProRouteProductVO } from "@/modules/mes/backend/types/mes-pro-route-product.types"

interface MesProRouteProductFormProps {
  open: boolean
  initialData?: MesProRouteProductVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesProRouteProductForm({ open, initialData, onClose, onSuccess }: MesProRouteProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    route_id: initialData?.route_id ?? undefined,
    item_id: initialData?.item_id ?? undefined,
    quantity: initialData?.quantity ?? undefined,
    production_time: initialData?.production_time ?? undefined,
    time_unit_type: initialData?.time_unit_type ?? "",
    remark: initialData?.remark ?? "",
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
        await MesProRouteProductApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesProRouteProductApi.create(formData as MesProRouteProductCreateDTO)
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
            {isEdit ? "编辑MesProRouteProduct（源框架导入）" : "新增MesProRouteProduct（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">工艺路线编号</label>
          <input
            type="number"
            value={formData.route_id != null ? String(formData.route_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, route_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工艺路线编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品物料编号</label>
          <input
            type="number"
            value={formData.item_id != null ? String(formData.item_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, item_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品物料编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生产数量</label>
          <input
            type="number"
            value={formData.quantity != null ? String(formData.quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生产用时</label>
          <input
            type="number"
            value={formData.production_time != null ? String(formData.production_time) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, production_time: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产用时"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">时间单位</label>
          <input
            type="text"
            value={formData.time_unit_type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, time_unit_type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入时间单位"
            
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
