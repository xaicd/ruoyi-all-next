"use client"

import React, { useState, useEffect } from "react"
import { BpmProcessInstanceCopyApi } from "../api/bpm-process-instance-copy.api"
import type { BpmProcessInstanceCopyCreateDTO, BpmProcessInstanceCopyVO } from "@/modules/bpm/backend/types/bpm-process-instance-copy.types"

interface BpmProcessInstanceCopyFormProps {
  open: boolean
  initialData?: BpmProcessInstanceCopyVO | null
  onClose: () => void
  onSuccess: () => void
}

export function BpmProcessInstanceCopyForm({ open, initialData, onClose, onSuccess }: BpmProcessInstanceCopyFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    start_user_id: initialData?.start_user_id ?? undefined,
    process_instance_name: initialData?.process_instance_name ?? "",
    process_instance_id: initialData?.process_instance_id ?? "",
    process_definition_id: initialData?.process_definition_id ?? "",
    category: initialData?.category ?? "",
    activity_id: initialData?.activity_id ?? "",
    activity_name: initialData?.activity_name ?? "",
    task_id: initialData?.task_id ?? "",
    user_id: initialData?.user_id ?? undefined,
    reason: initialData?.reason ?? "",
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
        await BpmProcessInstanceCopyApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await BpmProcessInstanceCopyApi.create(formData as BpmProcessInstanceCopyCreateDTO)
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
            {isEdit ? "编辑BpmProcessInstanceCopy（源框架导入）" : "新增BpmProcessInstanceCopy（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">发起人 Id</label>
          <input
            type="number"
            value={formData.start_user_id != null ? String(formData.start_user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入发起人 Id"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程名</label>
          <input
            type="text"
            value={formData.process_instance_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_instance_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程名"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程实例的编号</label>
          <input
            type="text"
            value={formData.process_instance_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_instance_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程实例的编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程实例的流程定义编号</label>
          <input
            type="text"
            value={formData.process_definition_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_definition_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程实例的流程定义编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程分类</label>
          <input
            type="text"
            value={formData.category ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程分类"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程活动的编号</label>
          <input
            type="text"
            value={formData.activity_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程活动的编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程活动的名字</label>
          <input
            type="text"
            value={formData.activity_name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, activity_name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程活动的名字"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程活动的编号</label>
          <input
            type="text"
            value={formData.task_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, task_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程活动的编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户编号（被抄送的用户编号）</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户编号（被抄送的用户编号）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">抄送意见</label>
          <input
            type="text"
            value={formData.reason ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入抄送意见"
            
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
