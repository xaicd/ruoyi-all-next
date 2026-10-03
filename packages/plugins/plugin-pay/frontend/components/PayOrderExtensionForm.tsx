"use client"

import React, { useState, useEffect } from "react"
import { PayOrderExtensionApi } from "../api/pay-order-extension.api"
import type { PayOrderExtensionCreateDTO, PayOrderExtensionVO } from "@/modules/pay/backend/types/pay-order-extension.types"

interface PayOrderExtensionFormProps {
  open: boolean
  initialData?: PayOrderExtensionVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PayOrderExtensionForm({ open, initialData, onClose, onSuccess }: PayOrderExtensionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    no: initialData?.no ?? "",
    order_id: initialData?.order_id ?? undefined,
    channel_id: initialData?.channel_id ?? undefined,
    channel_code: initialData?.channel_code ?? "",
    user_ip: initialData?.user_ip ?? "",
    status: initialData?.status ?? undefined,
    channel_extras: initialData?.channel_extras ?? "",
    channel_error_code: initialData?.channel_error_code ?? "",
    channel_error_msg: initialData?.channel_error_msg ?? "",
    channel_notify_data: initialData?.channel_notify_data ?? "",
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
        await PayOrderExtensionApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PayOrderExtensionApi.create(formData as PayOrderExtensionCreateDTO)
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
            {isEdit ? "编辑PayOrderExtension（源框架导入）" : "新增PayOrderExtension（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">外部订单号，根据规则生成</label>
          <input
            type="text"
            value={formData.no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入外部订单号，根据规则生成"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单号</label>
          <input
            type="number"
            value={formData.order_id != null ? String(formData.order_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渠道编号</label>
          <input
            type="number"
            value={formData.channel_id != null ? String(formData.channel_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渠道编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渠道编码</label>
          <input
            type="text"
            value={formData.channel_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渠道编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户 IP</label>
          <input
            type="text"
            value={formData.user_ip ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_ip: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户 IP"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付渠道的额外参数</label>
          <input
            type="text"
            value={formData.channel_extras ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_extras: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付渠道的额外参数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">调用渠道的错误码</label>
          <input
            type="text"
            value={formData.channel_error_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_error_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入调用渠道的错误码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">调用渠道报错时，错误信息</label>
          <input
            type="text"
            value={formData.channel_error_msg ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_error_msg: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入调用渠道报错时，错误信息"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付渠道的同步/异步通知的内容</label>
          <input
            type="text"
            value={formData.channel_notify_data ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_notify_data: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付渠道的同步/异步通知的内容"
            
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
