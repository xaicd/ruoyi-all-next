"use client"

import React, { useState, useEffect } from "react"
import { PayAppApi } from "../api/pay-app.api"
import type { PayAppCreateDTO, PayAppVO } from "@/modules/pay/backend/types/pay-app.types"

interface PayAppFormProps {
  open: boolean
  initialData?: PayAppVO | null
  onClose: () => void
  onSuccess: () => void
}

export function PayAppForm({ open, initialData, onClose, onSuccess }: PayAppFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    app_key: initialData?.app_key ?? "",
    name: initialData?.name ?? "",
    status: initialData?.status ?? undefined,
    remark: initialData?.remark ?? "",
    order_notify_url: initialData?.order_notify_url ?? "",
    refund_notify_url: initialData?.refund_notify_url ?? "",
    transfer_notify_url: initialData?.transfer_notify_url ?? "",
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
        await PayAppApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await PayAppApi.create(formData as PayAppCreateDTO)
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
    <div data-testid="pay-app-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家等等不过一般来说，一个商户，只有一个应用哈~即 PayMerchantDO : PayAppDO = 1 : n" : "新增支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家等等不过一般来说，一个商户，只有一个应用哈~即 PayMerchantDO : PayAppDO = 1 : n"}
        data-testid="pay-app-form"
        data-agent-scope="pay-app:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家等等不过一般来说，一个商户，只有一个应用哈~即 PayMerchantDO : PayAppDO = 1 : n" : "新增支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家等等不过一般来说，一个商户，只有一个应用哈~即 PayMerchantDO : PayAppDO = 1 : n"}
          </h3>
          <button onClick={onClose} data-testid="pay-app-form-close" data-agent-target="pay-app:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="pay-app-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="pay-app-app_key" className="block text-xs text-slate-600 mb-1">应用标识</label>
          <input
            type="text"
            id="pay-app-app_key"
            data-testid="field-app_key"
            data-agent-target="pay-app:field:app_key"
            data-agent-state={formData.app_key ? "filled" : "empty"}
            aria-label="应用标识"
            value={formData.app_key ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, app_key: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入应用标识"
            
          />
        </div>

        <div>
          <label htmlFor="pay-app-name" className="block text-xs text-slate-600 mb-1">应用名</label>
          <input
            type="text"
            id="pay-app-name"
            data-testid="field-name"
            data-agent-target="pay-app:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="应用名"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入应用名"
            
          />
        </div>

        <div>
          <label htmlFor="pay-app-status" className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            id="pay-app-status"
            data-testid="field-status"
            data-agent-target="pay-app:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div>
          <label htmlFor="pay-app-remark" className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            id="pay-app-remark"
            data-testid="field-remark"
            data-agent-target="pay-app:field:remark"
            data-agent-state={formData.remark ? "filled" : "empty"}
            aria-label="备注"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入备注"
            
          />
        </div>

        <div>
          <label htmlFor="pay-app-order_notify_url" className="block text-xs text-slate-600 mb-1">支付结果的回调地址</label>
          <input
            type="text"
            id="pay-app-order_notify_url"
            data-testid="field-order_notify_url"
            data-agent-target="pay-app:field:order_notify_url"
            data-agent-state={formData.order_notify_url ? "filled" : "empty"}
            aria-label="支付结果的回调地址"
            value={formData.order_notify_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, order_notify_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入支付结果的回调地址"
            
          />
        </div>

        <div>
          <label htmlFor="pay-app-refund_notify_url" className="block text-xs text-slate-600 mb-1">退款结果的回调地址</label>
          <input
            type="text"
            id="pay-app-refund_notify_url"
            data-testid="field-refund_notify_url"
            data-agent-target="pay-app:field:refund_notify_url"
            data-agent-state={formData.refund_notify_url ? "filled" : "empty"}
            aria-label="退款结果的回调地址"
            value={formData.refund_notify_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, refund_notify_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退款结果的回调地址"
            
          />
        </div>

        <div>
          <label htmlFor="pay-app-transfer_notify_url" className="block text-xs text-slate-600 mb-1">转账结果的回调地址</label>
          <input
            type="text"
            id="pay-app-transfer_notify_url"
            data-testid="field-transfer_notify_url"
            data-agent-target="pay-app:field:transfer_notify_url"
            data-agent-state={formData.transfer_notify_url ? "filled" : "empty"}
            aria-label="转账结果的回调地址"
            value={formData.transfer_notify_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, transfer_notify_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入转账结果的回调地址"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="pay-app-form-cancel"
              data-agent-target="pay-app:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="pay-app-form-submit"
              data-agent-target="pay-app:submit"
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
