"use client"

import React, { useState, useEffect } from "react"
import { AiChatRoleApi } from "../api/ai-chat-role.api"
import type { AiChatRoleCreateDTO, AiChatRoleVO } from "@/modules/ai/backend/types/ai-chat-role.types"

interface AiChatRoleFormProps {
  open: boolean
  initialData?: AiChatRoleVO | null
  onClose: () => void
  onSuccess: () => void
}

export function AiChatRoleForm({ open, initialData, onClose, onSuccess }: AiChatRoleFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    name: initialData?.name ?? "",
    avatar: initialData?.avatar ?? "",
    category: initialData?.category ?? "",
    description: initialData?.description ?? "",
    system_message: initialData?.system_message ?? "",
    user_id: initialData?.user_id ?? undefined,
    model_id: initialData?.model_id ?? undefined,
    knowledge_ids: initialData?.knowledge_ids ?? "",
    tool_ids: initialData?.tool_ids ?? "",
    mcp_client_names: initialData?.mcp_client_names ?? "",
    public_status: initialData?.public_status ?? false,
    sort: initialData?.sort ?? undefined,
    status: initialData?.status ?? undefined,
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
        await AiChatRoleApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await AiChatRoleApi.create(formData as AiChatRoleCreateDTO)
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
            {isEdit ? "编辑AiChatRole（源框架导入）" : "新增AiChatRole（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">角色名称</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入角色名称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">角色头像</label>
          <input
            type="text"
            value={formData.avatar ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入角色头像"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">角色分类</label>
          <input
            type="text"
            value={formData.category ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入角色分类"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">角色描述</label>
          <input
            type="text"
            value={formData.description ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入角色描述"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">角色设定</label>
          <input
            type="text"
            value={formData.system_message ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, system_message: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入角色设定"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户编号</label>
          <input
            type="number"
            value={formData.user_id != null ? String(formData.user_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, user_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">模型编号</label>
          <input
            type="number"
            value={formData.model_id != null ? String(formData.model_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, model_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入模型编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">引用的知识库编号列表</label>
          <input
            type="text"
            value={formData.knowledge_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, knowledge_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入引用的知识库编号列表"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">引用的工具编号列表</label>
          <input
            type="text"
            value={formData.tool_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, tool_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入引用的工具编号列表"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">引用的 MCP Client 名字列表</label>
          <input
            type="text"
            value={formData.mcp_client_names ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mcp_client_names: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入引用的 MCP Client 名字列表"
            
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="public_status"
            checked={Boolean(formData.public_status)}
            onChange={(e) => setFormData((prev) => ({ ...prev, public_status: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="public_status" className="text-xs text-slate-700 font-medium">是否公开</label>
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
          <label className="block text-xs text-slate-600 mb-1">状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入状态"
            
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
