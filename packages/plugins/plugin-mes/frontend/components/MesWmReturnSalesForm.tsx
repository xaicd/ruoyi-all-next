"use client"

import React, { useState, useEffect } from "react"
import { MesWmReturnSalesApi } from "../api/mes-wm-return-sales.api"
import type { MesWmReturnSalesCreateDTO, MesWmReturnSalesVO } from "@/modules/mes/backend/types/mes-wm-return-sales.types"

interface MesWmReturnSalesFormProps {
  open: boolean
  initialData?: MesWmReturnSalesVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmReturnSalesForm({ open, initialData, onClose, onSuccess }: MesWmReturnSalesFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    sales_order_code: initialData?.sales_order_code ?? "",
    client_id: initialData?.client_id ?? undefined,
    return_date: initialData?.return_date ?? "",
    return_reason: initialData?.return_reason ?? "",
    status: initialData?.status ?? undefined,
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
        await MesWmReturnSalesApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmReturnSalesApi.create(formData as MesWmReturnSalesCreateDTO)
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
            {isEdit ? "编辑MesWmReturnSales（源框架导入）" : "新增MesWmReturnSales（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">退货单编号</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退货单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退货单名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退货单名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">销售订单编号</label>
          <input
            type="text"
            value={formData.sales_order_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sales_order_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入销售订单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户 ID</label>
          <input
            type="number"
            value={formData.client_id != null ? String(formData.client_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, client_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退货日期</label>
          <input
            type="text"
            value={formData.return_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, return_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退货日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退货原因</label>
          <input
            type="text"
            value={formData.return_reason ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, return_reason: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退货原因"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
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
