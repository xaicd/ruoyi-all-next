"use client"

import React, { useState, useEffect } from "react"
import { IotDataSinkApi } from "../api/iot-data-sink.api"
import type { IotDataSinkCreateDTO, IotDataSinkVO } from "@/modules/iot/backend/types/iot-data-sink.types"

interface IotDataSinkFormProps {
  open: boolean
  initialData?: IotDataSinkVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotDataSinkForm({ open, initialData, onClose, onSuccess }: IotDataSinkFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    status: initialData?.status ?? undefined,
    type: initialData?.type ?? undefined,
    config: initialData?.config ?? "",
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
        await IotDataSinkApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotDataSinkApi.create(formData as IotDataSinkCreateDTO)
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
    <div data-testid="iot-data-sink-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑IoT 数据流转目的" : "新增IoT 数据流转目的"}
        data-testid="iot-data-sink-form"
        data-agent-scope="iot-data-sink:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑IoT 数据流转目的" : "新增IoT 数据流转目的"}
          </h3>
          <button onClick={onClose} data-testid="iot-data-sink-form-close" data-agent-target="iot-data-sink:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="iot-data-sink-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="iot-data-sink-name" className="block text-xs text-slate-600 mb-1">数据流转目的名称</label>
          <input
            type="text"
            id="iot-data-sink-name"
            data-testid="field-name"
            data-agent-target="iot-data-sink:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="数据流转目的名称"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据流转目的名称"
            
          />
        </div>

        <div>
          <label htmlFor="iot-data-sink-description" className="block text-xs text-slate-600 mb-1">数据流转目的描述</label>
          <input
            type="text"
            id="iot-data-sink-description"
            data-testid="field-description"
            data-agent-target="iot-data-sink:field:description"
            data-agent-state={formData.description ? "filled" : "empty"}
            aria-label="数据流转目的描述"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据流转目的描述"
            
          />
        </div>

        <div>
          <label htmlFor="iot-data-sink-status" className="block text-xs text-slate-600 mb-1">数据流转目的状态</label>
          <input
            type="number"
            id="iot-data-sink-status"
            data-testid="field-status"
            data-agent-target="iot-data-sink:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="数据流转目的状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据流转目的状态"
            
          />
        </div>

        <div>
          <label htmlFor="iot-data-sink-type" className="block text-xs text-slate-600 mb-1">数据流转目的类型</label>
          <input
            type="number"
            id="iot-data-sink-type"
            data-testid="field-type"
            data-agent-target="iot-data-sink:field:type"
            data-agent-state={formData.type == null || formData.type === "" ? "empty" : "filled"}
            aria-label="数据流转目的类型"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据流转目的类型"
            
          />
        </div>

        <div>
          <label htmlFor="iot-data-sink-config" className="block text-xs text-slate-600 mb-1">数据流转目的配置</label>
          <input
            type="text"
            id="iot-data-sink-config"
            data-testid="field-config"
            data-agent-target="iot-data-sink:field:config"
            data-agent-state={formData.config ? "filled" : "empty"}
            aria-label="数据流转目的配置"
            value={formData.config ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, config: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据流转目的配置"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="iot-data-sink-form-cancel"
              data-agent-target="iot-data-sink:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="iot-data-sink-form-submit"
              data-agent-target="iot-data-sink:submit"
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
