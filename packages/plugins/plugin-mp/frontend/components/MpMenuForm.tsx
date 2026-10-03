"use client"

import React, { useState, useEffect } from "react"
import { MpMenuApi } from "../api/mp-menu.api"
import type { MpMenuCreateDTO, MpMenuVO } from "@/modules/mp/backend/types/mp-menu.types"

interface MpMenuFormProps {
  open: boolean
  initialData?: MpMenuVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MpMenuForm({ open, initialData, onClose, onSuccess }: MpMenuFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    account_id: initialData?.account_id ?? undefined,
    app_id: initialData?.app_id ?? "",
    name: initialData?.name ?? "",
    menu_key: initialData?.menu_key ?? "",
    parent_id: initialData?.parent_id ?? undefined,
    type: initialData?.type ?? "",
    url: initialData?.url ?? "",
    mini_program_app_id: initialData?.mini_program_app_id ?? "",
    mini_program_page_path: initialData?.mini_program_page_path ?? "",
    article_id: initialData?.article_id ?? "",
    reply_message_type: initialData?.reply_message_type ?? "",
    reply_content: initialData?.reply_content ?? "",
    reply_media_id: initialData?.reply_media_id ?? "",
    reply_media_url: initialData?.reply_media_url ?? "",
    reply_title: initialData?.reply_title ?? "",
    reply_description: initialData?.reply_description ?? "",
    reply_thumb_media_id: initialData?.reply_thumb_media_id ?? "",
    reply_thumb_media_url: initialData?.reply_thumb_media_url ?? "",
    reply_articles: initialData?.reply_articles ?? "",
    reply_music_url: initialData?.reply_music_url ?? "",
    reply_hq_music_url: initialData?.reply_hq_music_url ?? "",
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
        await MpMenuApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MpMenuApi.create(formData as MpMenuCreateDTO)
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
            {isEdit ? "编辑MpMenu（源框架导入）" : "新增MpMenu（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">菜单名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入菜单名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">菜单标识</label>
          <input
            type="text"
            value={formData.menu_key ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, menu_key: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入菜单标识"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">父菜单编号</label>
          <input
            type="number"
            value={formData.parent_id != null ? String(formData.parent_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入父菜单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">按钮类型</label>
          <input
            type="text"
            value={formData.type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入按钮类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">网页链接</label>
          <input
            type="text"
            value={formData.url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入网页链接"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">小程序的 appId</label>
          <input
            type="text"
            value={formData.mini_program_app_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mini_program_app_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入小程序的 appId"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">小程序的页面路径</label>
          <input
            type="text"
            value={formData.mini_program_page_path ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mini_program_page_path: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入小程序的页面路径"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">跳转图文的媒体编号</label>
          <input
            type="text"
            value={formData.article_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, article_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入跳转图文的媒体编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息类型</label>
          <input
            type="text"
            value={formData.reply_message_type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_message_type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的消息内容</label>
          <input
            type="text"
            value={formData.reply_content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的消息内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的媒体 id</label>
          <input
            type="text"
            value={formData.reply_media_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_media_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的媒体 id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的媒体 URL</label>
          <input
            type="text"
            value={formData.reply_media_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_media_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的媒体 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的标题</label>
          <input
            type="text"
            value={formData.reply_title ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_title: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的标题"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的描述</label>
          <input
            type="text"
            value={formData.reply_description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的缩略图的媒体 id，通过素材管理中的接口上传多媒体文件，得到的 id</label>
          <input
            type="text"
            value={formData.reply_thumb_media_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_thumb_media_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的缩略图的媒体 id，通过素材管理中的接口上传多媒体文件，得到的 id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的缩略图的媒体 URL</label>
          <input
            type="text"
            value={formData.reply_thumb_media_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_thumb_media_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的缩略图的媒体 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的图文消息数组</label>
          <input
            type="text"
            value={formData.reply_articles ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_articles: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的图文消息数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的音乐链接</label>
          <input
            type="text"
            value={formData.reply_music_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_music_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入回复的音乐链接"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">回复的高质量音乐链接</label>
          <input
            type="text"
            value={formData.reply_hq_music_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reply_hq_music_url: e.target.value }))}
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
