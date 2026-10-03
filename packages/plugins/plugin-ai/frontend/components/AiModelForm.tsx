"use client"

import React, { useState, useEffect } from "react"
import { AiModelApi } from "../api/ai-model.api"
import type { AiModelCreateDTO, AiModelVO } from "@/modules/ai/backend/types/ai-model.types"

interface AiModelFormProps {
  open: boolean
  initialData?: AiModelVO | null
  onClose: () => void
  onSuccess: () => void
}

export function AiModelForm({ open, initialData, onClose, onSuccess }: AiModelFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    key_id: initialData?.key_id ?? undefined,
    name: initialData?.name ?? "",
    model: initialData?.model ?? "",
    platform: initialData?.platform ?? "",
    type: initialData?.type ?? undefined,
    sort: initialData?.sort ?? undefined,
    status: initialData?.status ?? undefined,
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
        await AiModelApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await AiModelApi.create(formData as AiModelCreateDTO)
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
            {isEdit ? "编辑AiModel（源框架导入）" : "新增AiModel（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">API 秘钥编号</label>
          <input
            type="number"
            value={formData.key_id != null ? String(formData.key_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, key_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入API 秘钥编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">模型名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模型名称"
            
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
          <label className="block text-xs text-slate-600 mb-1">类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">排序值</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序值"
            
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
