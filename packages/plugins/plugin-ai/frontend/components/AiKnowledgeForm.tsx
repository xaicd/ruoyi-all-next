"use client"

import React, { useState, useEffect } from "react"
import { AiKnowledgeApi } from "../api/ai-knowledge.api"
import type { AiKnowledgeCreateDTO, AiKnowledgeVO } from "@/modules/ai/backend/types/ai-knowledge.types"

interface AiKnowledgeFormProps {
  open: boolean
  initialData?: AiKnowledgeVO | null
  onClose: () => void
  onSuccess: () => void
}

export function AiKnowledgeForm({ open, initialData, onClose, onSuccess }: AiKnowledgeFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    embedding_model_id: initialData?.embedding_model_id ?? undefined,
    embedding_model: initialData?.embedding_model ?? "",
    top_k: initialData?.top_k ?? undefined,
    similarity_threshold: initialData?.similarity_threshold ?? undefined,
    status: initialData?.status ?? undefined,
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
        await AiKnowledgeApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await AiKnowledgeApi.create(formData as AiKnowledgeCreateDTO)
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
            {isEdit ? "编辑AiKnowledge（源框架导入）" : "新增AiKnowledge（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">知识库名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入知识库名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">知识库描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入知识库描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">向量模型编号</label>
          <input
            type="number"
            value={formData.embedding_model_id != null ? String(formData.embedding_model_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, embedding_model_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入向量模型编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">模型标识</label>
          <input
            type="text"
            value={formData.embedding_model ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, embedding_model: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模型标识"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">topK</label>
          <input
            type="number"
            value={formData.top_k != null ? String(formData.top_k) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, top_k: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入topK"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">相似度阈值</label>
          <input
            type="number"
            value={formData.similarity_threshold != null ? String(formData.similarity_threshold) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, similarity_threshold: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入相似度阈值"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
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
