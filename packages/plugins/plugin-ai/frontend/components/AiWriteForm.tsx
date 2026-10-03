"use client"

import React, { useState, useEffect } from "react"
import { AiWriteApi } from "../api/ai-write.api"
import type { AiWriteCreateDTO, AiWriteVO } from "@/modules/ai/backend/types/ai-write.types"

interface AiWriteFormProps {
  open: boolean
  initialData?: AiWriteVO | null
  onClose: () => void
  onSuccess: () => void
}

export function AiWriteForm({ open, initialData, onClose, onSuccess }: AiWriteFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    user_id: initialData?.user_id ?? undefined,
    type: initialData?.type ?? undefined,
    platform: initialData?.platform ?? "",
    model_id: initialData?.model_id ?? undefined,
    model: initialData?.model ?? "",
    prompt: initialData?.prompt ?? "",
    generated_content: initialData?.generated_content ?? "",
    original_content: initialData?.original_content ?? "",
    length: initialData?.length ?? undefined,
    format: initialData?.format ?? undefined,
    tone: initialData?.tone ?? undefined,
    language: initialData?.language ?? undefined,
    error_message: initialData?.error_message ?? "",
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
        await AiWriteApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await AiWriteApi.create(formData as AiWriteCreateDTO)
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
            {isEdit ? "编辑AiWrite（源框架导入）" : "新增AiWrite（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">写作类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入写作类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">平台</label>
          <input
            type="text"
            value={formData.platform ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入平台"
            
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
          <label className="block text-xs text-slate-600 mb-1">模型</label>
          <input
            type="text"
            value={formData.model ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生成内容提示</label>
          <input
            type="text"
            value={formData.prompt ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, prompt: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生成内容提示"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生成的内容</label>
          <input
            type="text"
            value={formData.generated_content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, generated_content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生成的内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">原文</label>
          <input
            type="text"
            value={formData.original_content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, original_content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入原文"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">长度提示词</label>
          <input
            type="number"
            value={formData.length != null ? String(formData.length) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, length: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入长度提示词"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">格式提示词</label>
          <input
            type="number"
            value={formData.format != null ? String(formData.format) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, format: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入格式提示词"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">语气提示词</label>
          <input
            type="number"
            value={formData.tone != null ? String(formData.tone) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, tone: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入语气提示词"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">语言提示词</label>
          <input
            type="number"
            value={formData.language != null ? String(formData.language) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入语言提示词"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">错误信息</label>
          <input
            type="text"
            value={formData.error_message ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, error_message: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入错误信息"
            
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
