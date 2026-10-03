"use client"

import React, { useState, useEffect } from "react"
import { ImFriendRequestApi } from "../api/im-friend-request.api"
import type { ImFriendRequestCreateDTO, ImFriendRequestVO } from "@/modules/im/backend/types/im-friend-request.types"

interface ImFriendRequestFormProps {
  open: boolean
  initialData?: ImFriendRequestVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ImFriendRequestForm({ open, initialData, onClose, onSuccess }: ImFriendRequestFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    from_user_id: initialData?.from_user_id ?? undefined,
    to_user_id: initialData?.to_user_id ?? undefined,
    apply_content: initialData?.apply_content ?? "",
    display_name: initialData?.display_name ?? "",
    add_source: initialData?.add_source ?? undefined,
    handle_result: initialData?.handle_result ?? undefined,
    handle_content: initialData?.handle_content ?? "",
    handle_time: initialData?.handle_time ?? "",
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
        await ImFriendRequestApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ImFriendRequestApi.create(formData as ImFriendRequestCreateDTO)
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
            {isEdit ? "编辑ImFriendRequest（源框架导入）" : "新增ImFriendRequest（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">发起方用户编号</label>
          <input
            type="number"
            value={formData.from_user_id != null ? String(formData.from_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, from_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发起方用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">接收方用户编号</label>
          <input
            type="number"
            value={formData.to_user_id != null ? String(formData.to_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, to_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入接收方用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">申请理由</label>
          <input
            type="text"
            value={formData.apply_content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, apply_content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入申请理由"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">发起方对接收方的备注</label>
          <input
            type="text"
            value={formData.display_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, display_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发起方对接收方的备注"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">添加来源</label>
          <input
            type="number"
            value={formData.add_source != null ? String(formData.add_source) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, add_source: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入添加来源"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">处理结果</label>
          <input
            type="number"
            value={formData.handle_result != null ? String(formData.handle_result) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, handle_result: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入处理结果"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">处理理由（接收方拒绝时可选填）</label>
          <input
            type="text"
            value={formData.handle_content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, handle_content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入处理理由（接收方拒绝时可选填）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">处理时间</label>
          <input
            type="text"
            value={formData.handle_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, handle_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入处理时间"
            
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
