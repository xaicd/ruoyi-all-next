"use client"

import React, { useState, useEffect } from "react"
import { PayNotifyTaskApi } from "../api/pay-notify-task.api"
import type { PayNotifyTaskCreateDTO, PayNotifyTaskVO } from "@/modules/pay/backend/types/pay-notify-task.types"

interface PayNotifyTaskFormProps {
  open: boolean
  initialData?: PayNotifyTaskVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PayNotifyTaskForm({ open, initialData, onClose, onSuccess }: PayNotifyTaskFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    app_id: initialData?.app_id ?? undefined,
    type: initialData?.type ?? undefined,
    data_id: initialData?.data_id ?? undefined,
    merchant_order_id: initialData?.merchant_order_id ?? "",
    merchant_refund_id: initialData?.merchant_refund_id ?? "",
    merchant_transfer_id: initialData?.merchant_transfer_id ?? "",
    status: initialData?.status ?? undefined,
    next_notify_time: initialData?.next_notify_time ?? "",
    last_execute_time: initialData?.last_execute_time ?? "",
    notify_times: initialData?.notify_times ?? undefined,
    max_notify_times: initialData?.max_notify_times ?? undefined,
    notify_url: initialData?.notify_url ?? "",
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
        await PayNotifyTaskApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PayNotifyTaskApi.create(formData as PayNotifyTaskCreateDTO)
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
            {isEdit ? "编辑PayNotifyTask（源框架导入）" : "新增PayNotifyTask（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">应用编号</label>
          <input
            type="number"
            value={formData.app_id != null ? String(formData.app_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, app_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入应用编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">通知类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入通知类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">数据编号，根据不同 type 进行关联：</label>
          <input
            type="number"
            value={formData.data_id != null ? String(formData.data_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, data_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据编号，根据不同 type 进行关联："
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商户订单编号</label>
          <input
            type="text"
            value={formData.merchant_order_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, merchant_order_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商户订单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商户退款编号</label>
          <input
            type="text"
            value={formData.merchant_refund_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, merchant_refund_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商户退款编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商户转账编号</label>
          <input
            type="text"
            value={formData.merchant_transfer_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, merchant_transfer_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商户转账编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">通知状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入通知状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">下一次通知时间</label>
          <input
            type="text"
            value={formData.next_notify_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, next_notify_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入下一次通知时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最后一次执行时间</label>
          <input
            type="text"
            value={formData.last_execute_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, last_execute_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最后一次执行时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">当前通知次数</label>
          <input
            type="number"
            value={formData.notify_times != null ? String(formData.notify_times) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notify_times: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入当前通知次数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最大可通知次数</label>
          <input
            type="number"
            value={formData.max_notify_times != null ? String(formData.max_notify_times) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, max_notify_times: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最大可通知次数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">通知地址</label>
          <input
            type="text"
            value={formData.notify_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notify_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入通知地址"
            
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
