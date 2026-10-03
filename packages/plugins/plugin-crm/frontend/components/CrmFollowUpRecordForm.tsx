"use client"

import React, { useState, useEffect } from "react"
import { CrmFollowUpRecordApi } from "../api/crm-follow-up-record.api"
import type { CrmFollowUpRecordCreateDTO, CrmFollowUpRecordVO } from "@/modules/crm/backend/types/crm-follow-up-record.types"

interface CrmFollowUpRecordFormProps {
  open: boolean
  initialData?: CrmFollowUpRecordVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmFollowUpRecordForm({ open, initialData, onClose, onSuccess }: CrmFollowUpRecordFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    biz_type: initialData?.biz_type ?? undefined,
    biz_id: initialData?.biz_id ?? undefined,
    type: initialData?.type ?? undefined,
    content: initialData?.content ?? "",
    next_time: initialData?.next_time ?? "",
    pic_urls: initialData?.pic_urls ?? "",
    file_urls: initialData?.file_urls ?? "",
    business_ids: initialData?.business_ids ?? "",
    contact_ids: initialData?.contact_ids ?? "",
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
        await CrmFollowUpRecordApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmFollowUpRecordApi.create(formData as CrmFollowUpRecordCreateDTO)
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
            {isEdit ? "编辑CrmFollowUpRecord（源框架导入）" : "新增CrmFollowUpRecord（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">数据类型</label>
          <input
            type="number"
            value={formData.biz_type != null ? String(formData.biz_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">数据编号</label>
          <input
            type="number"
            value={formData.biz_id != null ? String(formData.biz_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数据编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">跟进类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入跟进类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">跟进内容</label>
          <input
            type="text"
            value={formData.content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入跟进内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">下次联系时间</label>
          <input
            type="text"
            value={formData.next_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, next_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入下次联系时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">图片</label>
          <input
            type="text"
            value={formData.pic_urls ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pic_urls: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入图片"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">附件</label>
          <input
            type="text"
            value={formData.file_urls ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, file_urls: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入附件"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">关联的商机编号数组</label>
          <input
            type="text"
            value={formData.business_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, business_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入关联的商机编号数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">关联的联系人编号数组</label>
          <input
            type="text"
            value={formData.contact_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入关联的联系人编号数组"
            
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
