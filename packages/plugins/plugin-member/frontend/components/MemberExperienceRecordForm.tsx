"use client"

import React, { useState, useEffect } from "react"
import { MemberExperienceRecordApi } from "../api/member-experience-record.api"
import type { MemberExperienceRecordCreateDTO, MemberExperienceRecordVO } from "@/modules/member/backend/types/member-experience-record.types"

interface MemberExperienceRecordFormProps {
  open: boolean
  initialData?: MemberExperienceRecordVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MemberExperienceRecordForm({ open, initialData, onClose, onSuccess }: MemberExperienceRecordFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    user_id: initialData?.user_id ?? undefined,
    biz_type: initialData?.biz_type ?? undefined,
    biz_id: initialData?.biz_id ?? "",
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    experience: initialData?.experience ?? undefined,
    total_experience: initialData?.total_experience ?? undefined,
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
        await MemberExperienceRecordApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MemberExperienceRecordApi.create(formData as MemberExperienceRecordCreateDTO)
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
            {isEdit ? "编辑MemberExperienceRecord（源框架导入）" : "新增MemberExperienceRecord（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">业务类型</label>
          <input
            type="number"
            value={formData.biz_type != null ? String(formData.biz_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入业务类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">业务编号</label>
          <input
            type="text"
            value={formData.biz_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, biz_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入业务编号"
            
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
          <label className="block text-xs text-slate-600 mb-1">经验</label>
          <input
            type="number"
            value={formData.experience != null ? String(formData.experience) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入经验"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">变更后的经验</label>
          <input
            type="number"
            value={formData.total_experience != null ? String(formData.total_experience) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, total_experience: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入变更后的经验"
            
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
