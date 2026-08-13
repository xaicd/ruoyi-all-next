"use client"

import { useState } from "react"
import { request, API } from "@/modules/shared/frontend/lib/request"

type BootstrapCredentials = { username: string; password: string }

export default function LoginPage({ bootstrapCredentials }: { bootstrapCredentials?: BootstrapCredentials }) {
  const [username, setUsername] = useState(bootstrapCredentials?.username ?? "")
  const [password, setPassword] = useState(bootstrapCredentials?.password ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await request.post(API.AUTH, { username, password }, { noAuth: true })

      if (data.success) {
        localStorage.setItem("ruoyi_token", data.data.token)
        localStorage.setItem("ruoyi_user", JSON.stringify(data.data.user))
        window.location.href = "/admin/system/users"
      } else {
        setError(data.error || "登录失败")
      }
    } catch {
      setError("网络异常，请重试")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* 左侧装饰 */}
      <div className="hidden w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="max-w-md">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl font-bold text-white">R</div>
          <h1 className="text-3xl font-bold text-white">RuoYi All Next</h1>
          <p className="mt-3 text-base text-blue-100/80">
            企业级全栈管理平台，基于 Next.js 15 构建。支持多数据库、多租户、微服务演进。
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-2xl font-bold text-white">15</p>
              <p className="text-sm text-blue-200">业务域</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-2xl font-bold text-white">388</p>
              <p className="text-sm text-blue-200">服务模块</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-2xl font-bold text-white">9+</p>
              <p className="text-sm text-blue-200">数据库支持</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-2xl font-bold text-white">2095</p>
              <p className="text-sm text-blue-200">API 端点</p>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧表单 */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white lg:hidden">R</div>
            <h2 className="text-2xl font-bold text-slate-900">登录管理后台</h2>
            <p className="mt-1 text-sm text-slate-500">请输入您的账号和密码</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">用户名</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
                className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-sm font-medium text-white shadow-sm transition hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
            >
              {loading ? "登录中..." : "登 录"}
            </button>
          </form>

          {bootstrapCredentials && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="mb-2 text-xs font-medium text-amber-800">本地开发账号（来自环境变量）</p>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="break-all text-amber-900">{bootstrapCredentials.username} / {bootstrapCredentials.password}</span>
                <button
                  type="button"
                  onClick={() => { setUsername(bootstrapCredentials.username); setPassword(bootstrapCredentials.password) }}
                  className="shrink-0 text-xs text-blue-600 hover:text-blue-700"
                >
                  一键填入
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">
            RuoYi All Next v0.1.0 · {bootstrapCredentials ? "本地开发环境" : "安全登录"}
          </p>
        </div>
      </div>
    </div>
  )
}
