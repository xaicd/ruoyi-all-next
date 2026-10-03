"use client"

import React, { useState, useEffect } from "react"
import { ImRtcCallApi } from "../api/im-rtc-call.api"
import type { ImRtcCallCreateDTO, ImRtcCallVO } from "@/modules/im/backend/types/im-rtc-call.types"

interface ImRtcCallFormProps {
  open: boolean
  initialData?: ImRtcCallVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ImRtcCallForm({ open, initialData, onClose, onSuccess }: ImRtcCallFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    room: initialData?.room ?? "",
    conversation_type: initialData?.conversation_type ?? undefined,
    media_type: initialData?.media_type ?? undefined,
    inviter_user_id: initialData?.inviter_user_id ?? undefined,
    group_id: initialData?.group_id ?? undefined,
    status: initialData?.status ?? undefined,
    end_reason: initialData?.end_reason ?? undefined,
    start_time: initialData?.start_time ?? "",
    accept_time: initialData?.accept_time ?? "",
    end_time: initialData?.end_time ?? "",
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
        await ImRtcCallApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ImRtcCallApi.create(formData as ImRtcCallCreateDTO)
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
            {isEdit ? "编辑ImRtcCall（源框架导入）" : "新增ImRtcCall（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">业务通话编号（UUID，同时作为 LiveKit 房间名）；唯一</label>
          <input
            type="text"
            value={formData.room ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, room: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入业务通话编号（UUID，同时作为 LiveKit 房间名）；唯一"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">会话类型</label>
          <input
            type="number"
            value={formData.conversation_type != null ? String(formData.conversation_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, conversation_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入会话类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">媒体类型</label>
          <input
            type="number"
            value={formData.media_type != null ? String(formData.media_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, media_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入媒体类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">发起人用户编号</label>
          <input
            type="number"
            value={formData.inviter_user_id != null ? String(formData.inviter_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, inviter_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发起人用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">群编号；私聊为 NULL</label>
          <input
            type="number"
            value={formData.group_id != null ? String(formData.group_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, group_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入群编号；私聊为 NULL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">通话状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入通话状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">结束原因；通话未结束时为 NULL</label>
          <input
            type="number"
            value={formData.end_reason != null ? String(formData.end_reason) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_reason: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入结束原因；通话未结束时为 NULL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">发起时间</label>
          <input
            type="text"
            value={formData.start_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发起时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">接通时间</label>
          <input
            type="text"
            value={formData.accept_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, accept_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入接通时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">通话结束时间</label>
          <input
            type="text"
            value={formData.end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入通话结束时间"
            
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
