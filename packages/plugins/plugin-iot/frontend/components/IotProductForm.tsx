"use client"

import React, { useState, useEffect } from "react"
import { IotProductApi } from "../api/iot-product.api"
import type { IotProductCreateDTO, IotProductVO } from "@/modules/iot/backend/types/iot-product.types"

interface IotProductFormProps {
  open: boolean
  initialData?: IotProductVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotProductForm({ open, initialData, onClose, onSuccess }: IotProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    product_key: initialData?.product_key ?? "",
    product_secret: initialData?.product_secret ?? "",
    register_enabled: initialData?.register_enabled ?? false,
    category_id: initialData?.category_id ?? undefined,
    icon: initialData?.icon ?? "",
    pic_url: initialData?.pic_url ?? "",
    description: initialData?.description ?? "",
    status: initialData?.status ?? undefined,
    device_type: initialData?.device_type ?? undefined,
    net_type: initialData?.net_type ?? undefined,
    protocol_type: initialData?.protocol_type ?? "",
    serialize_type: initialData?.serialize_type ?? "",
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
        await IotProductApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotProductApi.create(formData as IotProductCreateDTO)
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
            {isEdit ? "编辑IotProduct（源框架导入）" : "新增IotProduct（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">产品名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品名称"
            
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
          <label className="block text-xs text-slate-600 mb-1">产品密钥，用于一型一密动态注册</label>
          <input
            type="text"
            value={formData.product_secret ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_secret: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品密钥，用于一型一密动态注册"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="register_enabled"
            checked={Boolean(formData.register_enabled)}
            onChange={(e) => setFormData((prev) => ({ ...prev, register_enabled: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="register_enabled" className="text-xs text-slate-700 font-medium">是否开启动态注册</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品分类编号</label>
          <input
            type="number"
            value={formData.category_id != null ? String(formData.category_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品分类编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品图标</label>
          <input
            type="text"
            value={formData.icon ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品图标"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品图片</label>
          <input
            type="text"
            value={formData.pic_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品图片"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品状态"
            
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
          <label className="block text-xs text-slate-600 mb-1">联网方式</label>
          <input
            type="number"
            value={formData.net_type != null ? String(formData.net_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, net_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联网方式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">协议类型</label>
          <input
            type="text"
            value={formData.protocol_type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, protocol_type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入协议类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">序列化类型</label>
          <input
            type="text"
            value={formData.serialize_type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, serialize_type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入序列化类型"
            
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
