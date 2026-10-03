"use client"

import React, { useState, useEffect } from "react"
import { MesMdAutoCodeRuleApi } from "../api/mes-md-auto-code-rule.api"
import type { MesMdAutoCodeRuleCreateDTO, MesMdAutoCodeRuleVO } from "@/modules/mes/backend/types/mes-md-auto-code-rule.types"

interface MesMdAutoCodeRuleFormProps {
  open: boolean
  initialData?: MesMdAutoCodeRuleVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesMdAutoCodeRuleForm({ open, initialData, onClose, onSuccess }: MesMdAutoCodeRuleFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    max_length: initialData?.max_length ?? undefined,
    padded: initialData?.padded ?? false,
    padded_char: initialData?.padded_char ?? "",
    padded_method: initialData?.padded_method ?? undefined,
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
        await MesMdAutoCodeRuleApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesMdAutoCodeRuleApi.create(formData as MesMdAutoCodeRuleCreateDTO)
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
            {isEdit ? "编辑MesMdAutoCodeRule（源框架导入）" : "新增MesMdAutoCodeRule（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">规则编码</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规则编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">规则名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入规则名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最大长度</label>
          <input
            type="number"
            value={formData.max_length != null ? String(formData.max_length) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, max_length: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最大长度"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="padded"
            checked={Boolean(formData.padded)}
            onChange={(e) => setFormData((prev) => ({ ...prev, padded: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="padded" className="text-xs text-slate-700 font-medium">是否补齐</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">补齐字符</label>
          <input
            type="text"
            value={formData.padded_char ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, padded_char: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入补齐字符"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">补齐方式</label>
          <input
            type="number"
            value={formData.padded_method != null ? String(formData.padded_method) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, padded_method: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入补齐方式"
            
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
