"use client"

import React, { useState, useEffect } from "react"
import { BpmProcessListenerApi } from "../api/bpm-process-listener.api"
import type { BpmProcessListenerCreateDTO, BpmProcessListenerVO } from "@/modules/bpm/backend/types/bpm-process-listener.types"

interface BpmProcessListenerFormProps {
  open: boolean
  initialData?: BpmProcessListenerVO | null
  onClose: () => void
  onSuccess: () => void
}

export function BpmProcessListenerForm({ open, initialData, onClose, onSuccess }: BpmProcessListenerFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    status: initialData?.status ?? undefined,
    type: initialData?.type ?? "",
    event: initialData?.event ?? "",
    value_type: initialData?.value_type ?? "",
    value: initialData?.value ?? "",
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
        await BpmProcessListenerApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await BpmProcessListenerApi.create(formData as BpmProcessListenerCreateDTO)
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
    <div data-testid="bpm-process-listener-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计时，直接选择这些模版" : "新增BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计时，直接选择这些模版"}
        data-testid="bpm-process-listener-form"
        data-agent-scope="bpm-process-listener:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计时，直接选择这些模版" : "新增BPM 流程监听器 DO目的：本质上它是流程监听器的模版，用于 BPMN 在设计时，直接选择这些模版"}
          </h3>
          <button onClick={onClose} data-testid="bpm-process-listener-form-close" data-agent-target="bpm-process-listener:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="bpm-process-listener-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="bpm-process-listener-name" className="block text-xs text-slate-600 mb-1">监听器名字</label>
          <input
            type="text"
            id="bpm-process-listener-name"
            data-testid="field-name"
            data-agent-target="bpm-process-listener:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="监听器名字"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入监听器名字"
            
          />
        </div>

        <div>
          <label htmlFor="bpm-process-listener-status" className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            id="bpm-process-listener-status"
            data-testid="field-status"
            data-agent-target="bpm-process-listener:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
          />
        </div>

        <div>
          <label htmlFor="bpm-process-listener-type" className="block text-xs text-slate-600 mb-1">监听类型</label>
          <input
            type="text"
            id="bpm-process-listener-type"
            data-testid="field-type"
            data-agent-target="bpm-process-listener:field:type"
            data-agent-state={formData.type ? "filled" : "empty"}
            aria-label="监听类型"
            value={formData.type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入监听类型"
            
          />
        </div>

        <div>
          <label htmlFor="bpm-process-listener-event" className="block text-xs text-slate-600 mb-1">监听事件</label>
          <input
            type="text"
            id="bpm-process-listener-event"
            data-testid="field-event"
            data-agent-target="bpm-process-listener:field:event"
            data-agent-state={formData.event ? "filled" : "empty"}
            aria-label="监听事件"
            value={formData.event ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, event: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入监听事件"
            
          />
        </div>

        <div>
          <label htmlFor="bpm-process-listener-value_type" className="block text-xs text-slate-600 mb-1">值类型</label>
          <input
            type="text"
            id="bpm-process-listener-value_type"
            data-testid="field-value_type"
            data-agent-target="bpm-process-listener:field:value_type"
            data-agent-state={formData.value_type ? "filled" : "empty"}
            aria-label="值类型"
            value={formData.value_type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, value_type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入值类型"
            
          />
        </div>

        <div>
          <label htmlFor="bpm-process-listener-value" className="block text-xs text-slate-600 mb-1">值</label>
          <input
            type="text"
            id="bpm-process-listener-value"
            data-testid="field-value"
            data-agent-target="bpm-process-listener:field:value"
            data-agent-state={formData.value ? "filled" : "empty"}
            aria-label="值"
            value={formData.value ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入值"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="bpm-process-listener-form-cancel"
              data-agent-target="bpm-process-listener:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="bpm-process-listener-form-submit"
              data-agent-target="bpm-process-listener:submit"
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
