"use client"

import React, { useState, useEffect } from "react"
import { CrmClueApi } from "../api/crm-clue.api"
import type { CrmClueCreateDTO, CrmClueVO } from "@/modules/crm/backend/types/crm-clue.types"

interface CrmClueFormProps {
  open: boolean
  initialData?: CrmClueVO | null
  onClose: () => void
  onSuccess: () => void
}

export function CrmClueForm({ open, initialData, onClose, onSuccess }: CrmClueFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    follow_up_status: initialData?.follow_up_status ?? false,
    contact_last_time: initialData?.contact_last_time ?? "",
    contact_last_content: initialData?.contact_last_content ?? "",
    contact_next_time: initialData?.contact_next_time ?? "",
    owner_user_id: initialData?.owner_user_id ?? undefined,
    transform_status: initialData?.transform_status ?? false,
    customer_id: initialData?.customer_id ?? undefined,
    mobile: initialData?.mobile ?? "",
    telephone: initialData?.telephone ?? "",
    qq: initialData?.qq ?? "",
    wechat: initialData?.wechat ?? "",
    email: initialData?.email ?? "",
    area_id: initialData?.area_id ?? undefined,
    detail_address: initialData?.detail_address ?? "",
    industry_id: initialData?.industry_id ?? undefined,
    level: initialData?.level ?? undefined,
    source: initialData?.source ?? undefined,
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
        await CrmClueApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await CrmClueApi.create(formData as CrmClueCreateDTO)
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
            {isEdit ? "编辑CrmClue（源框架导入）" : "新增CrmClue（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">线索名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入线索名称"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="follow_up_status"
            checked={Boolean(formData.follow_up_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, follow_up_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="follow_up_status" className="text-xs text-slate-700 font-medium">跟进状态</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最后跟进时间</label>
          <input
            type="text"
            value={formData.contact_last_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_last_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最后跟进时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最后跟进内容</label>
          <input
            type="text"
            value={formData.contact_last_content ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_last_content: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最后跟进内容"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">下次联系时间</label>
          <input
            type="text"
            value={formData.contact_next_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_next_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入下次联系时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">负责人的用户编号</label>
          <input
            type="number"
            value={formData.owner_user_id != null ? String(formData.owner_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, owner_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入负责人的用户编号"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="transform_status"
            checked={Boolean(formData.transform_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, transform_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="transform_status" className="text-xs text-slate-700 font-medium">转化状态</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户编号</label>
          <input
            type="number"
            value={formData.customer_id != null ? String(formData.customer_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, customer_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">手机号</label>
          <input
            type="text"
            value={formData.mobile ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入手机号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">电话</label>
          <input
            type="text"
            value={formData.telephone ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入电话"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">QQ</label>
          <input
            type="text"
            value={formData.qq ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, qq: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入QQ"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">wechat</label>
          <input
            type="text"
            value={formData.wechat ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, wechat: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入wechat"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">email</label>
          <input
            type="text"
            value={formData.email ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入email"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">所在地</label>
          <input
            type="number"
            value={formData.area_id != null ? String(formData.area_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, area_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入所在地"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">详细地址</label>
          <input
            type="text"
            value={formData.detail_address ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, detail_address: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入详细地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">所属行业</label>
          <input
            type="number"
            value={formData.industry_id != null ? String(formData.industry_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, industry_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入所属行业"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户等级</label>
          <input
            type="number"
            value={formData.level != null ? String(formData.level) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户等级"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">客户来源</label>
          <input
            type="number"
            value={formData.source != null ? String(formData.source) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入客户来源"
            
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
