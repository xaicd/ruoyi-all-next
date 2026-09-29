"use client"

import React, { useState, useEffect } from "react"
import { WmsInventoryApi } from "../api/wms-inventory.api"
import type { WmsInventoryCreateDTO, WmsInventoryVO } from "@/modules/wms/backend/types/wms-inventory.types"

interface WmsInventoryFormProps {
  open: boolean
  initialData?: WmsInventoryVO | null
  onClose: () => void
  onSuccess: () => void
}

export function WmsInventoryForm({ open, initialData, onClose, onSuccess }: WmsInventoryFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    warehouse_id: initialData?.warehouse_id ?? "",
    item_id: initialData?.item_id ?? "",
    merchant_id: initialData?.merchant_id ?? "",
    qty: initialData?.qty ?? undefined,
    locked_qty: initialData?.locked_qty ?? undefined,
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
        await WmsInventoryApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await WmsInventoryApi.create(formData as WmsInventoryCreateDTO)
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
            {isEdit ? "编辑实时库存" : "新增实时库存"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">仓库ID *</label>
          <input
            type="text"
            value={formData.warehouse_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, warehouse_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入仓库ID"
            required
          />
        </div>

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
          <label className="block text-xs text-slate-600 mb-1">货主ID</label>
          <input
            type="text"
            value={formData.merchant_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, merchant_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入货主ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">现存数量 *</label>
          <input
            type="number"
            value={formData.qty != null ? String(formData.qty) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, qty: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入现存数量"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">锁定数量 *</label>
          <input
            type="number"
            value={formData.locked_qty != null ? String(formData.locked_qty) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, locked_qty: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入锁定数量"
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
