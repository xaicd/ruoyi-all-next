"use client"

import React, { useState, useEffect } from "react"
import { MesQcTemplateIndicatorApi } from "../api/mes-qc-template-indicator.api"
import type { MesQcTemplateIndicatorCreateDTO, MesQcTemplateIndicatorVO } from "@/modules/mes/backend/types/mes-qc-template-indicator.types"

interface MesQcTemplateIndicatorFormProps {
  open: boolean
  initialData?: MesQcTemplateIndicatorVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesQcTemplateIndicatorForm({ open, initialData, onClose, onSuccess }: MesQcTemplateIndicatorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    template_id: initialData?.template_id ?? undefined,
    indicator_id: initialData?.indicator_id ?? undefined,
    check_method: initialData?.check_method ?? "",
    standard_value: initialData?.standard_value ?? undefined,
    unit_measure_id: initialData?.unit_measure_id ?? undefined,
    threshold_max: initialData?.threshold_max ?? undefined,
    threshold_min: initialData?.threshold_min ?? undefined,
    doc_url: initialData?.doc_url ?? "",
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
        await MesQcTemplateIndicatorApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesQcTemplateIndicatorApi.create(formData as MesQcTemplateIndicatorCreateDTO)
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
            {isEdit ? "编辑MesQcTemplateIndicator（源框架导入）" : "新增MesQcTemplateIndicator（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">质检方案编号</label>
          <input
            type="number"
            value={formData.template_id != null ? String(formData.template_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, template_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入质检方案编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">质检指标编号</label>
          <input
            type="number"
            value={formData.indicator_id != null ? String(formData.indicator_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, indicator_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入质检指标编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">检测方法</label>
          <input
            type="text"
            value={formData.check_method ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, check_method: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入检测方法"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">标准值</label>
          <input
            type="number"
            value={formData.standard_value != null ? String(formData.standard_value) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, standard_value: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入标准值"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">计量单位编号</label>
          <input
            type="number"
            value={formData.unit_measure_id != null ? String(formData.unit_measure_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit_measure_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入计量单位编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">误差上限</label>
          <input
            type="number"
            value={formData.threshold_max != null ? String(formData.threshold_max) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, threshold_max: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入误差上限"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">误差下限</label>
          <input
            type="number"
            value={formData.threshold_min != null ? String(formData.threshold_min) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, threshold_min: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入误差下限"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">说明图 URL</label>
          <input
            type="text"
            value={formData.doc_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, doc_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入说明图 URL"
            
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
