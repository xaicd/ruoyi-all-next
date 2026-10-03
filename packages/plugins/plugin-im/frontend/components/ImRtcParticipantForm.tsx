"use client"

import React, { useState, useEffect } from "react"
import { ImRtcParticipantApi } from "../api/im-rtc-participant.api"
import type { ImRtcParticipantCreateDTO, ImRtcParticipantVO } from "@/modules/im/backend/types/im-rtc-participant.types"

interface ImRtcParticipantFormProps {
  open: boolean
  initialData?: ImRtcParticipantVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ImRtcParticipantForm({ open, initialData, onClose, onSuccess }: ImRtcParticipantFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    call_id: initialData?.call_id ?? undefined,
    room: initialData?.room ?? "",
    user_id: initialData?.user_id ?? undefined,
    role: initialData?.role ?? undefined,
    status: initialData?.status ?? undefined,
    invite_time: initialData?.invite_time ?? "",
    accept_time: initialData?.accept_time ?? "",
    leave_time: initialData?.leave_time ?? "",
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
        await ImRtcParticipantApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ImRtcParticipantApi.create(formData as ImRtcParticipantCreateDTO)
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
            {isEdit ? "编辑ImRtcParticipant（源框架导入）" : "新增ImRtcParticipant（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">通话编号</label>
          <input
            type="number"
            value={formData.call_id != null ? String(formData.call_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, call_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入通话编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">业务通话编号</label>
          <input
            type="text"
            value={formData.room ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, room: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入业务通话编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">参与者用户编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入参与者用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">参与角色</label>
          <input
            type="number"
            value={formData.role != null ? String(formData.role) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入参与角色"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">参与状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入参与状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">被邀请时间；发起人取通话 startTime</label>
          <input
            type="text"
            value={formData.invite_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, invite_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入被邀请时间；发起人取通话 startTime"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">接听时间；未接听 NULL</label>
          <input
            type="text"
            value={formData.accept_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, accept_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入接听时间；未接听 NULL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">离开时间；未加入 NULL</label>
          <input
            type="text"
            value={formData.leave_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, leave_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入离开时间；未加入 NULL"
            
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
