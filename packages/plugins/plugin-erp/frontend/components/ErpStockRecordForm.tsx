"use client"

import React, { useState, useEffect } from "react"
import { ErpStockRecordApi } from "../api/erp-stock-record.api"
import type { ErpStockRecordCreateDTO, ErpStockRecordVO } from "@/modules/erp/backend/types/erp-stock-record.types"

interface ErpStockRecordFormProps {
  open: boolean
  initialData?: ErpStockRecordVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ErpStockRecordForm({ open, initialData, onClose, onSuccess }: ErpStockRecordFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    product_id: initialData?.product_id ?? undefined,
    warehouse_id: initialData?.warehouse_id ?? undefined,
    count: initialData?.count ?? undefined,
    total_count: initialData?.total_count ?? undefined,
    biz_type: initialData?.biz_type ?? undefined,
    biz_id: initialData?.biz_id ?? undefined,
    biz_item_id: initialData?.biz_item_id ?? undefined,
    biz_no: initialData?.biz_no ?? "",
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
        await ErpStockRecordApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ErpStockRecordApi.create(formData as ErpStockRecordCreateDTO)
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
            {isEdit ? "编辑ErpStockRecord（源框架导入）" : "新增ErpStockRecord（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">产品编号</label>
          <input
            type="number"
            value={formData.product_id != null ? String(formData.product_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">仓库编号</label>
          <input
            type="number"
            value={formData.warehouse_id != null ? String(formData.warehouse_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, warehouse_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入仓库编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">出入库数量</label>
          <input
            type="number"
            value={formData.count != null ? String(formData.count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入出入库数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">总库存量</label>
          <input
            type="number"
            value={formData.total_count != null ? String(formData.total_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入总库存量"
            
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
          <label className="block text-xs text-slate-600 mb-1">业务编号</label>
          <input
            type="number"
            value={formData.biz_id != null ? String(formData.biz_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入业务编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">业务项编号</label>
          <input
            type="number"
            value={formData.biz_item_id != null ? String(formData.biz_item_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_item_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入业务项编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">业务单号</label>
          <input
            type="text"
            value={formData.biz_no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入业务单号"
            
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
