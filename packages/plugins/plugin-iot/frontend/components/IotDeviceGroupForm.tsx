"use client"

import React, { useState, useEffect } from "react"
import { IotDeviceGroupApi } from "../api/iot-device-group.api"
import type { IotDeviceGroupCreateDTO, IotDeviceGroupVO } from "@/modules/iot/backend/types/iot-device-group.types"

interface IotDeviceGroupFormProps {
  open: boolean
  initialData?: IotDeviceGroupVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotDeviceGroupForm({ open, initialData, onClose, onSuccess }: IotDeviceGroupFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    status: initialData?.status ?? undefined,
    description: initialData?.description ?? "",
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
        await IotDeviceGroupApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotDeviceGroupApi.create(formData as IotDeviceGroupCreateDTO)
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
    <div data-testid="iot-device-group-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑IoT 设备分组" : "新增IoT 设备分组"}
        data-testid="iot-device-group-form"
        data-agent-scope="iot-device-group:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑IoT 设备分组" : "新增IoT 设备分组"}
          </h3>
          <button onClick={onClose} data-testid="iot-device-group-form-close" data-agent-target="iot-device-group:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="iot-device-group-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="iot-device-group-name" className="block text-xs text-slate-600 mb-1">分组名字</label>
          <input
            type="text"
            id="iot-device-group-name"
            data-testid="field-name"
            data-agent-target="iot-device-group:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="分组名字"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分组名字"
            
          />
        </div>

        <div>
          <label htmlFor="iot-device-group-status" className="block text-xs text-slate-600 mb-1">分组状态</label>
          <input
            type="number"
            id="iot-device-group-status"
            data-testid="field-status"
            data-agent-target="iot-device-group:field:status"
            data-agent-state={formData.status == null || formData.status === "" ? "empty" : "filled"}
            aria-label="分组状态"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分组状态"
            
          />
        </div>

        <div>
          <label htmlFor="iot-device-group-description" className="block text-xs text-slate-600 mb-1">分组描述</label>
          <input
            type="text"
            id="iot-device-group-description"
            data-testid="field-description"
            data-agent-target="iot-device-group:field:description"
            data-agent-state={formData.description ? "filled" : "empty"}
            aria-label="分组描述"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分组描述"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="iot-device-group-form-cancel"
              data-agent-target="iot-device-group:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="iot-device-group-form-submit"
              data-agent-target="iot-device-group:submit"
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
