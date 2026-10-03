"use client"

import React, { useState, useEffect } from "react"
import { MesProWorkOrderApi } from "../api/mes-pro-work-order.api"
import type { MesProWorkOrderCreateDTO, MesProWorkOrderVO } from "@/modules/mes/backend/types/mes-pro-work-order.types"

interface MesProWorkOrderFormProps {
  open: boolean
  initialData?: MesProWorkOrderVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesProWorkOrderForm({ open, initialData, onClose, onSuccess }: MesProWorkOrderFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    type: initialData?.type ?? undefined,
    order_source_type: initialData?.order_source_type ?? undefined,
    order_source_code: initialData?.order_source_code ?? "",
    product_id: initialData?.product_id ?? undefined,
    quantity: initialData?.quantity ?? undefined,
    quantity_produced: initialData?.quantity_produced ?? undefined,
    quantity_changed: initialData?.quantity_changed ?? undefined,
    quantity_scheduled: initialData?.quantity_scheduled ?? undefined,
    client_id: initialData?.client_id ?? undefined,
    vendor_id: initialData?.vendor_id ?? undefined,
    batch_code: initialData?.batch_code ?? "",
    request_date: initialData?.request_date ?? "",
    parent_id: initialData?.parent_id ?? undefined,
    finish_date: initialData?.finish_date ?? "",
    cancel_date: initialData?.cancel_date ?? "",
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
        await MesProWorkOrderApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesProWorkOrderApi.create(formData as MesProWorkOrderCreateDTO)
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
            {isEdit ? "编辑MesProWorkOrder（源框架导入）" : "新增MesProWorkOrder（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">工单编码</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工单编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工单名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工单名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工单类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工单类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源类型</label>
          <input
            type="number"
            value={formData.order_source_type != null ? String(formData.order_source_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_source_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源单据编号</label>
          <input
            type="text"
            value={formData.order_source_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_source_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源单据编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">已生产数量</label>
          <input
            type="number"
            value={formData.quantity_produced != null ? String(formData.quantity_produced) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity_produced: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入已生产数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">调整数量</label>
          <input
            type="number"
            value={formData.quantity_changed != null ? String(formData.quantity_changed) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity_changed: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入调整数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">已排产数量</label>
          <input
            type="number"
            value={formData.quantity_scheduled != null ? String(formData.quantity_scheduled) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity_scheduled: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入已排产数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户编号</label>
          <input
            type="number"
            value={formData.client_id != null ? String(formData.client_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, client_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商编号</label>
          <input
            type="number"
            value={formData.vendor_id != null ? String(formData.vendor_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, vendor_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">需求日期</label>
          <input
            type="text"
            value={formData.request_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, request_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入需求日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">父工单编号</label>
          <input
            type="number"
            value={formData.parent_id != null ? String(formData.parent_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入父工单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">完成时间</label>
          <input
            type="text"
            value={formData.finish_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, finish_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入完成时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">取消时间</label>
          <input
            type="text"
            value={formData.cancel_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, cancel_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入取消时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工单状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工单状态"
            
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
