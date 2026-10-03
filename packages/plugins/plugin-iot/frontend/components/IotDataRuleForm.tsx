"use client"

import React, { useState, useEffect } from "react"
import { IotDataRuleApi } from "../api/iot-data-rule.api"
import type { IotDataRuleCreateDTO, IotDataRuleVO } from "@/modules/iot/backend/types/iot-data-rule.types"

interface IotDataRuleFormProps {
  open: boolean
  initialData?: IotDataRuleVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotDataRuleForm({ open, initialData, onClose, onSuccess }: IotDataRuleFormProps) {
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
    source_configs: initialData?.source_configs ?? "",
    sink_ids: initialData?.sink_ids ?? "",
    method: initialData?.method ?? "",
    product_id: initialData?.product_id ?? undefined,
    device_id: initialData?.device_id ?? undefined,
    identifier: initialData?.identifier ?? "",
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
        await IotDataRuleApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotDataRuleApi.create(formData as IotDataRuleCreateDTO)
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
            {isEdit ? "编辑IotDataRule（源框架导入）" : "新增IotDataRule（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">数据流转规格名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据流转规格名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">数据流转规格描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据流转规格描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">数据流转规格状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据流转规格状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">数据源配置数组</label>
          <input
            type="text"
            value={formData.source_configs ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, source_configs: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据源配置数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">数据目的编号数组</label>
          <input
            type="text"
            value={formData.sink_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sink_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据目的编号数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息方法</label>
          <input
            type="text"
            value={formData.method ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, method: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息方法"
            
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
          <label className="block text-xs text-slate-600 mb-1">标识符</label>
          <input
            type="text"
            value={formData.identifier ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, identifier: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入标识符"
            
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
