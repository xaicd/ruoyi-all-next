"use client"

import React, { useState, useEffect } from "react"
import { MesTmToolTypeApi } from "../api/mes-tm-tool-type.api"
import type { MesTmToolTypeCreateDTO, MesTmToolTypeVO } from "@/modules/mes/backend/types/mes-tm-tool-type.types"

interface MesTmToolTypeFormProps {
  open: boolean
  initialData?: MesTmToolTypeVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesTmToolTypeForm({ open, initialData, onClose, onSuccess }: MesTmToolTypeFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    code_flag: initialData?.code_flag ?? false,
    mainten_type: initialData?.mainten_type ?? undefined,
    mainten_period: initialData?.mainten_period ?? undefined,
    remark: initialData?.remark ?? "",
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
        await MesTmToolTypeApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesTmToolTypeApi.create(formData as MesTmToolTypeCreateDTO)
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
    <div data-testid="mes-tm-tool-type-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑MES 工具类型" : "新增MES 工具类型"}
        data-testid="mes-tm-tool-type-form"
        data-agent-scope="mes-tm-tool-type:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑MES 工具类型" : "新增MES 工具类型"}
          </h3>
          <button onClick={onClose} data-testid="mes-tm-tool-type-form-close" data-agent-target="mes-tm-tool-type:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="mes-tm-tool-type-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="mes-tm-tool-type-code" className="block text-xs text-slate-600 mb-1">类型编码</label>
          <input
            type="text"
            id="mes-tm-tool-type-code"
            data-testid="field-code"
            data-agent-target="mes-tm-tool-type:field:code"
            data-agent-state={formData.code ? "filled" : "empty"}
            aria-label="类型编码"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入类型编码"
            
          />
        </div>

        <div>
          <label htmlFor="mes-tm-tool-type-name" className="block text-xs text-slate-600 mb-1">类型名称</label>
          <input
            type="text"
            id="mes-tm-tool-type-name"
            data-testid="field-name"
            data-agent-target="mes-tm-tool-type:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="类型名称"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入类型名称"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="mes-tm-tool-type-code_flag"
            data-testid="field-code_flag"
            data-agent-target="mes-tm-tool-type:field:code_flag"
            data-agent-state={formData.code_flag ? "on" : "off"}
            aria-label="是否编码管理"
            checked={Boolean(formData.code_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, code_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="mes-tm-tool-type-code_flag" className="text-xs text-slate-700 font-medium">是否编码管理</label>
        </div>

        <div>
          <label htmlFor="mes-tm-tool-type-mainten_type" className="block text-xs text-slate-600 mb-1">保养维护类型</label>
          <input
            type="number"
            id="mes-tm-tool-type-mainten_type"
            data-testid="field-mainten_type"
            data-agent-target="mes-tm-tool-type:field:mainten_type"
            data-agent-state={formData.mainten_type == null || formData.mainten_type === "" ? "empty" : "filled"}
            aria-label="保养维护类型"
            value={formData.mainten_type != null ? String(formData.mainten_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mainten_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入保养维护类型"
            
          />
        </div>

        <div>
          <label htmlFor="mes-tm-tool-type-mainten_period" className="block text-xs text-slate-600 mb-1">保养周期</label>
          <input
            type="number"
            id="mes-tm-tool-type-mainten_period"
            data-testid="field-mainten_period"
            data-agent-target="mes-tm-tool-type:field:mainten_period"
            data-agent-state={formData.mainten_period == null || formData.mainten_period === "" ? "empty" : "filled"}
            aria-label="保养周期"
            value={formData.mainten_period != null ? String(formData.mainten_period) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mainten_period: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入保养周期"
            
          />
        </div>

        <div>
          <label htmlFor="mes-tm-tool-type-remark" className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            id="mes-tm-tool-type-remark"
            data-testid="field-remark"
            data-agent-target="mes-tm-tool-type:field:remark"
            data-agent-state={formData.remark ? "filled" : "empty"}
            aria-label="备注"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入备注"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="mes-tm-tool-type-form-cancel"
              data-agent-target="mes-tm-tool-type:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="mes-tm-tool-type-form-submit"
              data-agent-target="mes-tm-tool-type:submit"
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
