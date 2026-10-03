"use client"

import React, { useState, useEffect } from "react"
import { MesWmWarehouseAreaApi } from "../api/mes-wm-warehouse-area.api"
import type { MesWmWarehouseAreaCreateDTO, MesWmWarehouseAreaVO } from "@/modules/mes/backend/types/mes-wm-warehouse-area.types"

interface MesWmWarehouseAreaFormProps {
  open: boolean
  initialData?: MesWmWarehouseAreaVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmWarehouseAreaForm({ open, initialData, onClose, onSuccess }: MesWmWarehouseAreaFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    location_id: initialData?.location_id ?? undefined,
    area: initialData?.area ?? undefined,
    max_load: initialData?.max_load ?? undefined,
    position_x: initialData?.position_x ?? undefined,
    position_y: initialData?.position_y ?? undefined,
    position_z: initialData?.position_z ?? undefined,
    status: initialData?.status ?? undefined,
    frozen: initialData?.frozen ?? false,
    allow_item_mixing: initialData?.allow_item_mixing ?? false,
    allow_batch_mixing: initialData?.allow_batch_mixing ?? false,
    remark: initialData?.remark ?? "",
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
        await MesWmWarehouseAreaApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmWarehouseAreaApi.create(formData as MesWmWarehouseAreaCreateDTO)
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
            {isEdit ? "编辑MesWmWarehouseArea（源框架导入）" : "新增MesWmWarehouseArea（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">库位编码</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入库位编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">库位名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入库位名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">库区编号</label>
          <input
            type="number"
            value={formData.location_id != null ? String(formData.location_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, location_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入库区编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">面积</label>
          <input
            type="number"
            value={formData.area != null ? String(formData.area) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入面积"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最大载重</label>
          <input
            type="number"
            value={formData.max_load != null ? String(formData.max_load) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, max_load: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最大载重"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">位置 X</label>
          <input
            type="number"
            value={formData.position_x != null ? String(formData.position_x) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, position_x: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入位置 X"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">位置 Y</label>
          <input
            type="number"
            value={formData.position_y != null ? String(formData.position_y) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, position_y: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入位置 Y"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">位置 Z</label>
          <input
            type="number"
            value={formData.position_z != null ? String(formData.position_z) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, position_z: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入位置 Z"
            
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="frozen"
            checked={Boolean(formData.frozen)}
            onChange={(e) => setFormData((prev) => ({ ...prev, frozen: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="frozen" className="text-xs text-slate-700 font-medium">是否冻结</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allow_item_mixing"
            checked={Boolean(formData.allow_item_mixing)}
            onChange={(e) => setFormData((prev) => ({ ...prev, allow_item_mixing: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="allow_item_mixing" className="text-xs text-slate-700 font-medium">是否允许物料混放</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allow_batch_mixing"
            checked={Boolean(formData.allow_batch_mixing)}
            onChange={(e) => setFormData((prev) => ({ ...prev, allow_batch_mixing: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="allow_batch_mixing" className="text-xs text-slate-700 font-medium">是否允许批次混放</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入备注"
            
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
