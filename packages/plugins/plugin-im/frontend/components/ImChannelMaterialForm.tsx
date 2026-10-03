"use client"

import React, { useState, useEffect } from "react"
import { ImChannelMaterialApi } from "../api/im-channel-material.api"
import type { ImChannelMaterialCreateDTO, ImChannelMaterialVO } from "@/modules/im/backend/types/im-channel-material.types"

interface ImChannelMaterialFormProps {
  open: boolean
  initialData?: ImChannelMaterialVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ImChannelMaterialForm({ open, initialData, onClose, onSuccess }: ImChannelMaterialFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    channel_id: initialData?.channel_id ?? undefined,
    type: initialData?.type ?? undefined,
    title: initialData?.title ?? "",
    cover_url: initialData?.cover_url ?? "",
    summary: initialData?.summary ?? "",
    content: initialData?.content ?? "",
    url: initialData?.url ?? "",
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
        await ImChannelMaterialApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ImChannelMaterialApi.create(formData as ImChannelMaterialCreateDTO)
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
            {isEdit ? "编辑ImChannelMaterial（源框架导入）" : "新增ImChannelMaterial（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">素材内容类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入素材内容类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">标题</label>
          <input
            type="text"
            value={formData.title ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入标题"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">封面图</label>
          <input
            type="text"
            value={formData.cover_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, cover_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入封面图"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">摘要</label>
          <input
            type="text"
            value={formData.summary ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入摘要"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">富文本 HTML；在 使用</label>
          <input
            type="text"
            value={formData.content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入富文本 HTML；在 使用"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">跳转链接；在 使用</label>
          <input
            type="text"
            value={formData.url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入跳转链接；在 使用"
            
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
