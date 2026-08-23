"use client"

import React, { useState } from "react"
import Link from "next/link"
import { projectProfile } from "@/modules/shared/contract/project-profile"
import { request, API } from "@/modules/shared/frontend/lib/request"

type BootstrapCredentials = { username: string; password: string }

export default function LoginPage({ bootstrapCredentials }: { bootstrapCredentials?: BootstrapCredentials }) {
  const [tenantEnabled, setTenantEnabled] = useState(false)
  const [username, setUsername] = useState(bootstrapCredentials?.username ?? "vps_adm")
  const [password, setPassword] = useState(bootstrapCredentials?.password ?? "Vps_Admin159&w")
  const [tenantCode, setTenantCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const repoUrl = "https://github.com/xaicd/ruoyi-all-next"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const payloadTenant = tenantEnabled ? tenantCode.trim().toLowerCase() : undefined
      const data = await request.post(
        API.AUTH,
        { username, password, tenantCode: payloadTenant },
        { noAuth: true }
      )

      if (data.success) {
        localStorage.setItem("ruoyi_token", data.data.token)
        localStorage.setItem("ruoyi_user", JSON.stringify(data.data.user))
        window.location.href = "/admin/system/users"
      } else {
        const message = data.message || data.error || "登录失败，请检查账号密码"
        setError(`${message}${data.code ? ` (${data.code})` : ""}${data.traceId ? ` · 链路追踪: ${data.traceId}` : ""}`)
      }
    } catch {
      setError("网络连接失败，请确认后端服务已正常启动")
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = (user: string, pass: string, code?: string) => {
    setUsername(user)
    setPassword(pass)
    if (code) {
      setTenantEnabled(true)
      setTenantCode(code)
    } else {
      setTenantEnabled(false)
      setTenantCode("")
    }
    setError("")
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white antialiased">
      {/* Top Simple Nav */}
      <header className="w-full border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-base shadow-sm">
              R
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 tracking-tight text-base">{projectProfile.platformName}</span>
              <span className="hidden sm:inline-block rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500 font-mono border border-slate-200">
                v{projectProfile.version}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="text-slate-500 hover:text-slate-900 transition font-medium">
              返回门户
            </Link>
            <span className="text-slate-300">|</span>
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition font-medium"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">登录管理后台</h1>
              <p className="mt-1 text-xs text-slate-500">
                请输入管理员凭据或租户专属账号以访问控制台
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2">
                <svg className="h-4 w-4 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Tenant Switch Toggle */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
                <label className="font-medium text-slate-700 cursor-pointer flex items-center gap-2" onClick={() => setTenantEnabled(!tenantEnabled)}>
                  <input
                    type="checkbox"
                    checked={tenantEnabled}
                    onChange={(e) => setTenantEnabled(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>以特定租户身份登录</span>
                </label>
                {tenantEnabled && (
                  <span className="text-[11px] text-blue-600 font-mono">租户隔离模式</span>
                )}
              </div>

              {/* Tenant Code Input */}
              {tenantEnabled && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    租户编码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tenantCode}
                    onChange={(e) => setTenantCode(e.target.value.toLowerCase())}
                    placeholder="如: demo 或 cc-adm"
                    required={tenantEnabled}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  用户名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入账号用户名"
                  required
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    登录密码 <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? "隐藏" : "显示"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  required
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>记住登录状态</span>
                </label>
                <span className="text-slate-400 text-[11px]">JWT 安全鉴权</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full rounded-lg bg-blue-600 text-xs font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm mt-2"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>正在登录...</span>
                  </>
                ) : (
                  <span>登录</span>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Box */}
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-slate-500">快速填入开发预设账号</span>
                {copied && <span className="text-[11px] text-emerald-600">已填入</span>}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillCredentials(bootstrapCredentials?.username ?? "vps_adm", bootstrapCredentials?.password ?? "Vps_Admin159&w")}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-100 transition"
                >
                  <div className="font-medium text-slate-800">平台超级管理员</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">vps_adm</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials("demo_user", "123456", "demo")}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left hover:border-slate-300 hover:bg-slate-100 transition"
                >
                  <div className="font-medium text-slate-800">租户测试账号</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">demo_user (demo)</div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Security Info */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <p>{projectProfile.copyright} {projectProfile.platformName} · 基于 Next.js 15 全栈架构</p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        开源协议: MIT License · 严格遵守数据隔离与审计规范
      </footer>
    </div>
  )
}
