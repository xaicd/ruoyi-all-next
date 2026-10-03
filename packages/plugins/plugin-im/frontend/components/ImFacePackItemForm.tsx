"use client"

import React, { useState, useEffect } from "react"
import { ImFacePackItemApi } from "../api/im-face-pack-item.api"
import type { ImFacePackItemCreateDTO, ImFacePackItemVO } from "@/modules/im/backend/types/im-face-pack-item.types"

interface ImFacePackItemFormProps {
  open: boolean
  initialData?: ImFacePackItemVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ImFacePackItemForm({ open, initialData, onClose, onSuccess }: ImFacePackItemFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    pack_id: initialData?.pack_id ?? undefined,
    url: initialData?.url ?? "",
    name: initialData?.name ?? "",
    width: initialData?.width ?? undefined,
    height: initialData?.height ?? undefined,
    sort: initialData?.sort ?? undefined,
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
        await ImFacePackItemApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ImFacePackItemApi.create(formData as ImFacePackItemCreateDTO)
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
            {isEdit ? "编辑ImFacePackItem（源框架导入）" : "新增ImFacePackItem（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">所属表情包编号</label>
          <input
            type="number"
            value={formData.pack_id != null ? String(formData.pack_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pack_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入所属表情包编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">表情图 URL</label>
          <input
            type="text"
            value={formData.url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入表情图 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">表情名（可选；如「狗头」「捂脸」）</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入表情名（可选；如「狗头」「捂脸」）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渲染宽度（像素）</label>
          <input
            type="number"
            value={formData.width != null ? String(formData.width) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, width: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渲染宽度（像素）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">渲染高度（像素）</label>
          <input
            type="number"
            value={formData.height != null ? String(formData.height) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入渲染高度（像素）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">排序</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序"
            
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
