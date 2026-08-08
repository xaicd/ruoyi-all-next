"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const menuGroups = [
  {
    title: "系统管理",
    items: [
      { href: "/admin/system/users", label: "用户管理", icon: "👤" },
      { href: "/admin/system/roles", label: "角色管理", icon: "🛡️" },
      { href: "/admin/system/menus", label: "菜单管理", icon: "📋" },
      { href: "/admin/system/depts", label: "部门管理", icon: "🏢" },
      { href: "/admin/system/posts", label: "岗位管理", icon: "💼" },
      { href: "/admin/system/dicts", label: "字典管理", icon: "📖" },
      { href: "/admin/system/tenants", label: "租户管理", icon: "🏠" },
    ],
  },
  {
    title: "基础设施",
    items: [
      { href: "/admin/infra/configs", label: "系统配置", icon: "⚙️" },
      { href: "/admin/infra/job-center", label: "定时任务", icon: "⏰" },
      { href: "/admin/infra/files", label: "文件管理", icon: "📁" },
      { href: "/admin/infra/codegen", label: "代码生成", icon: "🔧" },
    ],
  },
  {
    title: "系统监控",
    items: [
      { href: "/admin/system/online-users", label: "在线用户", icon: "🟢" },
      { href: "/admin/system/login-logs", label: "登录日志", icon: "📝" },
      { href: "/admin/system/operate-logs", label: "操作日志", icon: "📊" },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r bg-white">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-bold text-white">R</div>
          <span className="text-sm font-semibold text-slate-900">RuoYi Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-4">
              <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition ${
                          active
                            ? "bg-blue-50 font-medium text-blue-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t px-4 py-3">
          <p className="text-[10px] text-slate-300">v0.1.0 · 内存模式</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-14 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">首页</Link>
            <span>/</span>
            <span className="text-slate-900">{getPageTitle(pathname)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">admin</span>
            <button
              onClick={() => { localStorage.removeItem("ruoyi_token"); window.location.href = "/login" }}
              className="rounded-md border px-3 py-1.5 text-xs text-slate-500 transition hover:border-red-200 hover:text-red-600"
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

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/admin/system/users": "用户管理",
    "/admin/system/roles": "角色管理",
    "/admin/system/menus": "菜单管理",
    "/admin/system/depts": "部门管理",
    "/admin/system/posts": "岗位管理",
    "/admin/system/dicts": "字典管理",
    "/admin/system/tenants": "租户管理",
    "/admin/system/online-users": "在线用户",
    "/admin/system/login-logs": "登录日志",
    "/admin/system/operate-logs": "操作日志",
    "/admin/infra/configs": "系统配置",
    "/admin/infra/job-center": "定时任务",
    "/admin/infra/files": "文件管理",
    "/admin/infra/codegen": "代码生成",
  }
  return map[pathname] || "管理后台"
}
