"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

const menuGroups = [
  {
    title: "系统管理",
    icon: "⚙️",
    children: [
      { href: "/admin/system/users", label: "用户管理", icon: "👤" },
      { href: "/admin/system/roles", label: "角色管理", icon: "🛡️" },
      { href: "/admin/system/menus", label: "菜单管理", icon: "📋" },
      { href: "/admin/system/depts", label: "部门管理", icon: "🏢" },
      { href: "/admin/system/posts", label: "岗位管理", icon: "💼" },
      { href: "/admin/system/dicts", label: "字典管理", icon: "📖" },
      { href: "/admin/system/notices", label: "通知公告", icon: "📢" },
      { href: "/admin/system/tenants", label: "租户管理", icon: "🏠" },
      { href: "/admin/system/tenant-packages", label: "租户套餐", icon: "📦" },
    ],
  },
  {
    title: "认证安全",
    icon: "🔐",
    children: [
      { href: "/admin/system/oauth2-clients", label: "OAuth2 客户端", icon: "🔑" },
      { href: "/admin/system/oauth2-tokens", label: "令牌管理", icon: "🎫" },
      { href: "/admin/system/social-users", label: "社交用户", icon: "🌐" },
    ],
  },
  {
    title: "消息通知",
    icon: "📬",
    children: [
      { href: "/admin/system/sms-channels", label: "短信渠道", icon: "📱" },
      { href: "/admin/system/sms-logs", label: "短信日志", icon: "📨" },
      { href: "/admin/system/mail-accounts", label: "邮箱账号", icon: "✉️" },
      { href: "/admin/system/mail-logs", label: "邮件日志", icon: "📧" },
      { href: "/admin/system/notify-templates", label: "通知模板", icon: "📄" },
      { href: "/admin/system/notify-messages", label: "通知记录", icon: "🔔" },
    ],
  },
  {
    title: "基础设施",
    icon: "🔧",
    children: [
      { href: "/admin/infra/configs", label: "参数设置", icon: "⚙️" },
      { href: "/admin/infra/job-center", label: "定时任务", icon: "⏰" },
      { href: "/admin/infra/files", label: "文件管理", icon: "📁" },
      { href: "/admin/infra/codegen", label: "代码生成", icon: "🛠️" },
      { href: "/admin/infra/page-builder", label: "页面构建", icon: "🎨" },
      { href: "/admin/infra/api-logs", label: "API 日志", icon: "📡" },
      { href: "/admin/infra/api-error-logs", label: "错误日志", icon: "🐛" },
      { href: "/admin/infra/db-configs", label: "数据源配置", icon: "🗄️" },
    ],
  },
  {
    title: "支付中心",
    icon: "💰",
    children: [
      { href: "/admin/pay/orders", label: "支付订单", icon: "💳" },
      { href: "/admin/pay/refunds", label: "退款订单", icon: "↩️" },
    ],
  },
  {
    title: "CRM 客户",
    icon: "🤝",
    children: [
      { href: "/admin/crm/customers", label: "客户管理", icon: "👥" },
      { href: "/admin/crm/clues", label: "线索管理", icon: "🎯" },
    ],
  },
  {
    title: "系统监控",
    icon: "📊",
    children: [
      { href: "/admin/system/online-users", label: "在线用户", icon: "🟢" },
      { href: "/admin/system/login-logs", label: "登录日志", icon: "📝" },
      { href: "/admin/system/operate-logs", label: "操作日志", icon: "📊" },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [username, setUsername] = useState("admin")
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Auth guard: 检查 token 是否存在
    const token = localStorage.getItem("ruoyi_token")
    if (!token) {
      window.location.href = "/login"
      return
    }

    // 解析 JWT 检查过期
    try {
      const parts = token.split(".")
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("ruoyi_token")
          localStorage.removeItem("ruoyi_user")
          window.location.href = "/login?expired=1"
          return
        }
      }
    } catch {
      // token 解析失败，清理后跳转
      localStorage.removeItem("ruoyi_token")
      localStorage.removeItem("ruoyi_user")
      window.location.href = "/login"
      return
    }

    // 读取用户信息
    try {
      const user = localStorage.getItem("ruoyi_user")
      if (user) {
        const parsed = JSON.parse(user)
        setUsername(parsed.nickname || parsed.username || "admin")
      }
    } catch {}

    setAuthChecked(true)
  }, [])

  // 未通过 auth 检查时显示加载状态
  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-400">验证登录状态...</div>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("ruoyi_token")
    localStorage.removeItem("ruoyi_user")
    window.location.href = "/login"
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className={`flex flex-col border-r bg-white transition-all duration-200 ${collapsed ? "w-16" : "w-60"}`}>
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-bold text-white">R</div>
          {!collapsed && <span className="ml-2.5 text-sm font-semibold text-slate-900 whitespace-nowrap">RuoYi Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {menuGroups.map((group) => (
            <MenuGroup key={group.title} group={group} pathname={pathname} collapsed={collapsed} />
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t px-2 py-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg py-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
            title={collapsed ? "展开" : "收起"}
          >
            <svg className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-14 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">首页</Link>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-700">{getPageTitle(pathname)}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-700">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              退出
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function MenuGroup({ group, pathname, collapsed }: { group: typeof menuGroups[0]; pathname: string; collapsed: boolean }) {
  const hasActiveChild = group.children.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
  const [open, setOpen] = useState(hasActiveChild)

  if (collapsed) {
    return (
      <div className="mb-2">
        {group.children.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link key={item.href} href={item.href} title={item.label} className={`flex items-center justify-center rounded-lg py-2 mb-0.5 transition ${active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
              <span className="text-base">{item.icon}</span>
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition ${hasActiveChild ? "text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
      >
        <span className="text-base shrink-0">{group.icon}</span>
        <span className="flex-1 text-left truncate">{group.title}</span>
        <svg className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {open && (
        <ul className="mt-0.5 ml-4 space-y-0.5 border-l border-slate-100 pl-2">
          {group.children.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition ${active ? "bg-blue-50 font-medium text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  <span className="text-sm shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/admin/system/users": "用户管理",
    "/admin/system/roles": "角色管理",
    "/admin/system/menus": "菜单管理",
    "/admin/system/depts": "部门管理",
    "/admin/system/posts": "岗位管理",
    "/admin/system/dicts": "字典管理",
    "/admin/system/tenants": "租户管理",
    "/admin/system/tenant-packages": "租户套餐",
    "/admin/system/notices": "通知公告",
    "/admin/system/online-users": "在线用户",
    "/admin/system/login-logs": "登录日志",
    "/admin/system/operate-logs": "操作日志",
    "/admin/system/oauth2-clients": "OAuth2 客户端",
    "/admin/system/oauth2-tokens": "令牌管理",
    "/admin/system/social-users": "社交用户",
    "/admin/system/sms-channels": "短信渠道",
    "/admin/system/sms-logs": "短信日志",
    "/admin/system/mail-accounts": "邮箱账号",
    "/admin/system/mail-logs": "邮件日志",
    "/admin/system/notify-templates": "通知模板",
    "/admin/system/notify-messages": "通知记录",
    "/admin/infra/configs": "参数设置",
    "/admin/infra/job-center": "定时任务",
    "/admin/infra/files": "文件管理",
    "/admin/infra/codegen": "代码生成",
    "/admin/infra/page-builder": "页面构建",
    "/admin/infra/api-logs": "API 日志",
    "/admin/infra/api-error-logs": "错误日志",
    "/admin/infra/db-configs": "数据源配置",
    "/admin/pay/orders": "支付订单",
    "/admin/pay/refunds": "退款订单",
    "/admin/crm/customers": "客户管理",
    "/admin/crm/clues": "线索管理",
  }
  return map[pathname] || "管理后台"
}
