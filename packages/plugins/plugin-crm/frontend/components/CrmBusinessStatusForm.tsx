"use client"

import React, { useState, useEffect } from "react"
import { CrmBusinessStatusApi } from "../api/crm-business-status.api"
import type { CrmBusinessStatusCreateDTO, CrmBusinessStatusVO } from "@/modules/crm/backend/types/crm-business-status.types"

interface CrmBusinessStatusFormProps {
  open: boolean
  initialData?: CrmBusinessStatusVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmBusinessStatusForm({ open, initialData, onClose, onSuccess }: CrmBusinessStatusFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    type_id: initialData?.type_id ?? undefined,
    name: initialData?.name ?? "",
    percent: initialData?.percent ?? undefined,
    sort: initialData?.sort ?? undefined,
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
        await CrmBusinessStatusApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmBusinessStatusApi.create(formData as CrmBusinessStatusCreateDTO)
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
            {isEdit ? "编辑CrmBusinessStatus（源框架导入）" : "新增CrmBusinessStatus（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">状态类型编号</label>
          <input
            type="number"
            value={formData.type_id != null ? String(formData.type_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态类型编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">状态名</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态名"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">赢单率，百分比</label>
          <input
            type="number"
            value={formData.percent != null ? String(formData.percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入赢单率，百分比"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">排序</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序"
            
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
