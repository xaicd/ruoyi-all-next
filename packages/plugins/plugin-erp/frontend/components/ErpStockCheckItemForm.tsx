"use client"

import React, { useState, useEffect } from "react"
import { ErpStockCheckItemApi } from "../api/erp-stock-check-item.api"
import type { ErpStockCheckItemCreateDTO, ErpStockCheckItemVO } from "@/modules/erp/backend/types/erp-stock-check-item.types"

interface ErpStockCheckItemFormProps {
  open: boolean
  initialData?: ErpStockCheckItemVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ErpStockCheckItemForm({ open, initialData, onClose, onSuccess }: ErpStockCheckItemFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    check_id: initialData?.check_id ?? undefined,
    warehouse_id: initialData?.warehouse_id ?? undefined,
    product_id: initialData?.product_id ?? undefined,
    product_unit_id: initialData?.product_unit_id ?? undefined,
    product_price: initialData?.product_price ?? undefined,
    stock_count: initialData?.stock_count ?? undefined,
    actual_count: initialData?.actual_count ?? undefined,
    count: initialData?.count ?? undefined,
    total_price: initialData?.total_price ?? undefined,
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
        await ErpStockCheckItemApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ErpStockCheckItemApi.create(formData as ErpStockCheckItemCreateDTO)
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
            {isEdit ? "编辑ErpStockCheckItem（源框架导入）" : "新增ErpStockCheckItem（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">盘点编号</label>
          <input
            type="number"
            value={formData.check_id != null ? String(formData.check_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, check_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盘点编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">产品单位编号</label>
          <input
            type="number"
            value={formData.product_unit_id != null ? String(formData.product_unit_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_unit_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品单位编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品单价</label>
          <input
            type="number"
            value={formData.product_price != null ? String(formData.product_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品单价"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">账面数量（当前库存）</label>
          <input
            type="number"
            value={formData.stock_count != null ? String(formData.stock_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, stock_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入账面数量（当前库存）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">实际数量（实际库存）</label>
          <input
            type="number"
            value={formData.actual_count != null ? String(formData.actual_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, actual_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入实际数量（实际库存）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">盈亏数量</label>
          <input
            type="number"
            value={formData.count != null ? String(formData.count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入盈亏数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">合计金额，单位：元</label>
          <input
            type="number"
            value={formData.total_price != null ? String(formData.total_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入合计金额，单位：元"
            
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
