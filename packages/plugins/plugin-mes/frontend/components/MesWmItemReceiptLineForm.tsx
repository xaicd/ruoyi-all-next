"use client"

import React, { useState, useEffect } from "react"
import { MesWmItemReceiptLineApi } from "../api/mes-wm-item-receipt-line.api"
import type { MesWmItemReceiptLineCreateDTO, MesWmItemReceiptLineVO } from "@/modules/mes/backend/types/mes-wm-item-receipt-line.types"

interface MesWmItemReceiptLineFormProps {
  open: boolean
  initialData?: MesWmItemReceiptLineVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmItemReceiptLineForm({ open, initialData, onClose, onSuccess }: MesWmItemReceiptLineFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    receipt_id: initialData?.receipt_id ?? undefined,
    arrival_notice_line_id: initialData?.arrival_notice_line_id ?? undefined,
    item_id: initialData?.item_id ?? undefined,
    received_quantity: initialData?.received_quantity ?? undefined,
    batch_id: initialData?.batch_id ?? undefined,
    batch_code: initialData?.batch_code ?? "",
    production_date: initialData?.production_date ?? "",
    expire_date: initialData?.expire_date ?? "",
    lot_number: initialData?.lot_number ?? "",
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
        await MesWmItemReceiptLineApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmItemReceiptLineApi.create(formData as MesWmItemReceiptLineCreateDTO)
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
            {isEdit ? "编辑MesWmItemReceiptLine（源框架导入）" : "新增MesWmItemReceiptLine（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">入库单编号</label>
          <input
            type="number"
            value={formData.receipt_id != null ? String(formData.receipt_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receipt_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入入库单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">到货通知单行编号</label>
          <input
            type="number"
            value={formData.arrival_notice_line_id != null ? String(formData.arrival_notice_line_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, arrival_notice_line_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入到货通知单行编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">入库数量</label>
          <input
            type="number"
            value={formData.received_quantity != null ? String(formData.received_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, received_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入入库数量"
            
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
          <label className="block text-xs text-slate-600 mb-1">批次编码</label>
          <input
            type="text"
            value={formData.batch_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, batch_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入批次编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生产日期</label>
          <input
            type="text"
            value={formData.production_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, production_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">有效期</label>
          <input
            type="text"
            value={formData.expire_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, expire_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入有效期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生产批号</label>
          <input
            type="text"
            value={formData.lot_number ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, lot_number: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生产批号"
            
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
