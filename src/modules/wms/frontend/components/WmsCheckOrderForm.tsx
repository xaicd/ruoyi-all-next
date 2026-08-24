"use client"

import React, { useState, useEffect } from "react"
import { WmsCheckOrderApi } from "../api/wms-check-order.api"
import type { WmsCheckOrderCreateDTO, WmsCheckOrderVO } from "@/modules/wms/backend/types/wms-check-order.types"

interface WmsCheckOrderFormProps {
  open: boolean
  initialData?: WmsCheckOrderVO | null
  onClose: () => void
  onSuccess: () => void
}

export function WmsCheckOrderForm({ open, initialData, onClose, onSuccess }: WmsCheckOrderFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    order_no: initialData?.order_no ?? "",
    warehouse_id: initialData?.warehouse_id ?? "",
    check_type: initialData?.check_type ?? "",
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
        await WmsCheckOrderApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await WmsCheckOrderApi.create(formData as WmsCheckOrderCreateDTO)
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
            {isEdit ? "编辑盘点单" : "新增盘点单"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">盘点单号 *</label>
          <input
            type="text"
            value={formData.order_no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盘点单号"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">盘点仓库ID *</label>
          <input
            type="text"
            value={formData.warehouse_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, warehouse_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盘点仓库ID"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">盘点类型 *</label>
          <input
            type="text"
            value={formData.check_type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, check_type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盘点类型"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">单据状态 *</label>
          <input
            type="text"
            value={formData.status ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入单据状态"
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
