"use client"

import React, { useState, useEffect } from "react"
import { DeliveryExpressApi } from "../api/delivery-express.api"
import type { DeliveryExpressCreateDTO, DeliveryExpressVO } from "@/modules/mall/backend/types/delivery-express.types"

interface DeliveryExpressFormProps {
  open: boolean
  initialData?: DeliveryExpressVO | null
  onClose: () => void
  onSuccess: () => void
}

export function DeliveryExpressForm({ open, initialData, onClose, onSuccess }: DeliveryExpressFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    logo: initialData?.logo ?? "",
    sort: initialData?.sort ?? undefined,
    status: initialData?.status ?? undefined,
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
        await DeliveryExpressApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await DeliveryExpressApi.create(formData as DeliveryExpressCreateDTO)
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
    <div data-testid="delivery-express-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑快递公司" : "新增快递公司"}
        data-testid="delivery-express-form"
        data-agent-scope="delivery-express:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑快递公司" : "新增快递公司"}
          </h3>
          <button onClick={onClose} data-testid="delivery-express-form-close" data-agent-target="delivery-express:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="delivery-express-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="delivery-express-code" className="block text-xs text-slate-600 mb-1">快递公司 code</label>
          <input
            type="text"
            id="delivery-express-code"
            data-testid="field-code"
            data-agent-target="delivery-express:field:code"
            data-agent-state={formData.code ? "filled" : "empty"}
            aria-label="快递公司 code"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入快递公司 code"
            
          />
        </div>

        <div>
          <label htmlFor="delivery-express-name" className="block text-xs text-slate-600 mb-1">快递公司名称</label>
          <input
            type="text"
            id="delivery-express-name"
            data-testid="field-name"
            data-agent-target="delivery-express:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="快递公司名称"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入快递公司名称"
            
          />
        </div>

        <div>
          <label htmlFor="delivery-express-logo" className="block text-xs text-slate-600 mb-1">快递公司 logo</label>
          <input
            type="text"
            id="delivery-express-logo"
            data-testid="field-logo"
            data-agent-target="delivery-express:field:logo"
            data-agent-state={formData.logo ? "filled" : "empty"}
            aria-label="快递公司 logo"
            value={formData.logo ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入快递公司 logo"
            
          />
        </div>

        <div>
          <label htmlFor="delivery-express-sort" className="block text-xs text-slate-600 mb-1">排序</label>
          <input
            type="number"
            id="delivery-express-sort"
            data-testid="field-sort"
            data-agent-target="delivery-express:field:sort"
            data-agent-state={formData.sort == null || formData.sort === "" ? "empty" : "filled"}
            aria-label="排序"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序"
            
          />
        </div>

        <div>
          <label htmlFor="delivery-express-status" className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            id="delivery-express-status"
            data-testid="field-status"
            data-agent-target="delivery-express:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="delivery-express-form-cancel"
              data-agent-target="delivery-express:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="delivery-express-form-submit"
              data-agent-target="delivery-express:submit"
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
