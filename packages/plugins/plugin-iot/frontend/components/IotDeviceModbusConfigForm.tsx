"use client"

import React, { useState, useEffect } from "react"
import { IotDeviceModbusConfigApi } from "../api/iot-device-modbus-config.api"
import type { IotDeviceModbusConfigCreateDTO, IotDeviceModbusConfigVO } from "@/modules/iot/backend/types/iot-device-modbus-config.types"

interface IotDeviceModbusConfigFormProps {
  open: boolean
  initialData?: IotDeviceModbusConfigVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotDeviceModbusConfigForm({ open, initialData, onClose, onSuccess }: IotDeviceModbusConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    product_id: initialData?.product_id ?? undefined,
    device_id: initialData?.device_id ?? undefined,
    ip: initialData?.ip ?? "",
    port: initialData?.port ?? undefined,
    slave_id: initialData?.slave_id ?? undefined,
    timeout: initialData?.timeout ?? undefined,
    retry_interval: initialData?.retry_interval ?? undefined,
    mode: initialData?.mode ?? undefined,
    frame_format: initialData?.frame_format ?? undefined,
    status: initialData?.status ?? undefined,
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
        await IotDeviceModbusConfigApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotDeviceModbusConfigApi.create(formData as IotDeviceModbusConfigCreateDTO)
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
            {isEdit ? "编辑IotDeviceModbusConfig（源框架导入）" : "新增IotDeviceModbusConfig（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
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
          <label className="block text-xs text-slate-600 mb-1">Modbus 服务器 IP 地址</label>
          <input
            type="text"
            value={formData.ip ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, ip: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入Modbus 服务器 IP 地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">Modbus 服务器端口</label>
          <input
            type="number"
            value={formData.port != null ? String(formData.port) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, port: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入Modbus 服务器端口"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">从站地址</label>
          <input
            type="number"
            value={formData.slave_id != null ? String(formData.slave_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, slave_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入从站地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">连接超时时间，单位：毫秒</label>
          <input
            type="number"
            value={formData.timeout != null ? String(formData.timeout) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, timeout: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入连接超时时间，单位：毫秒"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">重试间隔，单位：毫秒</label>
          <input
            type="number"
            value={formData.retry_interval != null ? String(formData.retry_interval) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, retry_interval: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入重试间隔，单位：毫秒"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">模式</label>
          <input
            type="number"
            value={formData.mode != null ? String(formData.mode) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mode: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">数据帧格式</label>
          <input
            type="number"
            value={formData.frame_format != null ? String(formData.frame_format) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, frame_format: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据帧格式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
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
