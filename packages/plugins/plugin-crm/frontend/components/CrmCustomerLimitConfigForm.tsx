"use client"

import React, { useState, useEffect } from "react"
import { CrmCustomerLimitConfigApi } from "../api/crm-customer-limit-config.api"
import type { CrmCustomerLimitConfigCreateDTO, CrmCustomerLimitConfigVO } from "@/modules/crm/backend/types/crm-customer-limit-config.types"

interface CrmCustomerLimitConfigFormProps {
  open: boolean
  initialData?: CrmCustomerLimitConfigVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmCustomerLimitConfigForm({ open, initialData, onClose, onSuccess }: CrmCustomerLimitConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    type: initialData?.type ?? undefined,
    user_ids: initialData?.user_ids ?? "",
    dept_ids: initialData?.dept_ids ?? "",
    max_count: initialData?.max_count ?? undefined,
    deal_count_enabled: initialData?.deal_count_enabled ?? false,
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
        await CrmCustomerLimitConfigApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmCustomerLimitConfigApi.create(formData as CrmCustomerLimitConfigCreateDTO)
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
            {isEdit ? "编辑CrmCustomerLimitConfig（源框架导入）" : "新增CrmCustomerLimitConfig（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">规则类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规则类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">规则适用人群</label>
          <input
            type="text"
            value={formData.user_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规则适用人群"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">规则适用部门</label>
          <input
            type="text"
            value={formData.dept_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, dept_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规则适用部门"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">数量上限</label>
          <input
            type="number"
            value={formData.max_count != null ? String(formData.max_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, max_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数量上限"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="deal_count_enabled"
            checked={Boolean(formData.deal_count_enabled)}
            onChange={(e) => setFormData((prev) => ({ ...prev, deal_count_enabled: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="deal_count_enabled" className="text-xs text-slate-700 font-medium">成交客户是否占有拥有客户数</label>
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
