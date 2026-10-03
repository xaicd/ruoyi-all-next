"use client"

import React, { useState, useEffect } from "react"
import { MpMessageApi } from "../api/mp-message.api"
import type { MpMessageCreateDTO, MpMessageVO } from "@/modules/mp/backend/types/mp-message.types"

interface MpMessageFormProps {
  open: boolean
  initialData?: MpMessageVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MpMessageForm({ open, initialData, onClose, onSuccess }: MpMessageFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    msg_id: initialData?.msg_id ?? undefined,
    account_id: initialData?.account_id ?? undefined,
    app_id: initialData?.app_id ?? "",
    user_id: initialData?.user_id ?? undefined,
    openid: initialData?.openid ?? "",
    type: initialData?.type ?? "",
    send_from: initialData?.send_from ?? undefined,
    content: initialData?.content ?? "",
    media_id: initialData?.media_id ?? "",
    media_url: initialData?.media_url ?? "",
    recognition: initialData?.recognition ?? "",
    format: initialData?.format ?? "",
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    thumb_media_id: initialData?.thumb_media_id ?? "",
    thumb_media_url: initialData?.thumb_media_url ?? "",
    url: initialData?.url ?? "",
    location_x: initialData?.location_x ?? undefined,
    location_y: initialData?.location_y ?? undefined,
    scale: initialData?.scale ?? undefined,
    label: initialData?.label ?? "",
    articles: initialData?.articles ?? "",
    music_url: initialData?.music_url ?? "",
    hq_music_url: initialData?.hq_music_url ?? "",
    event: initialData?.event ?? "",
    event_key: initialData?.event_key ?? "",
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    pic_url: initialData?.pic_url ?? "",
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
        await MpMessageApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MpMessageApi.create(formData as MpMessageCreateDTO)
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
            {isEdit ? "编辑MpMessage（源框架导入）" : "新增MpMessage（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">微信公众号消息 id</label>
          <input
            type="number"
            value={formData.msg_id != null ? String(formData.msg_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, msg_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入微信公众号消息 id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号账号的 ID</label>
          <input
            type="number"
            value={formData.account_id != null ? String(formData.account_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, account_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号账号的 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号 appid</label>
          <input
            type="text"
            value={formData.app_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, app_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号 appid"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号粉丝的编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号粉丝的编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号粉丝标志</label>
          <input
            type="text"
            value={formData.openid ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, openid: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号粉丝标志"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息类型</label>
          <input
            type="text"
            value={formData.type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息来源</label>
          <input
            type="number"
            value={formData.send_from != null ? String(formData.send_from) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, send_from: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息来源"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息内容</label>
          <input
            type="text"
            value={formData.content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">媒体文件的编号</label>
          <input
            type="text"
            value={formData.media_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, media_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入媒体文件的编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">媒体文件的 URL</label>
          <input
            type="text"
            value={formData.media_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, media_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入媒体文件的 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">语音识别后文本</label>
          <input
            type="text"
            value={formData.recognition ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, recognition: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入语音识别后文本"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">语音格式，如 amr，speex 等</label>
          <input
            type="text"
            value={formData.format ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, format: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入语音格式，如 amr，speex 等"
            
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
          <label className="block text-xs text-slate-600 mb-1">描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">缩略图的媒体 id，通过素材管理中的接口上传多媒体文件，得到的 id</label>
          <input
            type="text"
            value={formData.thumb_media_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, thumb_media_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入缩略图的媒体 id，通过素材管理中的接口上传多媒体文件，得到的 id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">缩略图的媒体 URL</label>
          <input
            type="text"
            value={formData.thumb_media_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, thumb_media_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入缩略图的媒体 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">点击图文消息跳转链接</label>
          <input
            type="text"
            value={formData.url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入点击图文消息跳转链接"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">地理位置维度</label>
          <input
            type="number"
            value={formData.location_x != null ? String(formData.location_x) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, location_x: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入地理位置维度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">地理位置经度</label>
          <input
            type="number"
            value={formData.location_y != null ? String(formData.location_y) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, location_y: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入地理位置经度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">地图缩放大小</label>
          <input
            type="number"
            value={formData.scale != null ? String(formData.scale) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, scale: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入地图缩放大小"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">详细地址</label>
          <input
            type="text"
            value={formData.label ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入详细地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">图文消息数组</label>
          <input
            type="text"
            value={formData.articles ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, articles: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入图文消息数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">音乐链接</label>
          <input
            type="text"
            value={formData.music_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, music_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入音乐链接"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">高质量音乐链接</label>
          <input
            type="text"
            value={formData.hq_music_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, hq_music_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入高质量音乐链接"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">事件类型</label>
          <input
            type="text"
            value={formData.event ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, event: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入事件类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">事件 Key</label>
          <input
            type="text"
            value={formData.event_key ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, event_key: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入事件 Key"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">图文消息标题</label>
          <input
            type="text"
            value={formData.title ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入图文消息标题"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">图文消息描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入图文消息描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">图片链接</label>
          <input
            type="text"
            value={formData.pic_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入图片链接"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">点击图文消息跳转链接</label>
          <input
            type="text"
            value={formData.url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入点击图文消息跳转链接"
            
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
