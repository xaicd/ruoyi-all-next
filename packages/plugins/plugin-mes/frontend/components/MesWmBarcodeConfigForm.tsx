"use client"

import React, { useState, useEffect } from "react"
import { MesWmBarcodeConfigApi } from "../api/mes-wm-barcode-config.api"
import type { MesWmBarcodeConfigCreateDTO, MesWmBarcodeConfigVO } from "@/modules/mes/backend/types/mes-wm-barcode-config.types"

interface MesWmBarcodeConfigFormProps {
  open: boolean
  initialData?: MesWmBarcodeConfigVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesWmBarcodeConfigForm({ open, initialData, onClose, onSuccess }: MesWmBarcodeConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    format: initialData?.format ?? undefined,
    biz_type: initialData?.biz_type ?? undefined,
    content_format: initialData?.content_format ?? "",
    content_example: initialData?.content_example ?? "",
    auto_generate_flag: initialData?.auto_generate_flag ?? false,
    default_template: initialData?.default_template ?? "",
    status: initialData?.status ?? undefined,
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
        await MesWmBarcodeConfigApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesWmBarcodeConfigApi.create(formData as MesWmBarcodeConfigCreateDTO)
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
            {isEdit ? "编辑MesWmBarcodeConfig（源框架导入）" : "新增MesWmBarcodeConfig（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">条码格式</label>
          <input
            type="number"
            value={formData.format != null ? String(formData.format) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, format: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入条码格式"
            
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
          <label className="block text-xs text-slate-600 mb-1">内容格式模板（支持 BUSINESSCODE 占位符）</label>
          <input
            type="text"
            value={formData.content_format ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content_format: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入内容格式模板（支持 BUSINESSCODE 占位符）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">内容样例</label>
          <input
            type="text"
            value={formData.content_example ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, content_example: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入内容样例"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="auto_generate_flag"
            checked={Boolean(formData.auto_generate_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, auto_generate_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="auto_generate_flag" className="text-xs text-slate-700 font-medium">是否自动生成</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">默认打印模板</label>
          <input
            type="text"
            value={formData.default_template ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, default_template: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入默认打印模板"
            
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
