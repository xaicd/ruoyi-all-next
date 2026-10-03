"use client"

import React, { useState, useEffect } from "react"
import { PayNotifyLogApi } from "../api/pay-notify-log.api"
import type { PayNotifyLogCreateDTO, PayNotifyLogVO } from "@/modules/pay/backend/types/pay-notify-log.types"

interface PayNotifyLogFormProps {
  open: boolean
  initialData?: PayNotifyLogVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PayNotifyLogForm({ open, initialData, onClose, onSuccess }: PayNotifyLogFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    task_id: initialData?.task_id ?? undefined,
    notify_times: initialData?.notify_times ?? undefined,
    response: initialData?.response ?? "",
    status: initialData?.status ?? undefined,
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
        await PayNotifyLogApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PayNotifyLogApi.create(formData as PayNotifyLogCreateDTO)
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
            {isEdit ? "编辑PayNotifyLog（源框架导入）" : "新增PayNotifyLog（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">通知任务编号</label>
          <input
            type="number"
            value={formData.task_id != null ? String(formData.task_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, task_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入通知任务编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">第几次被通知</label>
          <input
            type="number"
            value={formData.notify_times != null ? String(formData.notify_times) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notify_times: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入第几次被通知"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">HTTP 响应结果</label>
          <input
            type="text"
            value={formData.response ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入HTTP 响应结果"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付通知状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付通知状态"
            
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
