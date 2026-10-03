"use client"

import React, { useState, useEffect } from "react"
import { BrokerageUserApi } from "../api/brokerage-user.api"
import type { BrokerageUserCreateDTO, BrokerageUserVO } from "@/modules/mall/backend/types/brokerage-user.types"

interface BrokerageUserFormProps {
  open: boolean
  initialData?: BrokerageUserVO | null
  onClose: () => void
  onSuccess: () => void
}

export function BrokerageUserForm({ open, initialData, onClose, onSuccess }: BrokerageUserFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    bind_user_id: initialData?.bind_user_id ?? undefined,
    bind_user_time: initialData?.bind_user_time ?? "",
    brokerage_enabled: initialData?.brokerage_enabled ?? false,
    brokerage_time: initialData?.brokerage_time ?? "",
    brokerage_price: initialData?.brokerage_price ?? undefined,
    frozen_price: initialData?.frozen_price ?? undefined,
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
        await BrokerageUserApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await BrokerageUserApi.create(formData as BrokerageUserCreateDTO)
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
            {isEdit ? "编辑BrokerageUser（源框架导入）" : "新增BrokerageUser（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">推广员编号</label>
          <input
            type="number"
            value={formData.bind_user_id != null ? String(formData.bind_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bind_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入推广员编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">推广员绑定时间</label>
          <input
            type="text"
            value={formData.bind_user_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bind_user_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入推广员绑定时间"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="brokerage_enabled"
            checked={Boolean(formData.brokerage_enabled)}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_enabled: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="brokerage_enabled" className="text-xs text-slate-700 font-medium">是否有分销资格</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">成为分销员时间</label>
          <input
            type="text"
            value={formData.brokerage_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入成为分销员时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">可用佣金</label>
          <input
            type="number"
            value={formData.brokerage_price != null ? String(formData.brokerage_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brokerage_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入可用佣金"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">冻结佣金</label>
          <input
            type="number"
            value={formData.frozen_price != null ? String(formData.frozen_price) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, frozen_price: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入冻结佣金"
            
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
