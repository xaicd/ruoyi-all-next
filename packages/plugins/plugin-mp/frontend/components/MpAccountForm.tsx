"use client"

import React, { useState, useEffect } from "react"
import { MpAccountApi } from "../api/mp-account.api"
import type { MpAccountCreateDTO, MpAccountVO } from "@/modules/mp/backend/types/mp-account.types"

interface MpAccountFormProps {
  open: boolean
  initialData?: MpAccountVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MpAccountForm({ open, initialData, onClose, onSuccess }: MpAccountFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    account: initialData?.account ?? "",
    app_id: initialData?.app_id ?? "",
    app_secret: initialData?.app_secret ?? "",
    token: initialData?.token ?? "",
    aes_key: initialData?.aes_key ?? "",
    qr_code_url: initialData?.qr_code_url ?? "",
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
        await MpAccountApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MpAccountApi.create(formData as MpAccountCreateDTO)
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
            {isEdit ? "编辑MpAccount（源框架导入）" : "新增MpAccount（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号账号</label>
          <input
            type="text"
            value={formData.account ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, account: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号账号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号 appid</label>
          <input
            type="text"
            value={formData.app_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, app_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号 appid"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号密钥</label>
          <input
            type="text"
            value={formData.app_secret ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, app_secret: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号密钥"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">公众号token</label>
          <input
            type="text"
            value={formData.token ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, token: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入公众号token"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">消息加解密密钥</label>
          <input
            type="text"
            value={formData.aes_key ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, aes_key: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入消息加解密密钥"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">二维码图片 URL</label>
          <input
            type="text"
            value={formData.qr_code_url ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, qr_code_url: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入二维码图片 URL"
            
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
