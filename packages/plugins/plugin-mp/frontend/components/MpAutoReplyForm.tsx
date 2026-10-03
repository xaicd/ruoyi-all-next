"use client"

import React, { useState, useEffect } from "react"
import { MpAutoReplyApi } from "../api/mp-auto-reply.api"
import type { MpAutoReplyCreateDTO, MpAutoReplyVO } from "@/modules/mp/backend/types/mp-auto-reply.types"

interface MpAutoReplyFormProps {
  open: boolean
  initialData?: MpAutoReplyVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MpAutoReplyForm({ open, initialData, onClose, onSuccess }: MpAutoReplyFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    account_id: initialData?.account_id ?? undefined,
    app_id: initialData?.app_id ?? "",
    type: initialData?.type ?? undefined,
    request_keyword: initialData?.request_keyword ?? "",
    request_match: initialData?.request_match ?? undefined,
    request_message_type: initialData?.request_message_type ?? "",
    response_message_type: initialData?.response_message_type ?? "",
    response_content: initialData?.response_content ?? "",
    response_media_id: initialData?.response_media_id ?? "",
    response_media_url: initialData?.response_media_url ?? "",
    response_title: initialData?.response_title ?? "",
    response_description: initialData?.response_description ?? "",
    response_thumb_media_id: initialData?.response_thumb_media_id ?? "",
    response_thumb_media_url: initialData?.response_thumb_media_url ?? "",
    response_articles: initialData?.response_articles ?? "",
    response_music_url: initialData?.response_music_url ?? "",
    response_hq_music_url: initialData?.response_hq_music_url ?? "",
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
        await MpAutoReplyApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MpAutoReplyApi.create(formData as MpAutoReplyCreateDTO)
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
            {isEdit ? "编辑MpAutoReply（源框架导入）" : "新增MpAutoReply（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号账号的编号</label>
          <input
            type="number"
            value={formData.account_id != null ? String(formData.account_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, account_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号账号的编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号 appId</label>
          <input
            type="text"
            value={formData.app_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, app_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号 appId"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">请求的关键字</label>
          <input
            type="text"
            value={formData.request_keyword ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, request_keyword: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入请求的关键字"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">请求的关键字的匹配</label>
          <input
            type="number"
            value={formData.request_match != null ? String(formData.request_match) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, request_match: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入请求的关键字的匹配"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">请求的消息类型</label>
          <input
            type="text"
            value={formData.request_message_type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, request_message_type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入请求的消息类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的消息类型</label>
          <input
            type="text"
            value={formData.response_message_type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_message_type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的消息类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的消息内容</label>
          <input
            type="text"
            value={formData.response_content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的消息内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的媒体 id</label>
          <input
            type="text"
            value={formData.response_media_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_media_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的媒体 id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的媒体 URL</label>
          <input
            type="text"
            value={formData.response_media_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_media_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的媒体 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的标题</label>
          <input
            type="text"
            value={formData.response_title ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_title: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的标题"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的描述</label>
          <input
            type="text"
            value={formData.response_description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的缩略图的媒体 id，通过素材管理中的接口上传多媒体文件，得到的 id</label>
          <input
            type="text"
            value={formData.response_thumb_media_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_thumb_media_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的缩略图的媒体 id，通过素材管理中的接口上传多媒体文件，得到的 id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的缩略图的媒体 URL</label>
          <input
            type="text"
            value={formData.response_thumb_media_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_thumb_media_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的缩略图的媒体 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的图文消息</label>
          <input
            type="text"
            value={formData.response_articles ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_articles: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的图文消息"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的音乐链接</label>
          <input
            type="text"
            value={formData.response_music_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_music_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的音乐链接"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的高质量音乐链接</label>
          <input
            type="text"
            value={formData.response_hq_music_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, response_hq_music_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的高质量音乐链接"
            
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
