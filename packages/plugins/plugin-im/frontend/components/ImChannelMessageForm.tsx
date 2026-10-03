"use client"

import React, { useState, useEffect } from "react"
import { ImChannelMessageApi } from "../api/im-channel-message.api"
import type { ImChannelMessageCreateDTO, ImChannelMessageVO } from "@/modules/im/backend/types/im-channel-message.types"

interface ImChannelMessageFormProps {
  open: boolean
  initialData?: ImChannelMessageVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ImChannelMessageForm({ open, initialData, onClose, onSuccess }: ImChannelMessageFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    channel_id: initialData?.channel_id ?? undefined,
    material_id: initialData?.material_id ?? undefined,
    type: initialData?.type ?? undefined,
    content: initialData?.content ?? "",
    receiver_user_ids: initialData?.receiver_user_ids ?? "",
    send_time: initialData?.send_time ?? "",
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
        await ImChannelMessageApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ImChannelMessageApi.create(formData as ImChannelMessageCreateDTO)
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
            {isEdit ? "编辑ImChannelMessage（源框架导入）" : "新增ImChannelMessage（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">频道编号</label>
          <input
            type="number"
            value={formData.channel_id != null ? String(formData.channel_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, channel_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入频道编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">关联素材编号</label>
          <input
            type="number"
            value={formData.material_id != null ? String(formData.material_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, material_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入关联素材编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息内容；推送时 payload 的 JSON 快照</label>
          <input
            type="text"
            value={formData.content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息内容；推送时 payload 的 JSON 快照"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">接收人编号列表；为空表示全员</label>
          <input
            type="text"
            value={formData.receiver_user_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receiver_user_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入接收人编号列表；为空表示全员"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">发送时间</label>
          <input
            type="text"
            value={formData.send_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, send_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发送时间"
            
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
