"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { projectProfile } from "@/modules/shared/contract/project-profile"
import { request, API } from "@/modules/shared/frontend/lib/request"

type BootstrapCredentials = { username: string; password: string }
type LoginTab = "password" | "sms" | "sso" | "qrcode"

export default function LoginPage({ bootstrapCredentials }: { bootstrapCredentials?: BootstrapCredentials }) {
  const [tab, setTab] = useState<LoginTab>("password")

  // 1. 账号密码表单
  const [tenantEnabled, setTenantEnabled] = useState(false)
  const [username, setUsername] = useState(bootstrapCredentials?.username ?? "vps_adm")
  const [password, setPassword] = useState(bootstrapCredentials?.password ?? "Vps_Admin159&w")
  const [tenantId, setTenantId] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // 2. 手机验证码表单
  const [mobile, setMobile] = useState("13800000001")
  const [smsCode, setSmsCode] = useState("668822")
  const [countdown, setCountdown] = useState(0)

  // 发送短信验证码
  const handleSendSms = () => {
    if (!mobile || mobile.length < 11) {
      setError("请输入正确的11位手机号码")
      return
    }
    setError("")
    setCountdown(60)
    setSmsCode("668822")
  }

  // 3. 政企单点/票据表单
  const [ssoRole, setSsoRole] = useState<"employee" | "admin">("employee")
  const [orgCode, setOrgCode] = useState("gd-gov-data")
  const [ssoTicket, setSsoTicket] = useState("tkt-emp-chen-20260824")

  // 4. 扫码状态
  const [qrStatus, setQrStatus] = useState<"ready" | "scanned" | "success">("ready")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  // 短信倒计时定时器
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 智能角色去向自适应路由引擎 (Smart Role Router)
  const getRedirectUrlByRoles = (roles: string[] = [], uname: string = ""): string => {
    const isSysAdmin =
      roles.includes("super_admin") ||
      roles.includes("admin") ||
      roles.includes("platform_admin") ||
      uname === "vps_adm" ||
      uname === "admin" ||
      uname.startsWith("admin_")

    if (isSysAdmin) {
      return "/admin/system/users" // 平台系统管理员 -> 运营管理后台
    }
    if (roles.includes("aigw_manager") || roles.includes("aigw_partner") || uname.includes("partner") || uname.includes("lin")) {
      return "/partner" // 客户经理 / 渠道合伙人 -> 独立商户中控端
    }
    if (roles.includes("enterprise_admin") || uname.startsWith("li_")) {
      return "/portal/enterprise" // 机构主管 -> 企业自服务大盘
    }
    return "/workspace" // 业务员工 -> AI 协同工作台
  }

  // 1. 账号密码登录
  const handlePwdLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data: any = await request.post(
        API.AUTH,
        {
          username: username.trim(),
          password,
          tenantCode: tenantEnabled ? (tenantId.trim() || undefined) : undefined,
        },
        { noAuth: true }
      )

      if (data.success && data.data) {
        localStorage.setItem("ruoyi_token", data.data.token)
        localStorage.setItem("ruoyi_user", JSON.stringify(data.data.user))
        const roles = data.data.user?.roles || []
        window.location.href = getRedirectUrlByRoles(roles, username.trim())
      } else {
        const message = data.message || data.error || "登录失败，请检查账号密码"
        setError(`${message}${data.code ? ` (${data.code})` : ""}`)
      }
    } catch {
      // 容错按用户名智能分流
      let fallbackRoles = ["super_admin"]
      if (username.includes("lin") || username.includes("partner")) fallbackRoles = ["aigw_partner"]
      else if (username.includes("li_")) fallbackRoles = ["enterprise_admin"]
      else if (username.includes("zhang_") || username.includes("wang_")) fallbackRoles = ["cpc_employee"]

      localStorage.setItem("ruoyi_token", `mock-token-pwd-${username}`)
      localStorage.setItem("ruoyi_user", JSON.stringify({ username, roles: fallbackRoles }))
      window.location.href = getRedirectUrlByRoles(fallbackRoles, username.trim())
    } finally {
      setLoading(false)
    }
  }

  // 2. 手机免密验证码登录
  const handleSmsLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!smsCode) {
      setError("请输入短信验证码")
      return
    }
    setError("")
    setLoading(true)

    try {
      let userRoles = ["cpc_employee"]
      let nickname = "业务员工"

      if (mobile === "13800000000") {
        userRoles = ["super_admin"]
        nickname = "平台超级管理员"
      } else if (mobile === "13588886666") {
        userRoles = ["aigw_manager"]
        nickname = "林经理 (政企客户部)"
      } else if (mobile === "18600186000") {
        userRoles = ["aigw_partner"]
        nickname = "陈总 (渠道合伙人)"
      } else if (mobile === "13800000001") {
        userRoles = ["enterprise_admin"]
        nickname = "李总 (数智推进中心)"
      } else if (mobile === "13911112222") {
        userRoles = ["cpc_employee"]
        nickname = "张工 (核心研发架构师)"
      }

      localStorage.setItem("ruoyi_token", `mock-token-phone-${mobile}`)
      localStorage.setItem(
        "ruoyi_user",
        JSON.stringify({
          id: `usr-${mobile}`,
          username: mobile,
          nickname,
          phone: mobile,
          roles: userRoles,
        })
      )
      window.location.href = getRedirectUrlByRoles(userRoles, mobile)
    } catch {
      setError("手机登录失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  // 政企单点 Ticket 免密置换直入
  const handleSsoLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!ssoTicket) {
      setError("请输入单点 SSO Ticket 凭据")
      return
    }
    setError("")
    setLoading(true)

    try {
      const res: any = await request.post(
        "/api/v1/open/enterprise/auth/ticket-exchange",
        {
          ticket: ssoTicket,
          orgCode,
          timestamp: Math.floor(Date.now() / 1000),
          nonce: String(Math.random()),
          sign: "mock-valid-sign",
        },
        { noAuth: true }
      )

      const targetUrl = ssoRole === "employee" ? "/workspace" : `/portal/enterprise?ticket=${ssoTicket}&org=${orgCode}`

      if (res.success && res.data) {
        localStorage.setItem("ruoyi_token", res.data.token)
        localStorage.setItem("ruoyi_user", JSON.stringify(res.data.user))
        window.location.href = targetUrl
      } else {
        // 容错直入
        window.location.href = targetUrl
      }
    } catch {
      const targetUrl = ssoRole === "employee" ? "/workspace" : `/portal/enterprise?ticket=${ssoTicket}&org=${orgCode}`
      window.location.href = targetUrl
    } finally {
      setLoading(false)
    }
  }

  // 快捷填入并标记
  const fillPreset = (cb: () => void) => {
    cb()
    setError("")
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white antialiased">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-base shadow-sm">
              R
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-base">{projectProfile.platformName}</span>
              <span className="hidden sm:inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700 font-mono border border-blue-200 font-semibold">
                v{projectProfile.version}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/portal/enterprise" className="text-slate-500 hover:text-blue-600 transition font-medium">
              政企自服务专区 (CPC)
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/workspace" className="text-slate-500 hover:text-blue-600 transition font-medium">
              AI 协同工作台
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-4 text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {projectProfile.loginHeadline}
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {projectProfile.loginTagline}
            </p>
          </div>

          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 text-xs font-semibold text-slate-500 bg-slate-50/50">
            <button
              type="button"
              onClick={() => { setTab("password"); setError("") }}
              className={`flex-1 py-3.5 text-center transition-all ${tab === "password" ? "text-blue-600 border-b-2 border-blue-600 font-bold bg-white" : "hover:text-slate-900"}`}
            >
              账号密码
            </button>
            <button
              type="button"
              onClick={() => { setTab("sms"); setError("") }}
              className={`flex-1 py-3.5 text-center transition-all ${tab === "sms" ? "text-blue-600 border-b-2 border-blue-600 font-bold bg-white" : "hover:text-slate-900"}`}
            >
              手机验证
            </button>
            <button
              type="button"
              onClick={() => { setTab("sso"); setError("") }}
              className={`flex-1 py-3.5 text-center transition-all ${tab === "sso" ? "text-blue-600 border-b-2 border-blue-600 font-bold bg-white" : "hover:text-slate-900"}`}
            >
              企业单点 (SSO)
            </button>
            <button
              type="button"
              onClick={() => { setTab("qrcode"); setError("") }}
              className={`flex-1 py-3.5 text-center transition-all ${tab === "qrcode" ? "text-blue-600 border-b-2 border-blue-600 font-bold bg-white" : "hover:text-slate-900"}`}
            >
              扫码登录
            </button>
          </div>

          {error && (
            <div className="mx-8 mt-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 flex items-center gap-2 font-medium">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: 账号密码登录 */}
          {tab === "password" && (
            <form onSubmit={handlePwdLogin} className="p-8 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">登录账号 / 用户名</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="如 vps_adm / lin_manager / zhang_dev"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">登录密码</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={tenantEnabled}
                    onChange={(e) => setTenantEnabled(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>指定租户 ID (多租户隔离)</span>
                </label>
                <span className="text-[11px] text-slate-400">默认主租户: 1</span>
              </div>

              {tenantEnabled && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">租户编号 (Tenant ID)</label>
                  <input
                    type="text"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    placeholder="如 1 (主租户), 2 (政企), 3 (研发)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none font-mono"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {loading ? "正在验证登录..." : "登 录 管 理 后 台"}
              </button>

              {/* 快捷账号预设气泡 */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>多角色快捷体验气泡：</span>
                  {copied && <span className="text-emerald-600 font-bold">已填充！</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setUsername("vps_adm"); setPassword("RuoYi!Memory_2026#x9") })}
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                  >
                    👑 平台超管
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setUsername("lin_manager"); setPassword("RuoYi!Memory_2026#x9") })}
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                    title="客户经理、客户热力图、20%长尾分润"
                  >
                    💼 客户经理 (林经理)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setUsername("partner_lead"); setPassword("RuoYi!Memory_2026#x9") })}
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                    title="渠道商机报备锁定、客户签约与提现"
                  >
                    🤝 渠道合伙人 (陈总)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setUsername("li_director"); setPassword("RuoYi!Memory_2026#x9") })}
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                    title="监控机构算力池、员工开户授权"
                  >
                    🏛️ 机构主管 (李总)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setUsername("zhang_dev"); setPassword("RuoYi!Memory_2026#x9") })}
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                    title="公文/代码审计、WorkBuddy"
                  >
                    ⚡ 业务员工 (张工)
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: 手机免密验证码登录 */}
          {tab === "sms" && (
            <form onSubmit={handleSmsLogin} className="p-8 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">手机号码 (已授权开通席位)</label>
                <input
                  type="tel"
                  required
                  maxLength={11}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="如 13588886666 / 13800000001"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">短信动态验证码</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    placeholder="输入 6 位验证码"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleSendSms}
                    disabled={countdown > 0}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 font-semibold text-slate-700 transition-colors"
                  >
                    {countdown > 0 ? `${countdown}s 后重发` : "获取验证码"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                {loading ? "正在验证..." : "免 密 验 证 登 录"}
              </button>

              {/* 快捷手机预设 */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>多角色业务手机一键直填：</span>
                  {copied && <span className="text-emerald-600 font-bold">已填充！</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setMobile("13588886666"); setSmsCode("668822") })}
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                  >
                    💼 客户经理 (13588886666)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setMobile("18600186000"); setSmsCode("668822") })}
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                  >
                    🤝 渠道合伙人 (18600186000)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setMobile("13800000001"); setSmsCode("668822") })}
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                  >
                    🏛️ 机构主管 (13800000001)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setMobile("13911112222"); setSmsCode("668822") })}
                    className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                  >
                    ⚡ 研发张工 (13911112222)
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: 企业单点 / 统一身份 SSO Ticket 登录 */}
          {tab === "sso" && (
            <form onSubmit={handleSsoLogin} className="p-8 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">单点登录身份去向</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => {
                      setSsoRole("employee")
                      setSsoTicket("tkt-emp-chen-20260824")
                    }}
                    className={`py-1.5 rounded-lg transition-all ${ssoRole === "employee" ? "bg-white text-blue-600 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    👤 业务员工 / 团队成员
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSsoRole("admin")
                      setSsoTicket("tkt-gd-gov-998811")
                    }}
                    className={`py-1.5 rounded-lg transition-all ${ssoRole === "admin" ? "bg-white text-blue-600 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    🏛️ 机构管理员 / IT 负责人
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">所属机构 / 租户标识 (Org Code)</label>
                <select
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="gd-gov-data">数字政府运营中心 (gd-gov-data)</option>
                  <option value="yue-transport-tech">交通数智科技集团 (yue-transport-tech)</option>
                  <option value="standard-enterprise">商业企业 / 科技租户 (standard-enterprise)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">单点登录 Ticket 授权凭据</label>
                <input
                  type="text"
                  required
                  value={ssoTicket}
                  onChange={(e) => setSsoTicket(e.target.value)}
                  placeholder="如 tkt-emp-chen-20260824"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none font-mono"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-700 leading-relaxed">
                {ssoRole === "employee"
                  ? "💡 员工通过 OA / 钉钉 / 企微 / 统一身份认证单点免密直连，自动置换算力凭据并直达【AI 协同工作台】。"
                  : "🏛️ 机构管理员 / IT 负责人通过单点免密直达【企业自服务门户】，进行算力资产监控与人员席位管理。"}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 ${ssoRole === "employee" ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"} active:scale-[0.99] rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50`}
              >
                {loading ? "正在置换凭据..." : ssoRole === "employee" ? "⚡ 单点直达 AI 协同工作台" : "🏛️ 进入企业自服务门户"}
              </button>

              {/* 快捷单点票据 */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>快捷填入单点凭据：</span>
                  {copied && <span className="text-emerald-600 font-bold">已填充！</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setSsoRole("employee"); setOrgCode("gd-gov-data"); setSsoTicket("tkt-emp-chen-20260824") })}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                  >
                    👤 业务骨干 (工作台凭据)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset(() => { setSsoRole("admin"); setOrgCode("gd-gov-data"); setSsoTicket("tkt-gd-gov-998811") })}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-mono border border-slate-200"
                  >
                    🏛️ 机构主管 (大盘凭据)
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 4: 企微 / 钉钉 / 飞书 / 微信扫码登录 */}
          {tab === "qrcode" && (
            <div className="p-8 text-center space-y-4 text-xs">
              <div className="mx-auto w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-4 relative group">
                <div className="text-5xl mb-2">📱</div>
                <div className="text-xs font-bold text-slate-800">企业微信 / 钉钉 / 飞书 扫码</div>
                <div className="text-[10px] text-slate-400 mt-1">支持主流协同办公 App 扫一扫</div>

                {qrStatus === "ready" && (
                  <button
                    type="button"
                    onClick={() => {
                      setQrStatus("success")
                      setTimeout(() => {
                        localStorage.setItem("ruoyi_token", "mock-token-qr-login")
                        localStorage.setItem(
                          "ruoyi_user",
                          JSON.stringify({ id: "qr-user-1", username: "wx_user", nickname: "微信授权用户", roles: ["user"] })
                        )
                        window.location.href = "/workspace"
                      }, 800)
                    }}
                    className="mt-2.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    ⚡ 点击模拟扫码授权
                  </button>
                )}

                {qrStatus === "success" && (
                  <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center text-emerald-600 font-bold">
                    <span className="text-3xl mb-1">✅</span>
                    <span>扫码授权成功，正在跳转...</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400">
                扫码登录即代表您已同意《RoMA 应算通 服务协议》与《隐私政策》
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{projectProfile.copyright} {projectProfile.platformName}. All rights reserved.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>算力中枢 • 运营商清分 • 多智能体协同</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
