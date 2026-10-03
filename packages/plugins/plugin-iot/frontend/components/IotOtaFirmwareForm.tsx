"use client"

import React, { useState, useEffect } from "react"
import { IotOtaFirmwareApi } from "../api/iot-ota-firmware.api"
import type { IotOtaFirmwareCreateDTO, IotOtaFirmwareVO } from "@/modules/iot/backend/types/iot-ota-firmware.types"

interface IotOtaFirmwareFormProps {
  open: boolean
  initialData?: IotOtaFirmwareVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotOtaFirmwareForm({ open, initialData, onClose, onSuccess }: IotOtaFirmwareFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    version: initialData?.version ?? "",
    product_id: initialData?.product_id ?? undefined,
    file_url: initialData?.file_url ?? "",
    file_size: initialData?.file_size ?? undefined,
    file_digest_algorithm: initialData?.file_digest_algorithm ?? "",
    file_digest_value: initialData?.file_digest_value ?? "",
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
        await IotOtaFirmwareApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotOtaFirmwareApi.create(formData as IotOtaFirmwareCreateDTO)
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
            {isEdit ? "编辑IotOtaFirmware（源框架导入）" : "新增IotOtaFirmware（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">固件名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入固件名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">固件描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入固件描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">版本号</label>
          <input
            type="text"
            value={formData.version ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入版本号"
            
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
          <label className="block text-xs text-slate-600 mb-1">固件文件 URL</label>
          <input
            type="text"
            value={formData.file_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, file_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入固件文件 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">固件文件大小</label>
          <input
            type="number"
            value={formData.file_size != null ? String(formData.file_size) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, file_size: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入固件文件大小"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">固件文件签名算法</label>
          <input
            type="text"
            value={formData.file_digest_algorithm ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, file_digest_algorithm: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入固件文件签名算法"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">固件文件签名结果</label>
          <input
            type="text"
            value={formData.file_digest_value ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, file_digest_value: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入固件文件签名结果"
            
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
