"use client"

import React, { useState, useEffect } from "react"
import { MesMdItemApi } from "../api/mes-md-item.api"
import type { MesMdItemCreateDTO, MesMdItemVO } from "@/modules/mes/backend/types/mes-md-item.types"

interface MesMdItemFormProps {
  open: boolean
  initialData?: MesMdItemVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesMdItemForm({ open, initialData, onClose, onSuccess }: MesMdItemFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    specification: initialData?.specification ?? "",
    unit_measure_id: initialData?.unit_measure_id ?? undefined,
    item_type_id: initialData?.item_type_id ?? undefined,
    status: initialData?.status ?? undefined,
    safe_stock_flag: initialData?.safe_stock_flag ?? false,
    min_stock: initialData?.min_stock ?? undefined,
    max_stock: initialData?.max_stock ?? undefined,
    high_value: initialData?.high_value ?? false,
    batch_flag: initialData?.batch_flag ?? false,
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
        await MesMdItemApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesMdItemApi.create(formData as MesMdItemCreateDTO)
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
            {isEdit ? "编辑MesMdItem（源框架导入）" : "新增MesMdItem（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">物料编码</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物料编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">物料名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物料名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">规格型号</label>
          <input
            type="text"
            value={formData.specification ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, specification: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规格型号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">计量单位编号</label>
          <input
            type="number"
            value={formData.unit_measure_id != null ? String(formData.unit_measure_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, unit_measure_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入计量单位编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">物料分类编号</label>
          <input
            type="number"
            value={formData.item_type_id != null ? String(formData.item_type_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, item_type_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物料分类编号"
            
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="safe_stock_flag"
            checked={Boolean(formData.safe_stock_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, safe_stock_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="safe_stock_flag" className="text-xs text-slate-700 font-medium">是否启用安全库存</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最低库存量</label>
          <input
            type="number"
            value={formData.min_stock != null ? String(formData.min_stock) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, min_stock: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最低库存量"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最高库存量</label>
          <input
            type="number"
            value={formData.max_stock != null ? String(formData.max_stock) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, max_stock: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最高库存量"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="high_value"
            checked={Boolean(formData.high_value)}
            onChange={(e) => setFormData((prev) => ({ ...prev, high_value: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="high_value" className="text-xs text-slate-700 font-medium">是否高值物料</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="batch_flag"
            checked={Boolean(formData.batch_flag)}
            onChange={(e) => setFormData((prev) => ({ ...prev, batch_flag: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="batch_flag" className="text-xs text-slate-700 font-medium">是否启用批次管理</label>
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
