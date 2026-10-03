"use client"

import React, { useState, useEffect } from "react"
import { IotAlertRecordApi } from "../api/iot-alert-record.api"
import type { IotAlertRecordCreateDTO, IotAlertRecordVO } from "@/modules/iot/backend/types/iot-alert-record.types"

interface IotAlertRecordFormProps {
  open: boolean
  initialData?: IotAlertRecordVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotAlertRecordForm({ open, initialData, onClose, onSuccess }: IotAlertRecordFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    config_id: initialData?.config_id ?? undefined,
    config_name: initialData?.config_name ?? "",
    config_level: initialData?.config_level ?? undefined,
    scene_rule_id: initialData?.scene_rule_id ?? undefined,
    product_id: initialData?.product_id ?? undefined,
    device_id: initialData?.device_id ?? undefined,
    device_message: initialData?.device_message ?? "",
    process_status: initialData?.process_status ?? false,
    process_remark: initialData?.process_remark ?? "",
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
        await IotAlertRecordApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotAlertRecordApi.create(formData as IotAlertRecordCreateDTO)
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
            {isEdit ? "编辑IotAlertRecord（源框架导入）" : "新增IotAlertRecord（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">告警名称</label>
          <input
            type="number"
            value={formData.config_id != null ? String(formData.config_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, config_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入告警名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">告警名称</label>
          <input
            type="text"
            value={formData.config_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, config_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入告警名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">告警级别</label>
          <input
            type="number"
            value={formData.config_level != null ? String(formData.config_level) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, config_level: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入告警级别"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">场景规则编号</label>
          <input
            type="number"
            value={formData.scene_rule_id != null ? String(formData.scene_rule_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, scene_rule_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入场景规则编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品编号</label>
          <input
            type="number"
            value={formData.product_id != null ? String(formData.product_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">触发的设备消息</label>
          <input
            type="text"
            value={formData.device_message ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, device_message: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入触发的设备消息"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="process_status"
            checked={Boolean(formData.process_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="process_status" className="text-xs text-slate-700 font-medium">是否处理</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">处理结果（备注）</label>
          <input
            type="text"
            value={formData.process_remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入处理结果（备注）"
            
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
