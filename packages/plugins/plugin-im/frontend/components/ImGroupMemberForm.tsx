"use client"

import React, { useState, useEffect } from "react"
import { ImGroupMemberApi } from "../api/im-group-member.api"
import type { ImGroupMemberCreateDTO, ImGroupMemberVO } from "@/modules/im/backend/types/im-group-member.types"

interface ImGroupMemberFormProps {
  open: boolean
  initialData?: ImGroupMemberVO | null
  onClose: () => void
  onSuccess: () => void
}

export function ImGroupMemberForm({ open, initialData, onClose, onSuccess }: ImGroupMemberFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    group_id: initialData?.group_id ?? undefined,
    user_id: initialData?.user_id ?? undefined,
    display_user_name: initialData?.display_user_name ?? "",
    group_remark: initialData?.group_remark ?? "",
    silent: initialData?.silent ?? false,
    status: initialData?.status ?? undefined,
    role: initialData?.role ?? undefined,
    join_time: initialData?.join_time ?? "",
    add_source: initialData?.add_source ?? undefined,
    inviter_user_id: initialData?.inviter_user_id ?? undefined,
    quit_time: initialData?.quit_time ?? "",
    mute_end_time: initialData?.mute_end_time ?? "",
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
        await ImGroupMemberApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await ImGroupMemberApi.create(formData as ImGroupMemberCreateDTO)
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
            {isEdit ? "编辑ImGroupMember（源框架导入）" : "新增ImGroupMember（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">群编号</label>
          <input
            type="number"
            value={formData.group_id != null ? String(formData.group_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, group_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入群编号"
            
          />
        </div>

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
          <label className="block text-xs text-slate-600 mb-1">组内显示名</label>
          <input
            type="text"
            value={formData.display_user_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, display_user_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入组内显示名"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">群备注</label>
          <input
            type="text"
            value={formData.group_remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, group_remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入群备注"
            
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
          <label className="block text-xs text-slate-600 mb-1">成员状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入成员状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">成员角色</label>
          <input
            type="number"
            value={formData.role != null ? String(formData.role) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入成员角色"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">入群时间</label>
          <input
            type="text"
            value={formData.join_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, join_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入入群时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">加入来源</label>
          <input
            type="number"
            value={formData.add_source != null ? String(formData.add_source) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, add_source: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入加入来源"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">邀请人用户编号</label>
          <input
            type="number"
            value={formData.inviter_user_id != null ? String(formData.inviter_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, inviter_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入邀请人用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">退群时间</label>
          <input
            type="text"
            value={formData.quit_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, quit_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入退群时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">禁言到期时间</label>
          <input
            type="text"
            value={formData.mute_end_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mute_end_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入禁言到期时间"
            
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
