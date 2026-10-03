"use client"

import React, { useState, useEffect } from "react"
import { AiChatConversationApi } from "../api/ai-chat-conversation.api"
import type { AiChatConversationCreateDTO, AiChatConversationVO } from "@/modules/ai/backend/types/ai-chat-conversation.types"

interface AiChatConversationFormProps {
  open: boolean
  initialData?: AiChatConversationVO | null
  onClose: () => void
  onSuccess: () => void
}

export function AiChatConversationForm({ open, initialData, onClose, onSuccess }: AiChatConversationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    user_id: initialData?.user_id ?? undefined,
    title: initialData?.title ?? "",
    pinned: initialData?.pinned ?? false,
    pinned_time: initialData?.pinned_time ?? "",
    role_id: initialData?.role_id ?? undefined,
    model_id: initialData?.model_id ?? undefined,
    model: initialData?.model ?? "",
    system_message: initialData?.system_message ?? "",
    temperature: initialData?.temperature ?? undefined,
    max_tokens: initialData?.max_tokens ?? undefined,
    max_contexts: initialData?.max_contexts ?? undefined,
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
        await AiChatConversationApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await AiChatConversationApi.create(formData as AiChatConversationCreateDTO)
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
            {isEdit ? "编辑AiChatConversation（源框架导入）" : "新增AiChatConversation（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">用户编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">对话标题</label>
          <input
            type="text"
            value={formData.title ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入对话标题"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="pinned"
            checked={Boolean(formData.pinned)}
            onChange={(e) => setFormData((prev) => ({ ...prev, pinned: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="pinned" className="text-xs text-slate-700 font-medium">是否置顶</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">置顶时间</label>
          <input
            type="text"
            value={formData.pinned_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pinned_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入置顶时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">角色编号</label>
          <input
            type="number"
            value={formData.role_id != null ? String(formData.role_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, role_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入角色编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">模型编号</label>
          <input
            type="number"
            value={formData.model_id != null ? String(formData.model_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, model_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模型编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">模型标志</label>
          <input
            type="text"
            value={formData.model ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模型标志"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">角色设定</label>
          <input
            type="text"
            value={formData.system_message ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, system_message: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入角色设定"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">温度参数</label>
          <input
            type="number"
            value={formData.temperature != null ? String(formData.temperature) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, temperature: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入温度参数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">单条回复的最大 Token 数量</label>
          <input
            type="number"
            value={formData.max_tokens != null ? String(formData.max_tokens) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, max_tokens: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入单条回复的最大 Token 数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">上下文的最大 Message 数量</label>
          <input
            type="number"
            value={formData.max_contexts != null ? String(formData.max_contexts) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, max_contexts: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入上下文的最大 Message 数量"
            
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
