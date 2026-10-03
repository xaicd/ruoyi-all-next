"use client"

import React, { useState, useEffect } from "react"
import { MesMdAutoCodePartApi } from "../api/mes-md-auto-code-part.api"
import type { MesMdAutoCodePartCreateDTO, MesMdAutoCodePartVO } from "@/modules/mes/backend/types/mes-md-auto-code-part.types"

interface MesMdAutoCodePartFormProps {
  open: boolean
  initialData?: MesMdAutoCodePartVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesMdAutoCodePartForm({ open, initialData, onClose, onSuccess }: MesMdAutoCodePartFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    rule_id: initialData?.rule_id ?? undefined,
    sort: initialData?.sort ?? undefined,
    type: initialData?.type ?? undefined,
    length: initialData?.length ?? undefined,
    date_format: initialData?.date_format ?? "",
    fix_character: initialData?.fix_character ?? "",
    serial_start_no: initialData?.serial_start_no ?? undefined,
    serial_step: initialData?.serial_step ?? undefined,
    cycle_flag: initialData?.cycle_flag ?? false,
    cycle_method: initialData?.cycle_method ?? undefined,
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
        await MesMdAutoCodePartApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesMdAutoCodePartApi.create(formData as MesMdAutoCodePartCreateDTO)
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
            {isEdit ? "编辑MesMdAutoCodePart（源框架导入）" : "新增MesMdAutoCodePart（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">规则 ID</label>
          <input
            type="number"
            value={formData.rule_id != null ? String(formData.rule_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, rule_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规则 ID"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">分段序号</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分段序号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">分段类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分段类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">分段长度</label>
          <input
            type="number"
            value={formData.length != null ? String(formData.length) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, length: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入分段长度"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">日期格式</label>
          <input
            type="text"
            value={formData.date_format ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, date_format: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入日期格式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">固定字符</label>
          <input
            type="text"
            value={formData.fix_character ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, fix_character: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入固定字符"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流水号起始值</label>
          <input
            type="number"
            value={formData.serial_start_no != null ? String(formData.serial_start_no) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, serial_start_no: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流水号起始值"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流水号步长</label>
          <input
            type="number"
            value={formData.serial_step != null ? String(formData.serial_step) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, serial_step: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流水号步长"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="cycle_flag"
            checked={Boolean(formData.cycle_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, cycle_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="cycle_flag" className="text-xs text-slate-700 font-medium">流水号是否循环</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">循环方式</label>
          <input
            type="number"
            value={formData.cycle_method != null ? String(formData.cycle_method) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, cycle_method: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入循环方式"
            
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
