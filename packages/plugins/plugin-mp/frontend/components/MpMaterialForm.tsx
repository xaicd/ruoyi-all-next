"use client"

import React, { useState, useEffect } from "react"
import { MpMaterialApi } from "../api/mp-material.api"
import type { MpMaterialCreateDTO, MpMaterialVO } from "@/modules/mp/backend/types/mp-material.types"

interface MpMaterialFormProps {
  open: boolean
  initialData?: MpMaterialVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MpMaterialForm({ open, initialData, onClose, onSuccess }: MpMaterialFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    account_id: initialData?.account_id ?? undefined,
    app_id: initialData?.app_id ?? "",
    media_id: initialData?.media_id ?? "",
    type: initialData?.type ?? "",
    permanent: initialData?.permanent ?? false,
    url: initialData?.url ?? "",
    name: initialData?.name ?? "",
    mp_url: initialData?.mp_url ?? "",
    title: initialData?.title ?? "",
    introduction: initialData?.introduction ?? "",
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
        await MpMaterialApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MpMaterialApi.create(formData as MpMaterialCreateDTO)
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
            {isEdit ? "编辑MpMaterial（源框架导入）" : "新增MpMaterial（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">公众号素材 id</label>
          <input
            type="text"
            value={formData.media_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, media_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号素材 id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文件类型</label>
          <input
            type="text"
            value={formData.type ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文件类型"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="permanent"
            checked={Boolean(formData.permanent)}
            onChange={(e) => setFormData((prev) => ({ ...prev, permanent: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="permanent" className="text-xs text-slate-700 font-medium">是否永久</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">文件服务器的 URL</label>
          <input
            type="text"
            value={formData.url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入文件服务器的 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">名字</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入名字"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号文件 URL</label>
          <input
            type="text"
            value={formData.mp_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mp_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号文件 URL"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">视频素材的标题</label>
          <input
            type="text"
            value={formData.title ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入视频素材的标题"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">视频素材的描述</label>
          <input
            type="text"
            value={formData.introduction ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, introduction: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入视频素材的描述"
            
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
