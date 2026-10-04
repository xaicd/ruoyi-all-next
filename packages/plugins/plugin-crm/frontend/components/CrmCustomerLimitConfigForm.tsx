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
    <div data-testid="crm-customer-limit-config-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑客户限制配置" : "新增客户限制配置"}
        data-testid="crm-customer-limit-config-form"
        data-agent-scope="crm-customer-limit-config:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑客户限制配置" : "新增客户限制配置"}
          </h3>
          <button onClick={onClose} data-testid="crm-customer-limit-config-form-close" data-agent-target="crm-customer-limit-config:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="crm-customer-limit-config-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="crm-customer-limit-config-type" className="block text-xs text-slate-600 mb-1">规则类型</label>
          <input
            type="number"
            id="crm-customer-limit-config-type"
            data-testid="field-type"
            data-agent-target="crm-customer-limit-config:field:type"
            data-agent-state={formData.type == null || formData.type === "" ? "empty" : "filled"}
            aria-label="规则类型"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规则类型"
            
          />
        </div>

        <div>
          <label htmlFor="crm-customer-limit-config-user_ids" className="block text-xs text-slate-600 mb-1">规则适用人群</label>
          <input
            type="text"
            id="crm-customer-limit-config-user_ids"
            data-testid="field-user_ids"
            data-agent-target="crm-customer-limit-config:field:user_ids"
            data-agent-state={formData.user_ids ? "filled" : "empty"}
            aria-label="规则适用人群"
            value={formData.user_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规则适用人群"
            
          />
        </div>

        <div>
          <label htmlFor="crm-customer-limit-config-dept_ids" className="block text-xs text-slate-600 mb-1">规则适用部门</label>
          <input
            type="text"
            id="crm-customer-limit-config-dept_ids"
            data-testid="field-dept_ids"
            data-agent-target="crm-customer-limit-config:field:dept_ids"
            data-agent-state={formData.dept_ids ? "filled" : "empty"}
            aria-label="规则适用部门"
            value={formData.dept_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, dept_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规则适用部门"
            
          />
        </div>

        <div>
          <label htmlFor="crm-customer-limit-config-max_count" className="block text-xs text-slate-600 mb-1">数量上限</label>
          <input
            type="number"
            id="crm-customer-limit-config-max_count"
            data-testid="field-max_count"
            data-agent-target="crm-customer-limit-config:field:max_count"
            data-agent-state={formData.max_count == null || formData.max_count === "" ? "empty" : "filled"}
            aria-label="数量上限"
            value={formData.max_count != null ? String(formData.max_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, max_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数量上限"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="crm-customer-limit-config-deal_count_enabled"
            data-testid="field-deal_count_enabled"
            data-agent-target="crm-customer-limit-config:field:deal_count_enabled"
            data-agent-state={formData.deal_count_enabled ? "on" : "off"}
            aria-label="成交客户是否占有拥有客户数"
            checked={Boolean(formData.deal_count_enabled)}
            onChange={(e) => setFormData((prev) => ({ ...prev, deal_count_enabled: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="crm-customer-limit-config-deal_count_enabled" className="text-xs text-slate-700 font-medium">成交客户是否占有拥有客户数</label>
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="crm-customer-limit-config-form-cancel"
              data-agent-target="crm-customer-limit-config:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="crm-customer-limit-config-form-submit"
              data-agent-target="crm-customer-limit-config:submit"
              data-agent-state={loading ? "busy" : "idle"}
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
