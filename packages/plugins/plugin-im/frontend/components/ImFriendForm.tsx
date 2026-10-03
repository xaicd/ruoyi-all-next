"use client"

import React, { useState, useEffect } from "react"
import { ImFriendApi } from "../api/im-friend.api"
import type { ImFriendCreateDTO, ImFriendVO } from "@/modules/im/backend/types/im-friend.types"

interface ImFriendFormProps {
  open: boolean
  initialData?: ImFriendVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ImFriendForm({ open, initialData, onClose, onSuccess }: ImFriendFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    user_id: initialData?.user_id ?? undefined,
    friend_user_id: initialData?.friend_user_id ?? undefined,
    silent: initialData?.silent ?? false,
    display_name: initialData?.display_name ?? "",
    add_source: initialData?.add_source ?? undefined,
    pinned: initialData?.pinned ?? false,
    blocked: initialData?.blocked ?? false,
    status: initialData?.status ?? undefined,
    add_time: initialData?.add_time ?? "",
    delete_time: initialData?.delete_time ?? "",
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
        await ImFriendApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ImFriendApi.create(formData as ImFriendCreateDTO)
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
            {isEdit ? "编辑ImFriend（源框架导入）" : "新增ImFriend（源框架导入）"}
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
          <label className="block text-xs text-slate-600 mb-1">好友用户编号</label>
          <input
            type="number"
            value={formData.friend_user_id != null ? String(formData.friend_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, friend_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入好友用户编号"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="silent"
            checked={Boolean(formData.silent)}
            onChange={(e) => setFormData((prev) => ({ ...prev, silent: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="silent" className="text-xs text-slate-700 font-medium">是否免打扰</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">好友展示备注</label>
          <input
            type="text"
            value={formData.display_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, display_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入好友展示备注"
            
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="pinned"
            checked={Boolean(formData.pinned)}
            onChange={(e) => setFormData((prev) => ({ ...prev, pinned: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="pinned" className="text-xs text-slate-700 font-medium">是否置顶联系人</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="blocked"
            checked={Boolean(formData.blocked)}
            onChange={(e) => setFormData((prev) => ({ ...prev, blocked: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="blocked" className="text-xs text-slate-700 font-medium">是否拉黑（弱关联 friend，单边屏蔽对方私聊消息）</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">好友状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入好友状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">添加好友时间</label>
          <input
            type="text"
            value={formData.add_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, add_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入添加好友时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">删除好友时间</label>
          <input
            type="text"
            value={formData.delete_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, delete_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入删除好友时间"
            
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
