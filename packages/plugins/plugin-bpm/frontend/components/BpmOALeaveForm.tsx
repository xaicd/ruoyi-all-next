"use client"

import React, { useState, useEffect } from "react"
import { BpmOALeaveApi } from "../api/bpm-oaleave.api"
import type { BpmOALeaveCreateDTO, BpmOALeaveVO } from "@/modules/bpm/backend/types/bpm-oaleave.types"

interface BpmOALeaveFormProps {
  open: boolean
  initialData?: BpmOALeaveVO | null
  onClose: () => void
  onSuccess: () => void
}

export function BpmOALeaveForm({ open, initialData, onClose, onSuccess }: BpmOALeaveFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    user_id: initialData?.user_id ?? undefined,
    type: initialData?.type ?? undefined,
    reason: initialData?.reason ?? "",
    start_time: initialData?.start_time ?? "",
    end_time: initialData?.end_time ?? "",
    day: initialData?.day ?? undefined,
    status: initialData?.status ?? undefined,
    process_instance_id: initialData?.process_instance_id ?? "",
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
        await BpmOALeaveApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await BpmOALeaveApi.create(formData as BpmOALeaveCreateDTO)
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
            {isEdit ? "编辑BpmOALeave（源框架导入）" : "新增BpmOALeave（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">申请人的用户编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入申请人的用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">请假类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入请假类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">原因</label>
          <input
            type="text"
            value={formData.reason ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入原因"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">开始时间</label>
          <input
            type="text"
            value={formData.start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入开始时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">结束时间</label>
          <input
            type="text"
            value={formData.end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">请假天数</label>
          <input
            type="number"
            value={formData.day != null ? String(formData.day) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, day: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入请假天数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">审批结果</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入审批结果"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">对应的流程编号</label>
          <input
            type="text"
            value={formData.process_instance_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_instance_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入对应的流程编号"
            
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
