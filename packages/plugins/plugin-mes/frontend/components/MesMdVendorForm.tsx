"use client"

import React, { useState, useEffect } from "react"
import { MesMdVendorApi } from "../api/mes-md-vendor.api"
import type { MesMdVendorCreateDTO, MesMdVendorVO } from "@/modules/mes/backend/types/mes-md-vendor.types"

interface MesMdVendorFormProps {
  open: boolean
  initialData?: MesMdVendorVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MesMdVendorForm({ open, initialData, onClose, onSuccess }: MesMdVendorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    code: initialData?.code ?? "",
    name: initialData?.name ?? "",
    nickname: initialData?.nickname ?? "",
    english_name: initialData?.english_name ?? "",
    description: initialData?.description ?? "",
    logo: initialData?.logo ?? "",
    level: initialData?.level ?? "",
    score: initialData?.score ?? undefined,
    address: initialData?.address ?? "",
    website: initialData?.website ?? "",
    email: initialData?.email ?? "",
    telephone: initialData?.telephone ?? "",
    contact1_name: initialData?.contact1_name ?? "",
    contact1_telephone: initialData?.contact1_telephone ?? "",
    contact1_email: initialData?.contact1_email ?? "",
    contact2_name: initialData?.contact2_name ?? "",
    contact2_telephone: initialData?.contact2_telephone ?? "",
    contact2_email: initialData?.contact2_email ?? "",
    credit_code: initialData?.credit_code ?? "",
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
        await MesMdVendorApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MesMdVendorApi.create(formData as MesMdVendorCreateDTO)
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
            {isEdit ? "编辑MesMdVendor（源框架导入）" : "新增MesMdVendor（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商编码</label>
          <input
            type="text"
            value={formData.code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商简称</label>
          <input
            type="text"
            value={formData.nickname ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商简称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商英文名称</label>
          <input
            type="text"
            value={formData.english_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, english_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商英文名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商简介</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商简介"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商LOGO地址</label>
          <input
            type="text"
            value={formData.logo ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商LOGO地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商等级</label>
          <input
            type="text"
            value={formData.level ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商等级"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商评分</label>
          <input
            type="number"
            value={formData.score != null ? String(formData.score) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, score: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商评分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商地址</label>
          <input
            type="text"
            value={formData.address ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商官网地址</label>
          <input
            type="text"
            value={formData.website ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商官网地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商邮箱地址</label>
          <input
            type="text"
            value={formData.email ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商邮箱地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">供应商电话</label>
          <input
            type="text"
            value={formData.telephone ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, telephone: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入供应商电话"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">联系人1</label>
          <input
            type="text"
            value={formData.contact1_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact1_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系人1"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">联系人1-电话</label>
          <input
            type="text"
            value={formData.contact1_telephone ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact1_telephone: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系人1-电话"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">联系人1-邮箱</label>
          <input
            type="text"
            value={formData.contact1_email ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact1_email: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系人1-邮箱"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">联系人2</label>
          <input
            type="text"
            value={formData.contact2_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact2_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系人2"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">联系人2-电话</label>
          <input
            type="text"
            value={formData.contact2_telephone ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact2_telephone: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系人2-电话"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">联系人2-邮箱</label>
          <input
            type="text"
            value={formData.contact2_email ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact2_email: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入联系人2-邮箱"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">统一社会信用代码</label>
          <input
            type="text"
            value={formData.credit_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, credit_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入统一社会信用代码"
            
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
