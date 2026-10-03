"use client"

import React, { useState, useEffect } from "react"
import { MesDvMaintenRecordLineApi } from "../api/mes-dv-mainten-record-line.api"
import type { MesDvMaintenRecordLineCreateDTO, MesDvMaintenRecordLineVO } from "@/modules/mes/backend/types/mes-dv-mainten-record-line.types"

interface MesDvMaintenRecordLineFormProps {
  open: boolean
  initialData?: MesDvMaintenRecordLineVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesDvMaintenRecordLineForm({ open, initialData, onClose, onSuccess }: MesDvMaintenRecordLineFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    record_id: initialData?.record_id ?? undefined,
    subject_id: initialData?.subject_id ?? undefined,
    status: initialData?.status ?? undefined,
    result: initialData?.result ?? "",
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
        await MesDvMaintenRecordLineApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesDvMaintenRecordLineApi.create(formData as MesDvMaintenRecordLineCreateDTO)
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
            {isEdit ? "编辑MesDvMaintenRecordLine（源框架导入）" : "新增MesDvMaintenRecordLine（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">保养记录编号</label>
          <input
            type="number"
            value={formData.record_id != null ? String(formData.record_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, record_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入保养记录编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">项目编号</label>
          <input
            type="number"
            value={formData.subject_id != null ? String(formData.subject_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入项目编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">保养结果</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入保养结果"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">异常描述</label>
          <input
            type="text"
            value={formData.result ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, result: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入异常描述"
            
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
