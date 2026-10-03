"use client"

import React, { useState, useEffect } from "react"
import { IotDeviceModbusPointApi } from "../api/iot-device-modbus-point.api"
import type { IotDeviceModbusPointCreateDTO, IotDeviceModbusPointVO } from "@/modules/iot/backend/types/iot-device-modbus-point.types"

interface IotDeviceModbusPointFormProps {
  open: boolean
  initialData?: IotDeviceModbusPointVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotDeviceModbusPointForm({ open, initialData, onClose, onSuccess }: IotDeviceModbusPointFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    device_id: initialData?.device_id ?? undefined,
    thing_model_id: initialData?.thing_model_id ?? undefined,
    identifier: initialData?.identifier ?? "",
    name: initialData?.name ?? "",
    function_code: initialData?.function_code ?? undefined,
    register_address: initialData?.register_address ?? undefined,
    register_count: initialData?.register_count ?? undefined,
    byte_order: initialData?.byte_order ?? "",
    raw_data_type: initialData?.raw_data_type ?? "",
    scale: initialData?.scale ?? undefined,
    poll_interval: initialData?.poll_interval ?? undefined,
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
        await IotDeviceModbusPointApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotDeviceModbusPointApi.create(formData as IotDeviceModbusPointCreateDTO)
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
            {isEdit ? "编辑IotDeviceModbusPoint（源框架导入）" : "新增IotDeviceModbusPoint（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
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
          <label className="block text-xs text-slate-600 mb-1">物模型属性编号</label>
          <input
            type="number"
            value={formData.thing_model_id != null ? String(formData.thing_model_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, thing_model_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物模型属性编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">属性标识符</label>
          <input
            type="text"
            value={formData.identifier ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, identifier: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入属性标识符"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">属性名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入属性名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">Modbus 功能码</label>
          <input
            type="number"
            value={formData.function_code != null ? String(formData.function_code) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, function_code: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入Modbus 功能码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">寄存器起始地址</label>
          <input
            type="number"
            value={formData.register_address != null ? String(formData.register_address) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, register_address: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入寄存器起始地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">寄存器数量</label>
          <input
            type="number"
            value={formData.register_count != null ? String(formData.register_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, register_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入寄存器数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">字节序</label>
          <input
            type="text"
            value={formData.byte_order ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, byte_order: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入字节序"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">原始数据类型</label>
          <input
            type="text"
            value={formData.raw_data_type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, raw_data_type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入原始数据类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">缩放因子</label>
          <input
            type="number"
            value={formData.scale != null ? String(formData.scale) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, scale: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入缩放因子"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">轮询间隔（毫秒）</label>
          <input
            type="number"
            value={formData.poll_interval != null ? String(formData.poll_interval) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, poll_interval: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入轮询间隔（毫秒）"
            
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
