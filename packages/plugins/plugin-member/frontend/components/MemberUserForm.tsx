"use client"

import React, { useState, useEffect } from "react"
import { MemberUserApi } from "../api/member-user.api"
import type { MemberUserCreateDTO, MemberUserVO } from "@/modules/member/backend/types/member-user.types"

interface MemberUserFormProps {
  open: boolean
  initialData?: MemberUserVO | null
  onClose: () => void
  onSuccess: () => void
}

export function MemberUserForm({ open, initialData, onClose, onSuccess }: MemberUserFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (open) {
      setError(null)
      setFormData({
    mobile: initialData?.mobile ?? "",
    email: initialData?.email ?? "",
    password: initialData?.password ?? "",
    status: initialData?.status ?? undefined,
    register_ip: initialData?.register_ip ?? "",
    register_terminal: initialData?.register_terminal ?? undefined,
    login_ip: initialData?.login_ip ?? "",
    login_date: initialData?.login_date ?? "",
    nickname: initialData?.nickname ?? "",
    avatar: initialData?.avatar ?? "",
    name: initialData?.name ?? "",
    sex: initialData?.sex ?? undefined,
    birthday: initialData?.birthday ?? "",
    area_id: initialData?.area_id ?? undefined,
    mark: initialData?.mark ?? "",
    point: initialData?.point ?? undefined,
    tag_ids: initialData?.tag_ids ?? "",
    level_id: initialData?.level_id ?? undefined,
    experience: initialData?.experience ?? undefined,
    group_id: initialData?.group_id ?? undefined,
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
        await MemberUserApi.update({ id: initialData.id, ...formData } as any)
      } else {
        await MemberUserApi.create(formData as MemberUserCreateDTO)
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
            {isEdit ? "编辑MemberUser（源框架导入）" : "新增MemberUser（源框架导入）"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-2 text-xs text-red-600 bg-red-50 rounded border border-red-200">{error}</div>
            )}
        <div>
          <label className="block text-xs text-slate-600 mb-1">手机</label>
          <input
            type="text"
            value={formData.mobile ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入手机"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">邮箱</label>
          <input
            type="text"
            value={formData.email ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入邮箱"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">加密后的密码</label>
          <input
            type="text"
            value={formData.password ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入加密后的密码"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">帐号状态</label>
          <input
            type="number"
            value={formData.status != null ? String(formData.status) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入帐号状态"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">注册 IP</label>
          <input
            type="text"
            value={formData.register_ip ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, register_ip: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入注册 IP"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">注册终端</label>
          <input
            type="number"
            value={formData.register_terminal != null ? String(formData.register_terminal) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, register_terminal: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入注册终端"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最后登录IP</label>
          <input
            type="text"
            value={formData.login_ip ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, login_ip: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最后登录IP"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">最后登录时间</label>
          <input
            type="text"
            value={formData.login_date ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, login_date: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入最后登录时间"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户昵称</label>
          <input
            type="text"
            value={formData.nickname ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户昵称"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户头像</label>
          <input
            type="text"
            value={formData.avatar ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户头像"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">真实名字</label>
          <input
            type="text"
            value={formData.name ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入真实名字"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">性别</label>
          <input
            type="number"
            value={formData.sex != null ? String(formData.sex) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, sex: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入性别"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">出生日期</label>
          <input
            type="text"
            value={formData.birthday ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, birthday: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入出生日期"
            
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
          <label className="block text-xs text-slate-600 mb-1">用户备注</label>
          <input
            type="text"
            value={formData.mark ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, mark: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户备注"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">积分</label>
          <input
            type="number"
            value={formData.point != null ? String(formData.point) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, point: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入积分"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">会员标签列表，以逗号分隔</label>
          <input
            type="text"
            value={formData.tag_ids ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, tag_ids: e.target.value }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入会员标签列表，以逗号分隔"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">会员级别编号</label>
          <input
            type="number"
            value={formData.level_id != null ? String(formData.level_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, level_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入会员级别编号"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">会员经验</label>
          <input
            type="number"
            value={formData.experience != null ? String(formData.experience) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入会员经验"
            
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">用户分组编号</label>
          <input
            type="number"
            value={formData.group_id != null ? String(formData.group_id) : ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, group_id: e.target.value === "" ? undefined : Number(e.target.value) }))}
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="请输入用户分组编号"
            
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
