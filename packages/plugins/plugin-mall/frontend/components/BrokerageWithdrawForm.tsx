"use client"

import React, { useState, useEffect } from "react"
import { BrokerageWithdrawApi } from "../api/brokerage-withdraw.api"
import type { BrokerageWithdrawCreateDTO, BrokerageWithdrawVO } from "@/modules/mall/backend/types/brokerage-withdraw.types"

interface BrokerageWithdrawFormProps {
  open: boolean
  initialData?: BrokerageWithdrawVO | null
  onClose: () => void
  onSuccess: () => void
}

export function BrokerageWithdrawForm({ open, initialData, onClose, onSuccess }: BrokerageWithdrawFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    user_id: initialData?.user_id ?? undefined,
    price: initialData?.price ?? undefined,
    fee_price: initialData?.fee_price ?? undefined,
    total_price: initialData?.total_price ?? undefined,
    type: initialData?.type ?? undefined,
    user_name: initialData?.user_name ?? "",
    user_account: initialData?.user_account ?? "",
    qr_code_url: initialData?.qr_code_url ?? "",
    bank_name: initialData?.bank_name ?? "",
    bank_address: initialData?.bank_address ?? "",
    status: initialData?.status ?? undefined,
    audit_reason: initialData?.audit_reason ?? "",
    audit_time: initialData?.audit_time ?? "",
    remark: initialData?.remark ?? "",
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
        await BrokerageWithdrawApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await BrokerageWithdrawApi.create(formData as BrokerageWithdrawCreateDTO)
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
            {isEdit ? "编辑BrokerageWithdraw（源框架导入）" : "新增BrokerageWithdraw（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
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
          <label className="block text-xs text-slate-600 mb-1">提现手续费，单位：分</label>
          <input
            type="number"
            value={formData.fee_price != null ? String(formData.fee_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, fee_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入提现手续费，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">当前总佣金，单位：分</label>
          <input
            type="number"
            value={formData.total_price != null ? String(formData.total_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入当前总佣金，单位：分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">提现类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入提现类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">提现姓名</label>
          <input
            type="text"
            value={formData.user_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入提现姓名"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">提现账号</label>
          <input
            type="text"
            value={formData.user_account ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_account: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入提现账号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">收款码</label>
          <input
            type="text"
            value={formData.qr_code_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, qr_code_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入收款码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">银行名称</label>
          <input
            type="text"
            value={formData.bank_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bank_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入银行名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开户地址</label>
          <input
            type="text"
            value={formData.bank_address ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bank_address: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开户地址"
            
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
          <label className="block text-xs text-slate-600 mb-1">审核驳回原因</label>
          <input
            type="text"
            value={formData.audit_reason ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, audit_reason: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入审核驳回原因"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">审核时间</label>
          <input
            type="text"
            value={formData.audit_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, audit_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入审核时间"
            
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
