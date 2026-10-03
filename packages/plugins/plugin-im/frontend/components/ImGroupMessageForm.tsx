"use client"

import React, { useState, useEffect } from "react"
import { ImGroupMessageApi } from "../api/im-group-message.api"
import type { ImGroupMessageCreateDTO, ImGroupMessageVO } from "@/modules/im/backend/types/im-group-message.types"

interface ImGroupMessageFormProps {
  open: boolean
  initialData?: ImGroupMessageVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ImGroupMessageForm({ open, initialData, onClose, onSuccess }: ImGroupMessageFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    client_message_id: initialData?.client_message_id ?? "",
    sender_id: initialData?.sender_id ?? undefined,
    group_id: initialData?.group_id ?? undefined,
    type: initialData?.type ?? undefined,
    content: initialData?.content ?? "",
    status: initialData?.status ?? undefined,
    send_time: initialData?.send_time ?? "",
    receiver_user_ids: initialData?.receiver_user_ids ?? "",
    at_user_ids: initialData?.at_user_ids ?? "",
    receipt_status: initialData?.receipt_status ?? undefined,
    read_count: initialData?.read_count ?? undefined,
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
        await ImGroupMessageApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ImGroupMessageApi.create(formData as ImGroupMessageCreateDTO)
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
            {isEdit ? "编辑ImGroupMessage（源框架导入）" : "新增ImGroupMessage（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">客户端消息编号，用于发送幂等</label>
          <input
            type="text"
            value={formData.client_message_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, client_message_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户端消息编号，用于发送幂等"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">发送人编号</label>
          <input
            type="number"
            value={formData.sender_id != null ? String(formData.sender_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sender_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发送人编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">群编号</label>
          <input
            type="number"
            value={formData.group_id != null ? String(formData.group_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, group_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入群编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">消息内容，JSON 格式</label>
          <input
            type="text"
            value={formData.content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息内容，JSON 格式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息状态"
            
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

        <div>
          <label className="block text-xs text-slate-600 mb-1">定向接收用户编号列表，以逗号分隔</label>
          <input
            type="text"
            value={formData.receiver_user_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receiver_user_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入定向接收用户编号列表，以逗号分隔"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">@ 目标用户编号列表，以逗号分隔</label>
          <input
            type="text"
            value={formData.at_user_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, at_user_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入@ 目标用户编号列表，以逗号分隔"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回执状态</label>
          <input
            type="number"
            value={formData.receipt_status != null ? String(formData.receipt_status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receipt_status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回执状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">离线拉取等场景下回算的已读人数</label>
          <input
            type="number"
            value={formData.read_count != null ? String(formData.read_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, read_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入离线拉取等场景下回算的已读人数"
            
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
