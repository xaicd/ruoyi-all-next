"use client"

import React, { useState, useEffect } from "react"
import { DeliveryExpressTemplateApi } from "../api/delivery-express-template.api"
import type { DeliveryExpressTemplateCreateDTO, DeliveryExpressTemplateVO } from "@/modules/mall/backend/types/delivery-express-template.types"

interface DeliveryExpressTemplateFormProps {
  open: boolean
  initialData?: DeliveryExpressTemplateVO | null
  onClose: () => void
  onSuccess: () => void
}

export function DeliveryExpressTemplateForm({ open, initialData, onClose, onSuccess }: DeliveryExpressTemplateFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    charge_mode: initialData?.charge_mode ?? undefined,
    sort: initialData?.sort ?? undefined,
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
        await DeliveryExpressTemplateApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await DeliveryExpressTemplateApi.create(formData as DeliveryExpressTemplateCreateDTO)
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
    <div data-testid="delivery-express-template-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑快递运费模板" : "新增快递运费模板"}
        data-testid="delivery-express-template-form"
        data-agent-scope="delivery-express-template:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑快递运费模板" : "新增快递运费模板"}
          </h3>
          <button onClick={onClose} data-testid="delivery-express-template-form-close" data-agent-target="delivery-express-template:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="delivery-express-template-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="delivery-express-template-name" className="block text-xs text-slate-600 mb-1">模板名称</label>
          <input
            type="text"
            id="delivery-express-template-name"
            data-testid="field-name"
            data-agent-target="delivery-express-template:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="模板名称"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模板名称"
            
          />
        </div>

        <div>
          <label htmlFor="delivery-express-template-charge_mode" className="block text-xs text-slate-600 mb-1">配送计费方式</label>
          <input
            type="number"
            id="delivery-express-template-charge_mode"
            data-testid="field-charge_mode"
            data-agent-target="delivery-express-template:field:charge_mode"
            data-agent-state={formData.charge_mode == null || formData.charge_mode === "" ? "empty" : "filled"}
            aria-label="配送计费方式"
            value={formData.charge_mode != null ? String(formData.charge_mode) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, charge_mode: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入配送计费方式"
            
          />
        </div>

        <div>
          <label htmlFor="delivery-express-template-sort" className="block text-xs text-slate-600 mb-1">排序</label>
          <input
            type="number"
            id="delivery-express-template-sort"
            data-testid="field-sort"
            data-agent-target="delivery-express-template:field:sort"
            data-agent-state={formData.sort == null || formData.sort === "" ? "empty" : "filled"}
            aria-label="排序"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="delivery-express-template-form-cancel"
              data-agent-target="delivery-express-template:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="delivery-express-template-form-submit"
              data-agent-target="delivery-express-template:submit"
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
