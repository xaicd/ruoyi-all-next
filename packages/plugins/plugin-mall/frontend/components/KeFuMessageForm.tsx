"use client"

import React, { useState, useEffect } from "react"
import { KeFuMessageApi } from "../api/ke-fu-message.api"
import type { KeFuMessageCreateDTO, KeFuMessageVO } from "@/modules/mall/backend/types/ke-fu-message.types"

interface KeFuMessageFormProps {
  open: boolean
  initialData?: KeFuMessageVO | null
  onClose: () => void
  onSuccess: () => void
}

export function KeFuMessageForm({ open, initialData, onClose, onSuccess }: KeFuMessageFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    conversation_id: initialData?.conversation_id ?? undefined,
    sender_id: initialData?.sender_id ?? undefined,
    sender_type: initialData?.sender_type ?? undefined,
    receiver_id: initialData?.receiver_id ?? undefined,
    receiver_type: initialData?.receiver_type ?? undefined,
    content_type: initialData?.content_type ?? undefined,
    content: initialData?.content ?? "",
    read_status: initialData?.read_status ?? false,
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
        await KeFuMessageApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await KeFuMessageApi.create(formData as KeFuMessageCreateDTO)
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
            {isEdit ? "编辑KeFuMessage（源框架导入）" : "新增KeFuMessage（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">会话编号</label>
          <input
            type="number"
            value={formData.conversation_id != null ? String(formData.conversation_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, conversation_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入会话编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">发送人类型</label>
          <input
            type="number"
            value={formData.sender_type != null ? String(formData.sender_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sender_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发送人类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">接收人编号</label>
          <input
            type="number"
            value={formData.receiver_id != null ? String(formData.receiver_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receiver_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入接收人编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">接收人类型</label>
          <input
            type="number"
            value={formData.receiver_type != null ? String(formData.receiver_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receiver_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入接收人类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息类型</label>
          <input
            type="number"
            value={formData.content_type != null ? String(formData.content_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息</label>
          <input
            type="text"
            value={formData.content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="read_status"
            checked={Boolean(formData.read_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, read_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="read_status" className="text-xs text-slate-700 font-medium">是/否已读</label>
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
