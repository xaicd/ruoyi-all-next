"use client"

import React, { useState, useEffect } from "react"
import { DiyTemplateApi } from "../api/diy-template.api"
import type { DiyTemplateCreateDTO, DiyTemplateVO } from "@/modules/mall/backend/types/diy-template.types"

interface DiyTemplateFormProps {
  open: boolean
  initialData?: DiyTemplateVO | null
  onClose: () => void
  onSuccess: () => void
}

export function DiyTemplateForm({ open, initialData, onClose, onSuccess }: DiyTemplateFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    used: initialData?.used ?? false,
    used_time: initialData?.used_time ?? "",
    remark: initialData?.remark ?? "",
    preview_pic_urls: initialData?.preview_pic_urls ?? "",
    property: initialData?.property ?? "",
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
        await DiyTemplateApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await DiyTemplateApi.create(formData as DiyTemplateCreateDTO)
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
    <div data-testid="diy-template-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "编辑装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个" : "新增装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个"}
        data-testid="diy-template-form"
        data-agent-scope="diy-template:form"
        data-agent-state={loading ? "submitting" : error ? "error" : "open"}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEdit ? "编辑装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个" : "新增装修模板 DO1. 新建一个模版，下面可以包含多个 页面，例如说首页、我的2. 如果需要使用某个模版，则将 设置为 true，表示已使用，有且仅有一个"}
          </h3>
          <button onClick={onClose} data-testid="diy-template-form-close" data-agent-target="diy-template:close" aria-label="关闭" className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div data-testid="diy-template-form-error" role="alert" className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label htmlFor="diy-template-name" className="block text-xs text-slate-600 mb-1">模板名称</label>
          <input
            type="text"
            id="diy-template-name"
            data-testid="field-name"
            data-agent-target="diy-template:field:name"
            data-agent-state={formData.name ? "filled" : "empty"}
            aria-label="模板名称"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模板名称"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="diy-template-used"
            data-testid="field-used"
            data-agent-target="diy-template:field:used"
            data-agent-state={formData.used ? "on" : "off"}
            aria-label="是否使用"
            checked={Boolean(formData.used)}
            onChange={(e) => setFormData((prev) => ({ ...prev, used: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="diy-template-used" className="text-xs text-slate-700 font-medium">是否使用</label>
        </div>

        <div>
          <label htmlFor="diy-template-used_time" className="block text-xs text-slate-600 mb-1">使用时间</label>
          <input
            type="text"
            id="diy-template-used_time"
            data-testid="field-used_time"
            data-agent-target="diy-template:field:used_time"
            data-agent-state={formData.used_time ? "filled" : "empty"}
            aria-label="使用时间"
            value={formData.used_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, used_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入使用时间"
            
          />
        </div>

        <div>
          <label htmlFor="diy-template-remark" className="block text-xs text-slate-600 mb-1">备注</label>
          <input
            type="text"
            id="diy-template-remark"
            data-testid="field-remark"
            data-agent-target="diy-template:field:remark"
            data-agent-state={formData.remark ? "filled" : "empty"}
            aria-label="备注"
            value={formData.remark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入备注"
            
          />
        </div>

        <div>
          <label htmlFor="diy-template-preview_pic_urls" className="block text-xs text-slate-600 mb-1">预览图</label>
          <input
            type="text"
            id="diy-template-preview_pic_urls"
            data-testid="field-preview_pic_urls"
            data-agent-target="diy-template:field:preview_pic_urls"
            data-agent-state={formData.preview_pic_urls ? "filled" : "empty"}
            aria-label="预览图"
            value={formData.preview_pic_urls ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, preview_pic_urls: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入预览图"
            
          />
        </div>

        <div>
          <label htmlFor="diy-template-property" className="block text-xs text-slate-600 mb-1">uni-app 底部导航属性，JSON 格式</label>
          <input
            type="text"
            id="diy-template-property"
            data-testid="field-property"
            data-agent-target="diy-template:field:property"
            data-agent-state={formData.property ? "filled" : "empty"}
            aria-label="uni-app 底部导航属性，JSON 格式"
            value={formData.property ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, property: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入uni-app 底部导航属性，JSON 格式"
            
          />
        </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              data-testid="diy-template-form-cancel"
              data-agent-target="diy-template:cancel"
              className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              data-testid="diy-template-form-submit"
              data-agent-target="diy-template:submit"
              data-agent-state={loading ? "busy" : "idle"}
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
