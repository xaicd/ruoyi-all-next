"use client"

import React, { useState, useEffect } from "react"
import { AiMusicApi } from "../api/ai-music.api"
import type { AiMusicCreateDTO, AiMusicVO } from "@/modules/ai/backend/types/ai-music.types"

interface AiMusicFormProps {
  open: boolean
  initialData?: AiMusicVO | null
  onClose: () => void
  onSuccess: () => void
}

export function AiMusicForm({ open, initialData, onClose, onSuccess }: AiMusicFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    user_id: initialData?.user_id ?? undefined,
    title: initialData?.title ?? "",
    lyric: initialData?.lyric ?? "",
    image_url: initialData?.image_url ?? "",
    audio_url: initialData?.audio_url ?? "",
    video_url: initialData?.video_url ?? "",
    status: initialData?.status ?? undefined,
    generate_mode: initialData?.generate_mode ?? undefined,
    description: initialData?.description ?? "",
    platform: initialData?.platform ?? "",
    model: initialData?.model ?? "",
    tags: initialData?.tags ?? "",
    duration: initialData?.duration ?? undefined,
    public_status: initialData?.public_status ?? false,
    task_id: initialData?.task_id ?? "",
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
        await AiMusicApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await AiMusicApi.create(formData as AiMusicCreateDTO)
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
            {isEdit ? "编辑AiMusic（源框架导入）" : "新增AiMusic（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">音乐名称</label>
          <input
            type="text"
            value={formData.title ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入音乐名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">歌词</label>
          <input
            type="text"
            value={formData.lyric ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, lyric: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入歌词"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">图片地址</label>
          <input
            type="text"
            value={formData.image_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入图片地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">音频地址</label>
          <input
            type="text"
            value={formData.audio_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, audio_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入音频地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">视频地址</label>
          <input
            type="text"
            value={formData.video_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入视频地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">音乐状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入音乐状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">生成模式</label>
          <input
            type="number"
            value={formData.generate_mode != null ? String(formData.generate_mode) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, generate_mode: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入生成模式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">描述词</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入描述词"
            
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
          <label className="block text-xs text-slate-600 mb-1">音乐风格标签</label>
          <input
            type="text"
            value={formData.tags ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入音乐风格标签"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">音乐时长</label>
          <input
            type="number"
            value={formData.duration != null ? String(formData.duration) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入音乐时长"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="public_status"
            checked={Boolean(formData.public_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, public_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="public_status" className="text-xs text-slate-700 font-medium">是否公开</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">任务编号</label>
          <input
            type="text"
            value={formData.task_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, task_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入任务编号"
            
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
