"use client"

import React, { useState, useEffect } from "react"
import { MesWmTransactionApi } from "../api/mes-wm-transaction.api"
import type { MesWmTransactionCreateDTO, MesWmTransactionVO } from "@/modules/mes/backend/types/mes-wm-transaction.types"

interface MesWmTransactionFormProps {
  open: boolean
  initialData?: MesWmTransactionVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmTransactionForm({ open, initialData, onClose, onSuccess }: MesWmTransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    type: initialData?.type ?? undefined,
    biz_type: initialData?.biz_type ?? undefined,
    biz_id: initialData?.biz_id ?? undefined,
    biz_code: initialData?.biz_code ?? "",
    biz_line_id: initialData?.biz_line_id ?? undefined,
    material_stock_id: initialData?.material_stock_id ?? undefined,
    related_transaction_id: initialData?.related_transaction_id ?? undefined,
    item_id: initialData?.item_id ?? undefined,
    quantity: initialData?.quantity ?? undefined,
    batch_id: initialData?.batch_id ?? undefined,
    batch_code: initialData?.batch_code ?? "",
    warehouse_id: initialData?.warehouse_id ?? undefined,
    location_id: initialData?.location_id ?? undefined,
    area_id: initialData?.area_id ?? undefined,
    transaction_time: initialData?.transaction_time ?? "",
    erp_time: initialData?.erp_time ?? "",
    receipt_time: initialData?.receipt_time ?? "",
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
        await MesWmTransactionApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmTransactionApi.create(formData as MesWmTransactionCreateDTO)
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
            {isEdit ? "编辑MesWmTransaction（源框架导入）" : "新增MesWmTransaction（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">事务类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入事务类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">业务类型</label>
          <input
            type="number"
            value={formData.biz_type != null ? String(formData.biz_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入业务类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源业务主单 ID</label>
          <input
            type="number"
            value={formData.biz_id != null ? String(formData.biz_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源业务主单 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源业务单号</label>
          <input
            type="text"
            value={formData.biz_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源业务单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源业务行 ID</label>
          <input
            type="number"
            value={formData.biz_line_id != null ? String(formData.biz_line_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_line_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源业务行 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">库存记录 ID</label>
          <input
            type="number"
            value={formData.material_stock_id != null ? String(formData.material_stock_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, material_stock_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入库存记录 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">关联的事务 ID</label>
          <input
            type="number"
            value={formData.related_transaction_id != null ? String(formData.related_transaction_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, related_transaction_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入关联的事务 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">物料 ID</label>
          <input
            type="number"
            value={formData.item_id != null ? String(formData.item_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, item_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物料 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">本次变动数量</label>
          <input
            type="number"
            value={formData.quantity != null ? String(formData.quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入本次变动数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">批次 ID</label>
          <input
            type="number"
            value={formData.batch_id != null ? String(formData.batch_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, batch_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入批次 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">批次号</label>
          <input
            type="text"
            value={formData.batch_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, batch_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入批次号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">仓库 ID</label>
          <input
            type="number"
            value={formData.warehouse_id != null ? String(formData.warehouse_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, warehouse_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入仓库 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">库区 ID</label>
          <input
            type="number"
            value={formData.location_id != null ? String(formData.location_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, location_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入库区 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">库位 ID</label>
          <input
            type="number"
            value={formData.area_id != null ? String(formData.area_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, area_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入库位 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">事务发生时间</label>
          <input
            type="text"
            value={formData.transaction_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, transaction_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入事务发生时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">ERP 账期</label>
          <input
            type="text"
            value={formData.erp_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, erp_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入ERP 账期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">入库时间</label>
          <input
            type="text"
            value={formData.receipt_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receipt_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入入库时间"
            
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
