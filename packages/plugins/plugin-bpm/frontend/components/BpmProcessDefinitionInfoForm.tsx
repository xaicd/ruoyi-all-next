"use client"

import React, { useState, useEffect } from "react"
import { BpmProcessDefinitionInfoApi } from "../api/bpm-process-definition-info.api"
import type { BpmProcessDefinitionInfoCreateDTO, BpmProcessDefinitionInfoVO } from "@/modules/bpm/backend/types/bpm-process-definition-info.types"

interface BpmProcessDefinitionInfoFormProps {
  open: boolean
  initialData?: BpmProcessDefinitionInfoVO | null
  onClose: () => void
  onSuccess: () => void
}

export function BpmProcessDefinitionInfoForm({ open, initialData, onClose, onSuccess }: BpmProcessDefinitionInfoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    process_definition_id: initialData?.process_definition_id ?? "",
    model_id: initialData?.model_id ?? "",
    model_type: initialData?.model_type ?? undefined,
    category: initialData?.category ?? "",
    icon: initialData?.icon ?? "",
    description: initialData?.description ?? "",
    form_type: initialData?.form_type ?? undefined,
    form_id: initialData?.form_id ?? undefined,
    form_conf: initialData?.form_conf ?? "",
    form_fields: initialData?.form_fields ?? "",
    form_custom_create_path: initialData?.form_custom_create_path ?? "",
    form_custom_view_path: initialData?.form_custom_view_path ?? "",
    simple_model: initialData?.simple_model ?? "",
    visible: initialData?.visible ?? false,
    sort: initialData?.sort ?? undefined,
    start_user_ids: initialData?.start_user_ids ?? "",
    start_dept_ids: initialData?.start_dept_ids ?? "",
    manager_user_ids: initialData?.manager_user_ids ?? "",
    allow_cancel_running_process: initialData?.allow_cancel_running_process ?? false,
    allow_withdraw_task: initialData?.allow_withdraw_task ?? false,
    process_id_rule: initialData?.process_id_rule ?? "",
    auto_approval_type: initialData?.auto_approval_type ?? undefined,
    title_setting: initialData?.title_setting ?? "",
    summary_setting: initialData?.summary_setting ?? "",
    process_before_trigger_setting: initialData?.process_before_trigger_setting ?? "",
    process_after_trigger_setting: initialData?.process_after_trigger_setting ?? "",
    task_before_trigger_setting: initialData?.task_before_trigger_setting ?? "",
    task_after_trigger_setting: initialData?.task_after_trigger_setting ?? "",
    print_template_setting: initialData?.print_template_setting ?? "",
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
        await BpmProcessDefinitionInfoApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await BpmProcessDefinitionInfoApi.create(formData as BpmProcessDefinitionInfoCreateDTO)
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
            {isEdit ? "编辑BpmProcessDefinitionInfo（源框架导入）" : "新增BpmProcessDefinitionInfo（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">流程定义的编号</label>
          <input
            type="text"
            value={formData.process_definition_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_definition_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程定义的编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程模型的编号</label>
          <input
            type="text"
            value={formData.model_id ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, model_id: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程模型的编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程模型的类型</label>
          <input
            type="number"
            value={formData.model_type != null ? String(formData.model_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, model_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程模型的类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程分类的编码</label>
          <input
            type="text"
            value={formData.category ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程分类的编码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">图标</label>
          <input
            type="text"
            value={formData.icon ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入图标"
            
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
          <label className="block text-xs text-slate-600 mb-1">表单类型</label>
          <input
            type="number"
            value={formData.form_type != null ? String(formData.form_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, form_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入表单类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">动态表单编号</label>
          <input
            type="number"
            value={formData.form_id != null ? String(formData.form_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, form_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入动态表单编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">表单的配置</label>
          <input
            type="text"
            value={formData.form_conf ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, form_conf: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入表单的配置"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">表单项的数组</label>
          <input
            type="text"
            value={formData.form_fields ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, form_fields: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入表单项的数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">自定义表单的提交路径，使用 Vue 的路由地址</label>
          <input
            type="text"
            value={formData.form_custom_create_path ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, form_custom_create_path: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入自定义表单的提交路径，使用 Vue 的路由地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">自定义表单的查看路径，使用 Vue 的路由地址</label>
          <input
            type="text"
            value={formData.form_custom_view_path ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, form_custom_view_path: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入自定义表单的查看路径，使用 Vue 的路由地址"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">SIMPLE 设计器模型数据 json 格式</label>
          <input
            type="text"
            value={formData.simple_model ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, simple_model: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入SIMPLE 设计器模型数据 json 格式"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="visible"
            checked={Boolean(formData.visible)}
            onChange={(e) => setFormData((prev) => ({ ...prev, visible: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="visible" className="text-xs text-slate-700 font-medium">是否可见</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">排序值</label>
          <input
            type="number"
            value={formData.sort != null ? String(formData.sort) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sort: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入排序值"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">可发起用户编号数组</label>
          <input
            type="text"
            value={formData.start_user_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_user_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入可发起用户编号数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">可发起部门编号数组</label>
          <input
            type="text"
            value={formData.start_dept_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, start_dept_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入可发起部门编号数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">可管理用户编号数组</label>
          <input
            type="text"
            value={formData.manager_user_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, manager_user_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入可管理用户编号数组"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allow_cancel_running_process"
            checked={Boolean(formData.allow_cancel_running_process)}
            onChange={(e) => setFormData((prev) => ({ ...prev, allow_cancel_running_process: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="allow_cancel_running_process" className="text-xs text-slate-700 font-medium">是否允许撤销审批中的申请</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allow_withdraw_task"
            checked={Boolean(formData.allow_withdraw_task)}
            onChange={(e) => setFormData((prev) => ({ ...prev, allow_withdraw_task: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="allow_withdraw_task" className="text-xs text-slate-700 font-medium">是否允许审批人撤回任务</label>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程 ID 规则</label>
          <input
            type="text"
            value={formData.process_id_rule ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_id_rule: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程 ID 规则"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">自动去重类型</label>
          <input
            type="number"
            value={formData.auto_approval_type != null ? String(formData.auto_approval_type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, auto_approval_type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入自动去重类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">标题设置</label>
          <input
            type="text"
            value={formData.title_setting ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, title_setting: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入标题设置"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">摘要设置</label>
          <input
            type="text"
            value={formData.summary_setting ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, summary_setting: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入摘要设置"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程前置通知设置</label>
          <input
            type="text"
            value={formData.process_before_trigger_setting ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_before_trigger_setting: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程前置通知设置"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">流程后置通知设置</label>
          <input
            type="text"
            value={formData.process_after_trigger_setting ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, process_after_trigger_setting: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入流程后置通知设置"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">任务前置通知设置</label>
          <input
            type="text"
            value={formData.task_before_trigger_setting ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, task_before_trigger_setting: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入任务前置通知设置"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">任务后置通知设置</label>
          <input
            type="text"
            value={formData.task_after_trigger_setting ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, task_after_trigger_setting: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入任务后置通知设置"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">自定义打印模板设置</label>
          <input
            type="text"
            value={formData.print_template_setting ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, print_template_setting: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入自定义打印模板设置"
            
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
