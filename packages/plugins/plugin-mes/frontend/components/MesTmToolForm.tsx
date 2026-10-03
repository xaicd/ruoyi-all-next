"use client"

import React, { useState, useEffect } from "react"
import { MesTmToolApi } from "../api/mes-tm-tool.api"
import type { MesTmToolCreateDTO, MesTmToolVO } from "@/modules/mes/backend/types/mes-tm-tool.types"

interface MesTmToolFormProps {
  open: boolean
  initialData?: MesTmToolVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesTmToolForm({ open, initialData, onClose, onSuccess }: MesTmToolFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    brand: initialData?.brand ?? "",
    specification: initialData?.specification ?? "",
    tool_type_id: initialData?.tool_type_id ?? undefined,
    quantity: initialData?.quantity ?? undefined,
    available_quantity: initialData?.available_quantity ?? undefined,
    mainten_type: initialData?.mainten_type ?? undefined,
    next_mainten_period: initialData?.next_mainten_period ?? undefined,
    next_mainten_date: initialData?.next_mainten_date ?? "",
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
        await MesTmToolApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesTmToolApi.create(formData as MesTmToolCreateDTO)
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
            {isEdit ? "编辑MesTmTool（源框架导入）" : "新增MesTmTool（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">工具编码</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工具编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工具名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工具名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">品牌</label>
          <input
            type="text"
            value={formData.brand ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入品牌"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">型号规格</label>
          <input
            type="text"
            value={formData.specification ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, specification: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入型号规格"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">工具类型编号</label>
          <input
            type="number"
            value={formData.tool_type_id != null ? String(formData.tool_type_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, tool_type_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入工具类型编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">数量</label>
          <input
            type="number"
            value={formData.quantity != null ? String(formData.quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">可用数量</label>
          <input
            type="number"
            value={formData.available_quantity != null ? String(formData.available_quantity) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, available_quantity: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入可用数量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">保养维护类型</label>
          <input
            type="number"
            value={formData.mainten_type != null ? String(formData.mainten_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mainten_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入保养维护类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">下次保养周期（次数）</label>
          <input
            type="number"
            value={formData.next_mainten_period != null ? String(formData.next_mainten_period) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, next_mainten_period: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入下次保养周期（次数）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">下次保养日期</label>
          <input
            type="text"
            value={formData.next_mainten_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, next_mainten_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入下次保养日期"
            
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
