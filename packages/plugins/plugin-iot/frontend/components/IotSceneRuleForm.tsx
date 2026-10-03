"use client"

import React, { useState, useEffect } from "react"
import { IotSceneRuleApi } from "../api/iot-scene-rule.api"
import type { IotSceneRuleCreateDTO, IotSceneRuleVO } from "@/modules/iot/backend/types/iot-scene-rule.types"

interface IotSceneRuleFormProps {
  open: boolean
  initialData?: IotSceneRuleVO | null
  onClose: () => void
  onSuccess: () => void
}

export function IotSceneRuleForm({ open, initialData, onClose, onSuccess }: IotSceneRuleFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    status: initialData?.status ?? undefined,
    last_trigger_time: initialData?.last_trigger_time ?? "",
    triggers: initialData?.triggers ?? "",
    actions: initialData?.actions ?? "",
    type: initialData?.type ?? undefined,
    product_id: initialData?.product_id ?? undefined,
    device_id: initialData?.device_id ?? undefined,
    identifier: initialData?.identifier ?? "",
    operator: initialData?.operator ?? "",
    value: initialData?.value ?? "",
    cron_expression: initialData?.cron_expression ?? "",
    condition_groups: initialData?.condition_groups ?? "",
    type: initialData?.type ?? undefined,
    product_id: initialData?.product_id ?? undefined,
    device_id: initialData?.device_id ?? undefined,
    identifier: initialData?.identifier ?? "",
    operator: initialData?.operator ?? "",
    param: initialData?.param ?? "",
    type: initialData?.type ?? undefined,
    product_id: initialData?.product_id ?? undefined,
    device_id: initialData?.device_id ?? undefined,
    identifier: initialData?.identifier ?? "",
    params: initialData?.params ?? "",
    alert_config_id: initialData?.alert_config_id ?? undefined,
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
        await IotSceneRuleApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await IotSceneRuleApi.create(formData as IotSceneRuleCreateDTO)
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
            {isEdit ? "编辑IotSceneRule（源框架导入）" : "新增IotSceneRule（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">场景联动名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入场景联动名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">场景联动描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入场景联动描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">场景联动状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入场景联动状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最后触发时间</label>
          <input
            type="text"
            value={formData.last_trigger_time ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, last_trigger_time: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最后触发时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">场景定义配置</label>
          <input
            type="text"
            value={formData.triggers ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, triggers: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入场景定义配置"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">场景动作配置</label>
          <input
            type="text"
            value={formData.actions ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, actions: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入场景动作配置"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">场景事件类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入场景事件类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品编号</label>
          <input
            type="number"
            value={formData.product_id != null ? String(formData.product_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备编号</label>
          <input
            type="number"
            value={formData.device_id != null ? String(formData.device_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, device_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">物模型标识符</label>
          <input
            type="text"
            value={formData.identifier ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, identifier: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入物模型标识符"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">操作符</label>
          <input
            type="text"
            value={formData.operator ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, operator: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入操作符"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">参数（属性值、在线状态）</label>
          <input
            type="text"
            value={formData.value ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入参数（属性值、在线状态）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">CRON 表达式</label>
          <input
            type="text"
            value={formData.cron_expression ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, cron_expression: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入CRON 表达式"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">触发条件分组（状态条件分组）的数组</label>
          <input
            type="text"
            value={formData.condition_groups ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, condition_groups: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入触发条件分组（状态条件分组）的数组"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">触发条件类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入触发条件类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品编号</label>
          <input
            type="number"
            value={formData.product_id != null ? String(formData.product_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备编号</label>
          <input
            type="number"
            value={formData.device_id != null ? String(formData.device_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, device_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">标识符（属性）</label>
          <input
            type="text"
            value={formData.identifier ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, identifier: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入标识符（属性）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">操作符</label>
          <input
            type="text"
            value={formData.operator ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, operator: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入操作符"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">参数</label>
          <input
            type="text"
            value={formData.param ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, param: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入参数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">执行类型</label>
          <input
            type="number"
            value={formData.type != null ? String(formData.type) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入执行类型"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">产品编号</label>
          <input
            type="number"
            value={formData.product_id != null ? String(formData.product_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, product_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入产品编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">设备编号</label>
          <input
            type="number"
            value={formData.device_id != null ? String(formData.device_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, device_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入设备编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">标识符（服务）</label>
          <input
            type="text"
            value={formData.identifier ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, identifier: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入标识符（服务）"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">请求参数</label>
          <input
            type="text"
            value={formData.params ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, params: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入请求参数"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">告警配置编号</label>
          <input
            type="number"
            value={formData.alert_config_id != null ? String(formData.alert_config_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, alert_config_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入告警配置编号"
            
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
