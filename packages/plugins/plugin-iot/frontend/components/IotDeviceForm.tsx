"use client"

import React, { useState, useEffect } from "react"
import { IotDeviceApi } from "../api/iot-device.api"
import type { IotDeviceCreateDTO, IotDeviceVO } from "@/modules/iot/backend/types/iot-device.types"

interface IotDeviceFormProps {
  open: boolean
  initialData?: IotDeviceVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotDeviceForm({ open, initialData, onClose, onSuccess }: IotDeviceFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    device_name: initialData?.device_name ?? "",
    nickname: initialData?.nickname ?? "",
    serial_number: initialData?.serial_number ?? "",
    pic_url: initialData?.pic_url ?? "",
    group_ids: initialData?.group_ids ?? "",
    product_id: initialData?.product_id ?? undefined,
    product_key: initialData?.product_key ?? "",
    device_type: initialData?.device_type ?? undefined,
    gateway_id: initialData?.gateway_id ?? undefined,
    state: initialData?.state ?? undefined,
    online_time: initialData?.online_time ?? "",
    offline_time: initialData?.offline_time ?? "",
    active_time: initialData?.active_time ?? "",
    firmware_id: initialData?.firmware_id ?? undefined,
    device_secret: initialData?.device_secret ?? "",
    latitude: initialData?.latitude ?? undefined,
    longitude: initialData?.longitude ?? undefined,
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
        await IotDeviceApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotDeviceApi.create(formData as IotDeviceCreateDTO)
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
            {isEdit ? "编辑IotDevice（源框架导入）" : "新增IotDevice（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">设备名称，在产品内唯一，用于标识设备</label>
          <input
            type="text"
            value={formData.device_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, device_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备名称，在产品内唯一，用于标识设备"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备备注名称</label>
          <input
            type="text"
            value={formData.nickname ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备备注名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备序列号</label>
          <input
            type="text"
            value={formData.serial_number ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, serial_number: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备序列号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备图片</label>
          <input
            type="text"
            value={formData.pic_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备图片"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备分组编号集合</label>
          <input
            type="text"
            value={formData.group_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, group_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备分组编号集合"
            
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
          <label className="block text-xs text-slate-600 mb-1">产品标识</label>
          <input
            type="text"
            value={formData.product_key ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_key: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品标识"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备类型</label>
          <input
            type="number"
            value={formData.device_type != null ? String(formData.device_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, device_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">网关设备编号</label>
          <input
            type="number"
            value={formData.gateway_id != null ? String(formData.gateway_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, gateway_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入网关设备编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备状态</label>
          <input
            type="number"
            value={formData.state != null ? String(formData.state) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最后上线时间</label>
          <input
            type="text"
            value={formData.online_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, online_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最后上线时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最后离线时间</label>
          <input
            type="text"
            value={formData.offline_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, offline_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最后离线时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备激活时间</label>
          <input
            type="text"
            value={formData.active_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, active_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备激活时间"
            
          />
        </div>

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
          <label className="block text-xs text-slate-600 mb-1">设备密钥，用于设备认证</label>
          <input
            type="text"
            value={formData.device_secret ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, device_secret: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备密钥，用于设备认证"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备位置的纬度</label>
          <input
            type="number"
            value={formData.latitude != null ? String(formData.latitude) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, latitude: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备位置的纬度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备位置的经度</label>
          <input
            type="number"
            value={formData.longitude != null ? String(formData.longitude) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, longitude: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备位置的经度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备配置</label>
          <input
            type="text"
            value={formData.config ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, config: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备配置"
            
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
