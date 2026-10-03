"use client"

import React, { useState, useEffect } from "react"
import { PayWalletApi } from "../api/pay-wallet.api"
import type { PayWalletCreateDTO, PayWalletVO } from "@/modules/pay/backend/types/pay-wallet.types"

interface PayWalletFormProps {
  open: boolean
  initialData?: PayWalletVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PayWalletForm({ open, initialData, onClose, onSuccess }: PayWalletFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    user_id: initialData?.user_id ?? undefined,
    user_type: initialData?.user_type ?? undefined,
    balance: initialData?.balance ?? undefined,
    freeze_price: initialData?.freeze_price ?? undefined,
    total_expense: initialData?.total_expense ?? undefined,
    total_recharge: initialData?.total_recharge ?? undefined,
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
        await PayWalletApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PayWalletApi.create(formData as PayWalletCreateDTO)
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
            {isEdit ? "编辑PayWallet（源框架导入）" : "新增PayWallet（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">用户 id</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户 id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户类型, 预留 多商户转帐可能需要用到</label>
          <input
            type="number"
            value={formData.user_type != null ? String(formData.user_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户类型, 预留 多商户转帐可能需要用到"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">余额，单位分</label>
          <input
            type="number"
            value={formData.balance != null ? String(formData.balance) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, balance: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入余额，单位分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">冻结金额，单位分</label>
          <input
            type="number"
            value={formData.freeze_price != null ? String(formData.freeze_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, freeze_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入冻结金额，单位分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">累计支出，单位分</label>
          <input
            type="number"
            value={formData.total_expense != null ? String(formData.total_expense) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_expense: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入累计支出，单位分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">累计充值，单位分</label>
          <input
            type="number"
            value={formData.total_recharge != null ? String(formData.total_recharge) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_recharge: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入累计充值，单位分"
            
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
