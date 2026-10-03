"use client"

import React, { useState, useEffect } from "react"
import { MesMdWorkstationApi } from "../api/mes-md-workstation.api"
import type { MesMdWorkstationCreateDTO, MesMdWorkstationVO } from "@/modules/mes/backend/types/mes-md-workstation.types"

interface MesMdWorkstationFormProps {
  open: boolean
  initialData?: MesMdWorkstationVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesMdWorkstationForm({ open, initialData, onClose, onSuccess }: MesMdWorkstationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    address: initialData?.address ?? "",
    workshop_id: initialData?.workshop_id ?? undefined,
    process_id: initialData?.process_id ?? undefined,
    warehouse_id: initialData?.warehouse_id ?? undefined,
    location_id: initialData?.location_id ?? undefined,
    area_id: initialData?.area_id ?? undefined,
    status: initialData?.status ?? undefined,
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
        await MesMdWorkstationApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesMdWorkstationApi.create(formData as MesMdWorkstationCreateDTO)
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
            {isEdit ? "编辑MesMdWorkstation（源框架导入）" : "新增MesMdWorkstation（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">工作站编码</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工作站编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工作站名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工作站名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工作站地点</label>
          <input
            type="text"
            value={formData.address ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工作站地点"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">所在车间编号</label>
          <input
            type="number"
            value={formData.workshop_id != null ? String(formData.workshop_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, workshop_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入所在车间编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工序编号</label>
          <input
            type="number"
            value={formData.process_id != null ? String(formData.process_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工序编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">线边库编号</label>
          <input
            type="number"
            value={formData.warehouse_id != null ? String(formData.warehouse_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, warehouse_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入线边库编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">库位编号</label>
          <input
            type="number"
            value={formData.area_id != null ? String(formData.area_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, area_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入库位编号"
            
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
