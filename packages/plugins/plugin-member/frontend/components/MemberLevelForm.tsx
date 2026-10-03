"use client"

import React, { useState, useEffect } from "react"
import { MemberLevelApi } from "../api/member-level.api"
import type { MemberLevelCreateDTO, MemberLevelVO } from "@/modules/member/backend/types/member-level.types"

interface MemberLevelFormProps {
  open: boolean
  initialData?: MemberLevelVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MemberLevelForm({ open, initialData, onClose, onSuccess }: MemberLevelFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    level: initialData?.level ?? undefined,
    experience: initialData?.experience ?? undefined,
    discount_percent: initialData?.discount_percent ?? undefined,
    icon: initialData?.icon ?? "",
    background_url: initialData?.background_url ?? "",
    status: initialData?.status ?? undefined,
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
        await MemberLevelApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MemberLevelApi.create(formData as MemberLevelCreateDTO)
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
            {isEdit ? "编辑MemberLevel（源框架导入）" : "新增MemberLevel（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">等级名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入等级名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">等级</label>
          <input
            type="number"
            value={formData.level != null ? String(formData.level) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入等级"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">升级经验</label>
          <input
            type="number"
            value={formData.experience != null ? String(formData.experience) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入升级经验"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">享受折扣</label>
          <input
            type="number"
            value={formData.discount_percent != null ? String(formData.discount_percent) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, discount_percent: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入享受折扣"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">等级图标</label>
          <input
            type="text"
            value={formData.icon ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入等级图标"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">等级背景图</label>
          <input
            type="text"
            value={formData.background_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, background_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入等级背景图"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
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
