"use client"

import React, { useState, useEffect } from "react"
import { PayOrderApi } from "../api/pay-order.api"
import type { PayOrderCreateDTO, PayOrderVO } from "@/modules/pay/backend/types/pay-order.types"

interface PayOrderFormProps {
  open: boolean
  initialData?: PayOrderVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PayOrderForm({ open, initialData, onClose, onSuccess }: PayOrderFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    app_id: initialData?.app_id ?? undefined,
    channel_id: initialData?.channel_id ?? undefined,
    channel_code: initialData?.channel_code ?? "",
    user_id: initialData?.user_id ?? undefined,
    user_type: initialData?.user_type ?? undefined,
    merchant_order_id: initialData?.merchant_order_id ?? "",
    subject: initialData?.subject ?? "",
    body: initialData?.body ?? "",
    notify_url: initialData?.notify_url ?? "",
    price: initialData?.price ?? undefined,
    channel_fee_rate: initialData?.channel_fee_rate ?? undefined,
    channel_fee_price: initialData?.channel_fee_price ?? undefined,
    status: initialData?.status ?? undefined,
    user_ip: initialData?.user_ip ?? "",
    expire_time: initialData?.expire_time ?? "",
    success_time: initialData?.success_time ?? "",
    extension_id: initialData?.extension_id ?? undefined,
    no: initialData?.no ?? "",
    refund_price: initialData?.refund_price ?? undefined,
    channel_user_id: initialData?.channel_user_id ?? "",
    channel_order_no: initialData?.channel_order_no ?? "",
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
        await PayOrderApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PayOrderApi.create(formData as PayOrderCreateDTO)
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
            {isEdit ? "编辑PayOrder（源框架导入）" : "新增PayOrder（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">商品标题</label>
          <input
            type="text"
            value={formData.subject ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品标题"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">商品描述信息</label>
          <input
            type="text"
            value={formData.body ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入商品描述信息"
            
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
          <label className="block text-xs text-slate-600 mb-1">支付金额，单位：分</label>
          <input
            type="number"
            value={formData.price != null ? String(formData.price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渠道手续费，单位：百分比</label>
          <input
            type="number"
            value={formData.channel_fee_rate != null ? String(formData.channel_fee_rate) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_fee_rate: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渠道手续费，单位：百分比"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渠道手续金额，单位：分</label>
          <input
            type="number"
            value={formData.channel_fee_price != null ? String(formData.channel_fee_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_fee_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渠道手续金额，单位：分"
            
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
          <label className="block text-xs text-slate-600 mb-1">订单失效时间</label>
          <input
            type="text"
            value={formData.expire_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, expire_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单失效时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">订单支付成功时间</label>
          <input
            type="text"
            value={formData.success_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, success_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入订单支付成功时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付成功的订单拓展单编号</label>
          <input
            type="number"
            value={formData.extension_id != null ? String(formData.extension_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, extension_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付成功的订单拓展单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">支付成功的外部订单号</label>
          <input
            type="text"
            value={formData.no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付成功的外部订单号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退款总金额，单位：分</label>
          <input
            type="number"
            value={formData.refund_price != null ? String(formData.refund_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款总金额，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渠道用户编号</label>
          <input
            type="text"
            value={formData.channel_user_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_user_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渠道用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渠道订单号</label>
          <input
            type="text"
            value={formData.channel_order_no ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_order_no: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渠道订单号"
            
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
