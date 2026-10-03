"use client"

import React, { useState, useEffect } from "react"
import { IotAlertConfigApi } from "../api/iot-alert-config.api"
import type { IotAlertConfigCreateDTO, IotAlertConfigVO } from "@/modules/iot/backend/types/iot-alert-config.types"

interface IotAlertConfigFormProps {
  open: boolean
  initialData?: IotAlertConfigVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotAlertConfigForm({ open, initialData, onClose, onSuccess }: IotAlertConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    level: initialData?.level ?? undefined,
    status: initialData?.status ?? undefined,
    scene_rule_ids: initialData?.scene_rule_ids ?? "",
    receive_user_ids: initialData?.receive_user_ids ?? "",
    receive_types: initialData?.receive_types ?? "",
    sms_template_code: initialData?.sms_template_code ?? "",
    mail_template_code: initialData?.mail_template_code ?? "",
    notify_template_code: initialData?.notify_template_code ?? "",
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
        await IotAlertConfigApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotAlertConfigApi.create(formData as IotAlertConfigCreateDTO)
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
            {isEdit ? "编辑IotAlertConfig（源框架导入）" : "新增IotAlertConfig（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">配置名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入配置名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">配置描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入配置描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">配置状态</label>
          <input
            type="number"
            value={formData.level != null ? String(formData.level) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入配置状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">配置状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入配置状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">关联的场景联动规则编号数组</label>
          <input
            type="text"
            value={formData.scene_rule_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, scene_rule_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入关联的场景联动规则编号数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">接收的用户编号数组</label>
          <input
            type="text"
            value={formData.receive_user_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receive_user_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入接收的用户编号数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">接收的类型数组</label>
          <input
            type="text"
            value={formData.receive_types ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, receive_types: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入接收的类型数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">短信模板编号</label>
          <input
            type="text"
            value={formData.sms_template_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sms_template_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入短信模板编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">邮件模板编号</label>
          <input
            type="text"
            value={formData.mail_template_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mail_template_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入邮件模板编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">站内信模板编号</label>
          <input
            type="text"
            value={formData.notify_template_code ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notify_template_code: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入站内信模板编号"
            
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
