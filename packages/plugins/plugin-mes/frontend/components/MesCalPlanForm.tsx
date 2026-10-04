"use client"

import React, { useState, useEffect } from "react"
import { MesCalPlanApi } from "../api/mes-cal-plan.api"
import type { MesCalPlanCreateDTO, MesCalPlanVO } from "@/modules/mes/backend/types/mes-cal-plan.types"

interface MesCalPlanFormProps {
  open: boolean
  initialData?: MesCalPlanVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesCalPlanForm({ open, initialData, onClose, onSuccess }: MesCalPlanFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    calendar_type: initialData?.calendar_type ?? undefined,
    start_date: initialData?.start_date ?? "",
    end_date: initialData?.end_date ?? "",
    shift_type: initialData?.shift_type ?? undefined,
    shift_method: initialData?.shift_method ?? undefined,
    shift_count: initialData?.shift_count ?? undefined,
    status: initialData?.status ?? undefined,
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
        await MesCalPlanApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesCalPlanApi.create(formData as MesCalPlanCreateDTO)
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
    <div data-testid="mes-cal-plan-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑MES 排班计划" : "新增MES 排班计划"}
        data-testid="mes-cal-plan-form"
        data-agent-scope="mes-cal-plan:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑MES 排班计划" : "新增MES 排班计划"}
          </h3>
          <button onClick={onClose} data-testid="mes-cal-plan-form-close" data-agent-target="mes-cal-plan:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="mes-cal-plan-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="mes-cal-plan-code" className="block text-xs text-slate-600 mb-1">计划编码</label>
          <input
            type="text"
            id="mes-cal-plan-code"
            data-testid="field-code"
            data-agent-target="mes-cal-plan:field:code"
            data-agent-state={formData.code ? "filled" : "empty"}
            aria-label="计划编码"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入计划编码"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-plan-name" className="block text-xs text-slate-600 mb-1">计划名称</label>
          <input
            type="text"
            id="mes-cal-plan-name"
            data-testid="field-name"
            data-agent-target="mes-cal-plan:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="计划名称"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入计划名称"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-plan-calendar_type" className="block text-xs text-slate-600 mb-1">班组类型</label>
          <input
            type="number"
            id="mes-cal-plan-calendar_type"
            data-testid="field-calendar_type"
            data-agent-target="mes-cal-plan:field:calendar_type"
            data-agent-state={formData.calendar_type == null || formData.calendar_type === "" ? "empty" : "filled"}
            aria-label="班组类型"
            value={formData.calendar_type != null ? String(formData.calendar_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, calendar_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入班组类型"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-plan-start_date" className="block text-xs text-slate-600 mb-1">开始日期</label>
          <input
            type="text"
            id="mes-cal-plan-start_date"
            data-testid="field-start_date"
            data-agent-target="mes-cal-plan:field:start_date"
            data-agent-state={formData.start_date ? "filled" : "empty"}
            aria-label="开始日期"
            value={formData.start_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开始日期"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-plan-end_date" className="block text-xs text-slate-600 mb-1">结束日期</label>
          <input
            type="text"
            id="mes-cal-plan-end_date"
            data-testid="field-end_date"
            data-agent-target="mes-cal-plan:field:end_date"
            data-agent-state={formData.end_date ? "filled" : "empty"}
            aria-label="结束日期"
            value={formData.end_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束日期"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-plan-shift_type" className="block text-xs text-slate-600 mb-1">轮班方式</label>
          <input
            type="number"
            id="mes-cal-plan-shift_type"
            data-testid="field-shift_type"
            data-agent-target="mes-cal-plan:field:shift_type"
            data-agent-state={formData.shift_type == null || formData.shift_type === "" ? "empty" : "filled"}
            aria-label="轮班方式"
            value={formData.shift_type != null ? String(formData.shift_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, shift_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入轮班方式"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-plan-shift_method" className="block text-xs text-slate-600 mb-1">倒班方式</label>
          <input
            type="number"
            id="mes-cal-plan-shift_method"
            data-testid="field-shift_method"
            data-agent-target="mes-cal-plan:field:shift_method"
            data-agent-state={formData.shift_method == null || formData.shift_method === "" ? "empty" : "filled"}
            aria-label="倒班方式"
            value={formData.shift_method != null ? String(formData.shift_method) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, shift_method: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入倒班方式"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-plan-shift_count" className="block text-xs text-slate-600 mb-1">倒班天数</label>
          <input
            type="number"
            id="mes-cal-plan-shift_count"
            data-testid="field-shift_count"
            data-agent-target="mes-cal-plan:field:shift_count"
            data-agent-state={formData.shift_count == null || formData.shift_count === "" ? "empty" : "filled"}
            aria-label="倒班天数"
            value={formData.shift_count != null ? String(formData.shift_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, shift_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入倒班天数"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-plan-status" className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            id="mes-cal-plan-status"
            data-testid="field-status"
            data-agent-target="mes-cal-plan:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div>
          <label htmlFor="mes-cal-plan-remark" className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            id="mes-cal-plan-remark"
            data-testid="field-remark"
            data-agent-target="mes-cal-plan:field:remark"
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
              data-testid="mes-cal-plan-form-cancel"
              data-agent-target="mes-cal-plan:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="mes-cal-plan-form-submit"
              data-agent-target="mes-cal-plan:submit"
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
