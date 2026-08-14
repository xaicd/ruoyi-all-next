"use client"

import { useEffect, useState } from "react"
import { API, request } from "@/modules/shared/frontend/lib/request"

type Profile = { username: string; nickname: string; phone?: string | null; email?: string | null; tenantId?: string | null }

export default function UserProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    request.get<Profile>(API.USER_PROFILE).then((response) => {
      if (response.success && response.data) setProfile(response.data)
      else setMessage(response.error ?? "加载个人资料失败")
    })
  }, [])

  async function save() {
    if (!profile) return
    setSaving(true)
    setMessage("")
    const response = await request.put(API.USER_PROFILE, {
      nickname: profile.nickname,
      phone: profile.phone || undefined,
      email: profile.email || undefined,
    })
    setSaving(false)
    setMessage(response.success ? "个人资料已保存" : response.error ?? "保存失败")
  }

  if (!profile) return <div className="rounded-lg border bg-white p-6 text-sm text-slate-500">{message || "加载中..."}</div>

  return <div className="max-w-2xl space-y-4">
    <div className="rounded-lg border bg-white p-5"><h1 className="text-lg font-semibold text-slate-900">个人资料</h1><p className="mt-1 text-sm text-slate-500">仅可维护当前登录账号的基本联系信息。</p></div>
    <div className="space-y-4 rounded-lg border bg-white p-5">
      <label className="block text-sm text-slate-600">用户名<input value={profile.username} disabled className="mt-1 h-9 w-full rounded border bg-slate-50 px-3 text-slate-500" /></label>
      <label className="block text-sm text-slate-600">昵称<input value={profile.nickname} onChange={(e) => setProfile({ ...profile, nickname: e.target.value })} className="mt-1 h-9 w-full rounded border px-3" /></label>
      <label className="block text-sm text-slate-600">手机号<input value={profile.phone ?? ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-1 h-9 w-full rounded border px-3" /></label>
      <label className="block text-sm text-slate-600">邮箱<input type="email" value={profile.email ?? ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-1 h-9 w-full rounded border px-3" /></label>
      <div className="flex items-center gap-3"><button disabled={saving} onClick={save} className="h-9 rounded bg-slate-900 px-4 text-sm text-white disabled:opacity-50">{saving ? "保存中..." : "保存"}</button>{message && <span className="text-sm text-slate-500">{message}</span>}</div>
    </div>
  </div>
}