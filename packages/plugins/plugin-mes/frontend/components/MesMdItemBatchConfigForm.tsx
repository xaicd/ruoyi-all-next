"use client"

import React, { useState, useEffect } from "react"
import { MesMdItemBatchConfigApi } from "../api/mes-md-item-batch-config.api"
import type { MesMdItemBatchConfigCreateDTO, MesMdItemBatchConfigVO } from "@/modules/mes/backend/types/mes-md-item-batch-config.types"

interface MesMdItemBatchConfigFormProps {
  open: boolean
  initialData?: MesMdItemBatchConfigVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesMdItemBatchConfigForm({ open, initialData, onClose, onSuccess }: MesMdItemBatchConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    item_id: initialData?.item_id ?? undefined,
    produce_date_flag: initialData?.produce_date_flag ?? false,
    expire_date_flag: initialData?.expire_date_flag ?? false,
    receipt_date_flag: initialData?.receipt_date_flag ?? false,
    vendor_flag: initialData?.vendor_flag ?? false,
    client_flag: initialData?.client_flag ?? false,
    sales_order_code_flag: initialData?.sales_order_code_flag ?? false,
    purchase_order_code_flag: initialData?.purchase_order_code_flag ?? false,
    work_order_flag: initialData?.work_order_flag ?? false,
    task_flag: initialData?.task_flag ?? false,
    workstation_flag: initialData?.workstation_flag ?? false,
    tool_flag: initialData?.tool_flag ?? false,
    mold_flag: initialData?.mold_flag ?? false,
    lot_number_flag: initialData?.lot_number_flag ?? false,
    quality_status_flag: initialData?.quality_status_flag ?? false,
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
        await MesMdItemBatchConfigApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesMdItemBatchConfigApi.create(formData as MesMdItemBatchConfigCreateDTO)
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
            {isEdit ? "编辑MesMdItemBatchConfig（源框架导入）" : "新增MesMdItemBatchConfig（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="produce_date_flag"
            checked={Boolean(formData.produce_date_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, produce_date_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="produce_date_flag" className="text-xs text-slate-700 font-medium">批次属性-生产日期</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="expire_date_flag"
            checked={Boolean(formData.expire_date_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, expire_date_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="expire_date_flag" className="text-xs text-slate-700 font-medium">批次属性-有效期</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="receipt_date_flag"
            checked={Boolean(formData.receipt_date_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, receipt_date_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="receipt_date_flag" className="text-xs text-slate-700 font-medium">批次属性-入库日期</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="vendor_flag"
            checked={Boolean(formData.vendor_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, vendor_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="vendor_flag" className="text-xs text-slate-700 font-medium">批次属性-供应商</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="client_flag"
            checked={Boolean(formData.client_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, client_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="client_flag" className="text-xs text-slate-700 font-medium">批次属性-客户</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="sales_order_code_flag"
            checked={Boolean(formData.sales_order_code_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, sales_order_code_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="sales_order_code_flag" className="text-xs text-slate-700 font-medium">批次属性-销售订单编号</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="purchase_order_code_flag"
            checked={Boolean(formData.purchase_order_code_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, purchase_order_code_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="purchase_order_code_flag" className="text-xs text-slate-700 font-medium">批次属性-采购订单编号</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="work_order_flag"
            checked={Boolean(formData.work_order_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, work_order_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="work_order_flag" className="text-xs text-slate-700 font-medium">批次属性-生产工单</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="task_flag"
            checked={Boolean(formData.task_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, task_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="task_flag" className="text-xs text-slate-700 font-medium">批次属性-生产任务</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="workstation_flag"
            checked={Boolean(formData.workstation_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, workstation_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="workstation_flag" className="text-xs text-slate-700 font-medium">批次属性-工作站</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="tool_flag"
            checked={Boolean(formData.tool_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, tool_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="tool_flag" className="text-xs text-slate-700 font-medium">批次属性-工具</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="mold_flag"
            checked={Boolean(formData.mold_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, mold_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="mold_flag" className="text-xs text-slate-700 font-medium">批次属性-模具</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="lot_number_flag"
            checked={Boolean(formData.lot_number_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, lot_number_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="lot_number_flag" className="text-xs text-slate-700 font-medium">批次属性-生产批号</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="quality_status_flag"
            checked={Boolean(formData.quality_status_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, quality_status_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="quality_status_flag" className="text-xs text-slate-700 font-medium">批次属性-质量状态</label>
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
