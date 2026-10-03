"use client"

import React, { useState, useEffect } from "react"
import { ImGroupApi } from "../api/im-group.api"
import type { ImGroupCreateDTO, ImGroupVO } from "@/modules/im/backend/types/im-group.types"

interface ImGroupFormProps {
  open: boolean
  initialData?: ImGroupVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ImGroupForm({ open, initialData, onClose, onSuccess }: ImGroupFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    owner_user_id: initialData?.owner_user_id ?? undefined,
    avatar: initialData?.avatar ?? "",
    notice: initialData?.notice ?? "",
    join_approval: initialData?.join_approval ?? false,
    banned: initialData?.banned ?? false,
    banned_reason: initialData?.banned_reason ?? "",
    banned_time: initialData?.banned_time ?? "",
    status: initialData?.status ?? undefined,
    dissolved_time: initialData?.dissolved_time ?? "",
    muted_all: initialData?.muted_all ?? false,
    pinned_message_ids: initialData?.pinned_message_ids ?? "",
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
        await ImGroupApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ImGroupApi.create(formData as ImGroupCreateDTO)
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
            {isEdit ? "编辑ImGroup（源框架导入）" : "新增ImGroup（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">群名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入群名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">群主用户编号</label>
          <input
            type="number"
            value={formData.owner_user_id != null ? String(formData.owner_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, owner_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入群主用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">群头像</label>
          <input
            type="text"
            value={formData.avatar ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入群头像"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">群公告</label>
          <input
            type="text"
            value={formData.notice ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notice: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入群公告"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="join_approval"
            checked={Boolean(formData.join_approval)}
            onChange={(e) => setFormData((prev) => ({ ...prev, join_approval: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="join_approval" className="text-xs text-slate-700 font-medium">进群是否需群主 / 管理员审批</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="banned"
            checked={Boolean(formData.banned)}
            onChange={(e) => setFormData((prev) => ({ ...prev, banned: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="banned" className="text-xs text-slate-700 font-medium">是否封禁</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">封禁原因</label>
          <input
            type="text"
            value={formData.banned_reason ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, banned_reason: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入封禁原因"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">封禁时间</label>
          <input
            type="text"
            value={formData.banned_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, banned_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入封禁时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">群状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入群状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">解散时间</label>
          <input
            type="text"
            value={formData.dissolved_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, dissolved_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入解散时间"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="muted_all"
            checked={Boolean(formData.muted_all)}
            onChange={(e) => setFormData((prev) => ({ ...prev, muted_all: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="muted_all" className="text-xs text-slate-700 font-medium">是否全群禁言</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">群置顶消息编号列表</label>
          <input
            type="text"
            value={formData.pinned_message_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, pinned_message_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入群置顶消息编号列表"
            
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
