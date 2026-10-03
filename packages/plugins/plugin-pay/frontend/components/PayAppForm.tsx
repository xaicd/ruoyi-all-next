"use client"

import React, { useState, useEffect } from "react"
import { PayAppApi } from "../api/pay-app.api"
import type { PayAppCreateDTO, PayAppVO } from "@/modules/pay/backend/types/pay-app.types"

interface PayAppFormProps {
  open: boolean
  initialData?: PayAppVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PayAppForm({ open, initialData, onClose, onSuccess }: PayAppFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    app_key: initialData?.app_key ?? "",
    name: initialData?.name ?? "",
    status: initialData?.status ?? undefined,
    remark: initialData?.remark ?? "",
    order_notify_url: initialData?.order_notify_url ?? "",
    refund_notify_url: initialData?.refund_notify_url ?? "",
    transfer_notify_url: initialData?.transfer_notify_url ?? "",
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
        await PayAppApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PayAppApi.create(formData as PayAppCreateDTO)
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
            {isEdit ? "编辑PayApp（源框架导入）" : "新增PayApp（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">应用标识</label>
          <input
            type="text"
            value={formData.app_key ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, app_key: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入应用标识"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">应用名</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入应用名"
            
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

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付结果的回调地址</label>
          <input
            type="text"
            value={formData.order_notify_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_notify_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付结果的回调地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款结果的回调地址</label>
          <input
            type="text"
            value={formData.refund_notify_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_notify_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款结果的回调地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转账结果的回调地址</label>
          <input
            type="text"
            value={formData.transfer_notify_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, transfer_notify_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账结果的回调地址"
            
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
