"use client"

import React, { useEffect, useState } from "react"
import {
  fetchAppearance,
  appearanceStyle,
  fetchProfile,
  getToken,
  clearToken,
  type Appearance,
  type MemberPublic,
} from "./store-shared"

/** C 端用户中心。需登录；未登录跳转 /store/login。消费外观主题呈现。 */
export default function StoreProfilePage() {
  const [appearance, setAppearance] = useState<Appearance | null>(null)
  const [member, setMember] = useState<MemberPublic | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAppearance().then(setAppearance).catch(() => {})
    if (!getToken()) {
      window.location.href = "/store/login"
      return
    }
    fetchProfile()
      .then(setMember)
      .catch((e) => {
        setError(e?.message || "加载失败")
        // token 失效 → 回登录
        if (String(e?.message || "").includes("登录") || String(e?.message || "").includes("401")) {
          clearToken()
          window.location.href = "/store/login"
        }
      })
  }, [])

  const logout = () => {
    clearToken()
    window.location.href = "/store"
  }

  return (
    <div style={appearanceStyle(appearance)} className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <a href="/store" className="text-lg font-bold">{appearance?.siteName ?? "商城"}</a>
        <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-800">退出登录</button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold mb-6" style={{ color: "var(--brand)" }}>用户中心</h1>
        {error && !member && <p className="text-red-500 text-sm">{error}</p>}
        {member && (
          <div className="bg-white border border-slate-200 p-6" style={{ borderRadius: "var(--radius)" }}>
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style={{ background: "var(--brand)" }}
              >
                {member.nickname?.slice(0, 1) || "U"}
              </div>
              <div>
                <p className="text-lg font-semibold">{member.nickname}</p>
                <p className="text-sm text-slate-500">账号：{member.account}</p>
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-slate-400">会员等级</dt><dd className="font-medium">{member.memberLevel}</dd></div>
              <div><dt className="text-slate-400">状态</dt><dd className="font-medium">{member.status}</dd></div>
              <div><dt className="text-slate-400">邮箱</dt><dd className="font-medium">{member.email || "—"}</dd></div>
              <div><dt className="text-slate-400">ID</dt><dd className="font-mono text-xs">{member.id}</dd></div>
            </dl>
          </div>
        )}
      </main>
    </div>
  )
}
