"use client"

import React, { useState, useEffect } from "react"
import { MesWmTransferLineApi } from "../api/mes-wm-transfer-line.api"
import type { MesWmTransferLineCreateDTO, MesWmTransferLineVO } from "@/modules/mes/backend/types/mes-wm-transfer-line.types"

interface MesWmTransferLineFormProps {
  open: boolean
  initialData?: MesWmTransferLineVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmTransferLineForm({ open, initialData, onClose, onSuccess }: MesWmTransferLineFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    transfer_id: initialData?.transfer_id ?? undefined,
    material_stock_id: initialData?.material_stock_id ?? undefined,
    item_id: initialData?.item_id ?? undefined,
    quantity: initialData?.quantity ?? undefined,
    batch_id: initialData?.batch_id ?? undefined,
    from_warehouse_id: initialData?.from_warehouse_id ?? undefined,
    from_location_id: initialData?.from_location_id ?? undefined,
    from_area_id: initialData?.from_area_id ?? undefined,
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
        await MesWmTransferLineApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmTransferLineApi.create(formData as MesWmTransferLineCreateDTO)
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
            {isEdit ? "编辑MesWmTransferLine（源框架导入）" : "新增MesWmTransferLine（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">转移单编号</label>
          <input
            type="number"
            value={formData.transfer_id != null ? String(formData.transfer_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, transfer_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转移单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">库存记录编号</label>
          <input
            type="number"
            value={formData.material_stock_id != null ? String(formData.material_stock_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, material_stock_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入库存记录编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">物料编号</label>
          <input
            type="number"
            value={formData.item_id != null ? String(formData.item_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, item_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物料编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转移数量</label>
          <input
            type="number"
            value={formData.quantity != null ? String(formData.quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转移数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">批次编号</label>
          <input
            type="number"
            value={formData.batch_id != null ? String(formData.batch_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, batch_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入批次编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">移出仓库编号</label>
          <input
            type="number"
            value={formData.from_warehouse_id != null ? String(formData.from_warehouse_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, from_warehouse_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入移出仓库编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">移出库区编号</label>
          <input
            type="number"
            value={formData.from_location_id != null ? String(formData.from_location_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, from_location_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入移出库区编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">移出库位编号</label>
          <input
            type="number"
            value={formData.from_area_id != null ? String(formData.from_area_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, from_area_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入移出库位编号"
            
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
