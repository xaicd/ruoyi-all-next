"use client"

import React, { useState, useEffect } from "react"
import { MesCalHolidayApi } from "../api/mes-cal-holiday.api"
import type { MesCalHolidayCreateDTO, MesCalHolidayVO } from "@/modules/mes/backend/types/mes-cal-holiday.types"

interface MesCalHolidayFormProps {
  open: boolean
  initialData?: MesCalHolidayVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesCalHolidayForm({ open, initialData, onClose, onSuccess }: MesCalHolidayFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    day: initialData?.day ?? "",
    type: initialData?.type ?? undefined,
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
        await MesCalHolidayApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesCalHolidayApi.create(formData as MesCalHolidayCreateDTO)
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
    <div data-testid="mes-cal-holiday-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑MES 假期设置" : "新增MES 假期设置"}
        data-testid="mes-cal-holiday-form"
        data-agent-scope="mes-cal-holiday:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑MES 假期设置" : "新增MES 假期设置"}
          </h3>
          <button onClick={onClose} data-testid="mes-cal-holiday-form-close" data-agent-target="mes-cal-holiday:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="mes-cal-holiday-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="mes-cal-holiday-day" className="block text-xs text-slate-600 mb-1">日期</label>
          <input
            type="text"
            id="mes-cal-holiday-day"
            data-testid="field-day"
            data-agent-target="mes-cal-holiday:field:day"
            data-agent-state={formData.day ? "filled" : "empty"}
            aria-label="日期"
            value={formData.day ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, day: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入日期"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-holiday-type" className="block text-xs text-slate-600 mb-1">日期类型</label>
          <input
            type="number"
            id="mes-cal-holiday-type"
            data-testid="field-type"
            data-agent-target="mes-cal-holiday:field:type"
            data-agent-state={formData.type == null || formData.type === "" ? "empty" : "filled"}
            aria-label="日期类型"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入日期类型"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-holiday-remark" className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            id="mes-cal-holiday-remark"
            data-testid="field-remark"
            data-agent-target="mes-cal-holiday:field:remark"
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
              data-testid="mes-cal-holiday-form-cancel"
              data-agent-target="mes-cal-holiday:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="mes-cal-holiday-form-submit"
              data-agent-target="mes-cal-holiday:submit"
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
