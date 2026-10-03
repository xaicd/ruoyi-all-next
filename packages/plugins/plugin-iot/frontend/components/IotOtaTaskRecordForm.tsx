"use client"

import React, { useState, useEffect } from "react"
import { IotOtaTaskRecordApi } from "../api/iot-ota-task-record.api"
import type { IotOtaTaskRecordCreateDTO, IotOtaTaskRecordVO } from "@/modules/iot/backend/types/iot-ota-task-record.types"

interface IotOtaTaskRecordFormProps {
  open: boolean
  initialData?: IotOtaTaskRecordVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotOtaTaskRecordForm({ open, initialData, onClose, onSuccess }: IotOtaTaskRecordFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    firmware_id: initialData?.firmware_id ?? undefined,
    task_id: initialData?.task_id ?? undefined,
    device_id: initialData?.device_id ?? undefined,
    from_firmware_id: initialData?.from_firmware_id ?? undefined,
    status: initialData?.status ?? undefined,
    progress: initialData?.progress ?? undefined,
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
        await IotOtaTaskRecordApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotOtaTaskRecordApi.create(formData as IotOtaTaskRecordCreateDTO)
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
            {isEdit ? "编辑IotOtaTaskRecord（源框架导入）" : "新增IotOtaTaskRecord（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">固件编号</label>
          <input
            type="number"
            value={formData.firmware_id != null ? String(formData.firmware_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, firmware_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入固件编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">任务编号</label>
          <input
            type="number"
            value={formData.task_id != null ? String(formData.task_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, task_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入任务编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备编号</label>
          <input
            type="number"
            value={formData.device_id != null ? String(formData.device_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, device_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">来源的固件编号</label>
          <input
            type="number"
            value={formData.from_firmware_id != null ? String(formData.from_firmware_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, from_firmware_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入来源的固件编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">升级状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入升级状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">升级进度，百分比</label>
          <input
            type="number"
            value={formData.progress != null ? String(formData.progress) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, progress: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入升级进度，百分比"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">升级进度描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入升级进度描述"
            
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
