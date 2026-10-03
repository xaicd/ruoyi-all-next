"use client"

import React, { useState, useEffect } from "react"
import { PayDemoWithdrawApi } from "../api/pay-demo-withdraw.api"
import type { PayDemoWithdrawCreateDTO, PayDemoWithdrawVO } from "@/modules/pay/backend/types/pay-demo-withdraw.types"

interface PayDemoWithdrawFormProps {
  open: boolean
  initialData?: PayDemoWithdrawVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PayDemoWithdrawForm({ open, initialData, onClose, onSuccess }: PayDemoWithdrawFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    subject: initialData?.subject ?? "",
    price: initialData?.price ?? undefined,
    user_account: initialData?.user_account ?? "",
    user_name: initialData?.user_name ?? "",
    type: initialData?.type ?? undefined,
    status: initialData?.status ?? undefined,
    pay_transfer_id: initialData?.pay_transfer_id ?? undefined,
    transfer_channel_code: initialData?.transfer_channel_code ?? "",
    transfer_time: initialData?.transfer_time ?? "",
    transfer_error_msg: initialData?.transfer_error_msg ?? "",
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
        await PayDemoWithdrawApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PayDemoWithdrawApi.create(formData as PayDemoWithdrawCreateDTO)
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
            {isEdit ? "编辑PayDemoWithdraw（源框架导入）" : "新增PayDemoWithdraw（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">提现标题</label>
          <input
            type="text"
            value={formData.subject ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入提现标题"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">提现金额，单位：分</label>
          <input
            type="number"
            value={formData.price != null ? String(formData.price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入提现金额，单位：分"
            
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
          <label className="block text-xs text-slate-600 mb-1">提现方式</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入提现方式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">提现状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入提现状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转账单编号</label>
          <input
            type="number"
            value={formData.pay_transfer_id != null ? String(formData.pay_transfer_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pay_transfer_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转账渠道</label>
          <input
            type="text"
            value={formData.transfer_channel_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, transfer_channel_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账渠道"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转账成功时间</label>
          <input
            type="text"
            value={formData.transfer_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, transfer_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账成功时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">转账错误提示</label>
          <input
            type="text"
            value={formData.transfer_error_msg ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, transfer_error_msg: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账错误提示"
            
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
