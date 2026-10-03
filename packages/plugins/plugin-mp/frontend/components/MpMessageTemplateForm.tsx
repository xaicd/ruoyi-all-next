"use client"

import React, { useState, useEffect } from "react"
import { MpMessageTemplateApi } from "../api/mp-message-template.api"
import type { MpMessageTemplateCreateDTO, MpMessageTemplateVO } from "@/modules/mp/backend/types/mp-message-template.types"

interface MpMessageTemplateFormProps {
  open: boolean
  initialData?: MpMessageTemplateVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MpMessageTemplateForm({ open, initialData, onClose, onSuccess }: MpMessageTemplateFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    account_id: initialData?.account_id ?? undefined,
    app_id: initialData?.app_id ?? "",
    template_id: initialData?.template_id ?? "",
    title: initialData?.title ?? "",
    content: initialData?.content ?? "",
    example: initialData?.example ?? "",
    primary_industry: initialData?.primary_industry ?? "",
    deputy_industry: initialData?.deputy_industry ?? "",
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
        await MpMessageTemplateApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MpMessageTemplateApi.create(formData as MpMessageTemplateCreateDTO)
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
            {isEdit ? "编辑MpMessageTemplate（源框架导入）" : "新增MpMessageTemplate（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">公众号模板 ID</label>
          <input
            type="text"
            value={formData.template_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, template_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号模板 ID"
            
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
          <label className="block text-xs text-slate-600 mb-1">模板内容</label>
          <input
            type="text"
            value={formData.content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模板内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">模板示例</label>
          <input
            type="text"
            value={formData.example ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, example: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模板示例"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">模板所属行业的一级行业</label>
          <input
            type="text"
            value={formData.primary_industry ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, primary_industry: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模板所属行业的一级行业"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">模板所属行业的二级行业</label>
          <input
            type="text"
            value={formData.deputy_industry ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, deputy_industry: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模板所属行业的二级行业"
            
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
