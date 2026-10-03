"use client"

import React, { useState, useEffect } from "react"
import { PayTransferApi } from "../api/pay-transfer.api"
import type { PayTransferCreateDTO, PayTransferVO } from "@/modules/pay/backend/types/pay-transfer.types"

interface PayTransferFormProps {
  open: boolean
  initialData?: PayTransferVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PayTransferForm({ open, initialData, onClose, onSuccess }: PayTransferFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    no: initialData?.no ?? "",
    app_id: initialData?.app_id ?? undefined,
    channel_id: initialData?.channel_id ?? undefined,
    channel_code: initialData?.channel_code ?? "",
    user_id: initialData?.user_id ?? undefined,
    user_type: initialData?.user_type ?? undefined,
    merchant_transfer_id: initialData?.merchant_transfer_id ?? "",
    subject: initialData?.subject ?? "",
    price: initialData?.price ?? undefined,
    user_account: initialData?.user_account ?? "",
    user_name: initialData?.user_name ?? "",
    status: initialData?.status ?? undefined,
    success_time: initialData?.success_time ?? "",
    notify_url: initialData?.notify_url ?? "",
    user_ip: initialData?.user_ip ?? "",
    channel_extras: initialData?.channel_extras ?? "",
    channel_transfer_no: initialData?.channel_transfer_no ?? "",
    channel_error_code: initialData?.channel_error_code ?? "",
    channel_error_msg: initialData?.channel_error_msg ?? "",
    channel_notify_data: initialData?.channel_notify_data ?? "",
    channel_package_info: initialData?.channel_package_info ?? "",
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
        await PayTransferApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PayTransferApi.create(formData as PayTransferCreateDTO)
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
            {isEdit ? "编辑PayTransfer（源框架导入）" : "新增PayTransfer（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">转账单号</label>
          <input
            type="text"
            value={formData.no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账单号"
            
          />
        </div>

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
          <label className="block text-xs text-slate-600 mb-1">转账渠道编号</label>
          <input
            type="number"
            value={formData.channel_id != null ? String(formData.channel_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账渠道编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转账渠道编码</label>
          <input
            type="text"
            value={formData.channel_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账渠道编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户类型</label>
          <input
            type="number"
            value={formData.user_type != null ? String(formData.user_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商户转账单编号</label>
          <input
            type="text"
            value={formData.merchant_transfer_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, merchant_transfer_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商户转账单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转账标题</label>
          <input
            type="text"
            value={formData.subject ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账标题"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转账金额，单位：分</label>
          <input
            type="number"
            value={formData.price != null ? String(formData.price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">收款人账号</label>
          <input
            type="text"
            value={formData.user_account ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_account: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收款人账号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">收款人姓名</label>
          <input
            type="text"
            value={formData.user_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收款人姓名"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转账状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单转账成功时间</label>
          <input
            type="text"
            value={formData.success_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, success_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单转账成功时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">异步通知地址</label>
          <input
            type="text"
            value={formData.notify_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notify_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入异步通知地址"
            
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
          <label className="block text-xs text-slate-600 mb-1">渠道的额外参数</label>
          <input
            type="text"
            value={formData.channel_extras ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_extras: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渠道的额外参数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渠道转账单号</label>
          <input
            type="text"
            value={formData.channel_transfer_no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_transfer_no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渠道转账单号"
            
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
          <label className="block text-xs text-slate-600 mb-1">调用渠道的错误提示</label>
          <input
            type="text"
            value={formData.channel_error_msg ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_error_msg: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入调用渠道的错误提示"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渠道的同步/异步通知的内容</label>
          <input
            type="text"
            value={formData.channel_notify_data ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_notify_data: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渠道的同步/异步通知的内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渠道 package 信息</label>
          <input
            type="text"
            value={formData.channel_package_info ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_package_info: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渠道 package 信息"
            
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
