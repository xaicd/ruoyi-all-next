"use client"

import React, { useState, useEffect } from "react"
import { MesCalTeamShiftApi } from "../api/mes-cal-team-shift.api"
import type { MesCalTeamShiftCreateDTO, MesCalTeamShiftVO } from "@/modules/mes/backend/types/mes-cal-team-shift.types"

interface MesCalTeamShiftFormProps {
  open: boolean
  initialData?: MesCalTeamShiftVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesCalTeamShiftForm({ open, initialData, onClose, onSuccess }: MesCalTeamShiftFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    plan_id: initialData?.plan_id ?? undefined,
    team_id: initialData?.team_id ?? undefined,
    shift_id: initialData?.shift_id ?? undefined,
    day: initialData?.day ?? "",
    sort: initialData?.sort ?? undefined,
    remark: initialData?.remark ?? "",
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
        await MesCalTeamShiftApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesCalTeamShiftApi.create(formData as MesCalTeamShiftCreateDTO)
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
            {isEdit ? "编辑MesCalTeamShift（源框架导入）" : "新增MesCalTeamShift（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">排班计划编号</label>
          <input
            type="number"
            value={formData.plan_id != null ? String(formData.plan_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, plan_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排班计划编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">班组编号</label>
          <input
            type="number"
            value={formData.team_id != null ? String(formData.team_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, team_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入班组编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">班次编号</label>
          <input
            type="number"
            value={formData.shift_id != null ? String(formData.shift_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, shift_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入班次编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">日期</label>
          <input
            type="text"
            value={formData.day ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, day: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入日期"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">排序</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入备注"
            
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
