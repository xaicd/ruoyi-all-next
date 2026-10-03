"use client"

import React, { useState, useEffect } from "react"
import { MesProRouteProcessApi } from "../api/mes-pro-route-process.api"
import type { MesProRouteProcessCreateDTO, MesProRouteProcessVO } from "@/modules/mes/backend/types/mes-pro-route-process.types"

interface MesProRouteProcessFormProps {
  open: boolean
  initialData?: MesProRouteProcessVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesProRouteProcessForm({ open, initialData, onClose, onSuccess }: MesProRouteProcessFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    route_id: initialData?.route_id ?? undefined,
    process_id: initialData?.process_id ?? undefined,
    sort: initialData?.sort ?? undefined,
    next_process_id: initialData?.next_process_id ?? undefined,
    link_type: initialData?.link_type ?? undefined,
    prepare_time: initialData?.prepare_time ?? undefined,
    wait_time: initialData?.wait_time ?? undefined,
    color_code: initialData?.color_code ?? "",
    key_flag: initialData?.key_flag ?? false,
    check_flag: initialData?.check_flag ?? false,
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
        await MesProRouteProcessApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesProRouteProcessApi.create(formData as MesProRouteProcessCreateDTO)
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
            {isEdit ? "编辑MesProRouteProcess（源框架导入）" : "新增MesProRouteProcess（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">工艺路线编号</label>
          <input
            type="number"
            value={formData.route_id != null ? String(formData.route_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, route_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工艺路线编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">序号</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入序号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">下一道工序编号</label>
          <input
            type="number"
            value={formData.next_process_id != null ? String(formData.next_process_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, next_process_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入下一道工序编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">与下一道工序关系</label>
          <input
            type="number"
            value={formData.link_type != null ? String(formData.link_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, link_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入与下一道工序关系"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">准备时间（分钟）</label>
          <input
            type="number"
            value={formData.prepare_time != null ? String(formData.prepare_time) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, prepare_time: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入准备时间（分钟）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">等待时间（分钟）</label>
          <input
            type="number"
            value={formData.wait_time != null ? String(formData.wait_time) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, wait_time: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入等待时间（分钟）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">甘特图显示颜色</label>
          <input
            type="text"
            value={formData.color_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, color_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入甘特图显示颜色"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="key_flag"
            checked={Boolean(formData.key_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, key_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="key_flag" className="text-xs text-slate-700 font-medium">是否关键工序</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="check_flag"
            checked={Boolean(formData.check_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, check_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="check_flag" className="text-xs text-slate-700 font-medium">是否质检工序</label>
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
