"use client"

import React, { useState, useEffect } from "react"
import { AiKnowledgeDocumentApi } from "../api/ai-knowledge-document.api"
import type { AiKnowledgeDocumentCreateDTO, AiKnowledgeDocumentVO } from "@/modules/ai/backend/types/ai-knowledge-document.types"

interface AiKnowledgeDocumentFormProps {
  open: boolean
  initialData?: AiKnowledgeDocumentVO | null
  onClose: () => void
  onSuccess: () => void
}

export function AiKnowledgeDocumentForm({ open, initialData, onClose, onSuccess }: AiKnowledgeDocumentFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    knowledge_id: initialData?.knowledge_id ?? undefined,
    name: initialData?.name ?? "",
    url: initialData?.url ?? "",
    content: initialData?.content ?? "",
    content_length: initialData?.content_length ?? undefined,
    tokens: initialData?.tokens ?? undefined,
    segment_max_tokens: initialData?.segment_max_tokens ?? undefined,
    retrieval_count: initialData?.retrieval_count ?? undefined,
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
        await AiKnowledgeDocumentApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await AiKnowledgeDocumentApi.create(formData as AiKnowledgeDocumentCreateDTO)
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
            {isEdit ? "编辑AiKnowledgeDocument（源框架导入）" : "新增AiKnowledgeDocument（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">知识库编号</label>
          <input
            type="number"
            value={formData.knowledge_id != null ? String(formData.knowledge_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, knowledge_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入知识库编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文档名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文档名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文件 URL</label>
          <input
            type="text"
            value={formData.url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文件 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">内容</label>
          <input
            type="text"
            value={formData.content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文档长度</label>
          <input
            type="number"
            value={formData.content_length != null ? String(formData.content_length) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content_length: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文档长度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文档 token 数量</label>
          <input
            type="number"
            value={formData.tokens != null ? String(formData.tokens) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, tokens: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文档 token 数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">分片最大 Token 数</label>
          <input
            type="number"
            value={formData.segment_max_tokens != null ? String(formData.segment_max_tokens) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, segment_max_tokens: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分片最大 Token 数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">召回次数</label>
          <input
            type="number"
            value={formData.retrieval_count != null ? String(formData.retrieval_count) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, retrieval_count: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入召回次数"
            
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
