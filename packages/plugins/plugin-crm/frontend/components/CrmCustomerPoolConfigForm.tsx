"use client"

import React, { useState, useEffect } from "react"
import { CrmCustomerPoolConfigApi } from "../api/crm-customer-pool-config.api"
import type { CrmCustomerPoolConfigCreateDTO, CrmCustomerPoolConfigVO } from "@/modules/crm/backend/types/crm-customer-pool-config.types"

interface CrmCustomerPoolConfigFormProps {
  open: boolean
  initialData?: CrmCustomerPoolConfigVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmCustomerPoolConfigForm({ open, initialData, onClose, onSuccess }: CrmCustomerPoolConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    enabled: initialData?.enabled ?? false,
    contact_expire_days: initialData?.contact_expire_days ?? undefined,
    deal_expire_days: initialData?.deal_expire_days ?? undefined,
    notify_enabled: initialData?.notify_enabled ?? false,
    notify_days: initialData?.notify_days ?? undefined,
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
        await CrmCustomerPoolConfigApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmCustomerPoolConfigApi.create(formData as CrmCustomerPoolConfigCreateDTO)
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
    <div data-testid="crm-customer-pool-config-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑客户公海配置" : "新增客户公海配置"}
        data-testid="crm-customer-pool-config-form"
        data-agent-scope="crm-customer-pool-config:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑客户公海配置" : "新增客户公海配置"}
          </h3>
          <button onClick={onClose} data-testid="crm-customer-pool-config-form-close" data-agent-target="crm-customer-pool-config:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="crm-customer-pool-config-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="crm-customer-pool-config-enabled"
            data-testid="field-enabled"
            data-agent-target="crm-customer-pool-config:field:enabled"
            data-agent-state={formData.enabled ? "on" : "off"}
            aria-label="是否启用客户公海"
            checked={Boolean(formData.enabled)}
            onChange={(e) => setFormData((prev) => ({ ...prev, enabled: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="crm-customer-pool-config-enabled" className="text-xs text-slate-700 font-medium">是否启用客户公海</label>
        </div>

        <div>
          <label htmlFor="crm-customer-pool-config-contact_expire_days" className="block text-xs text-slate-600 mb-1">未跟进放入公海天数</label>
          <input
            type="number"
            id="crm-customer-pool-config-contact_expire_days"
            data-testid="field-contact_expire_days"
            data-agent-target="crm-customer-pool-config:field:contact_expire_days"
            data-agent-state={formData.contact_expire_days == null || formData.contact_expire_days === "" ? "empty" : "filled"}
            aria-label="未跟进放入公海天数"
            value={formData.contact_expire_days != null ? String(formData.contact_expire_days) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_expire_days: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入未跟进放入公海天数"
            
          />
        </div>

        <div>
          <label htmlFor="crm-customer-pool-config-deal_expire_days" className="block text-xs text-slate-600 mb-1">未成交放入公海天数</label>
          <input
            type="number"
            id="crm-customer-pool-config-deal_expire_days"
            data-testid="field-deal_expire_days"
            data-agent-target="crm-customer-pool-config:field:deal_expire_days"
            data-agent-state={formData.deal_expire_days == null || formData.deal_expire_days === "" ? "empty" : "filled"}
            aria-label="未成交放入公海天数"
            value={formData.deal_expire_days != null ? String(formData.deal_expire_days) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, deal_expire_days: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入未成交放入公海天数"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="crm-customer-pool-config-notify_enabled"
            data-testid="field-notify_enabled"
            data-agent-target="crm-customer-pool-config:field:notify_enabled"
            data-agent-state={formData.notify_enabled ? "on" : "off"}
            aria-label="是否开启提前提醒"
            checked={Boolean(formData.notify_enabled)}
            onChange={(e) => setFormData((prev) => ({ ...prev, notify_enabled: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="crm-customer-pool-config-notify_enabled" className="text-xs text-slate-700 font-medium">是否开启提前提醒</label>
        </div>

        <div>
          <label htmlFor="crm-customer-pool-config-notify_days" className="block text-xs text-slate-600 mb-1">提前提醒天数</label>
          <input
            type="number"
            id="crm-customer-pool-config-notify_days"
            data-testid="field-notify_days"
            data-agent-target="crm-customer-pool-config:field:notify_days"
            data-agent-state={formData.notify_days == null || formData.notify_days === "" ? "empty" : "filled"}
            aria-label="提前提醒天数"
            value={formData.notify_days != null ? String(formData.notify_days) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notify_days: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入提前提醒天数"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="crm-customer-pool-config-form-cancel"
              data-agent-target="crm-customer-pool-config:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="crm-customer-pool-config-form-submit"
              data-agent-target="crm-customer-pool-config:submit"
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
