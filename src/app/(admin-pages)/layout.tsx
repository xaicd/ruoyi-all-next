"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { request } from "@/modules/shared/frontend/lib/request"

type SidebarItem = { id: string; href: string | null; label: string; icon: string; children: SidebarItem[] }
type SidebarGroup = { id: string; title: string; icon: string; children: SidebarItem[] }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [username, setUsername] = useState("admin")
  const [authChecked, setAuthChecked] = useState(false)
  const [menuGroups, setMenuGroups] = useState<SidebarGroup[]>([])

  useEffect(() => {
    // Auth guard
    const token = localStorage.getItem("ruoyi_token")
    if (!token) { window.location.href = "/login"; return }

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
      localStorage.removeItem("ruoyi_token")
      localStorage.removeItem("ruoyi_user")
      window.location.href = "/login"
      return
    }

    try {
      const user = localStorage.getItem("ruoyi_user")
      if (user) {
        const parsed = JSON.parse(user)
        setUsername(parsed.nickname || parsed.username || "admin")
      }
    } catch {}

    setAuthChecked(true)

    // 左侧导航与菜单管理共用 system_menu 数据源，避免静态分组和授权树不一致。
    request.get<SidebarGroup[]>("/api/v1/admin/system/menus/sidebar")
      .then((res) => {
        if (res.success) setMenuGroups(res.data ?? [])
      })
      .catch(() => setMenuGroups([]))
  }, [])

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
        <div className="flex h-14 items-center border-b px-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-xs font-bold text-white">R</div>
          {!collapsed && <span className="ml-2.5 text-sm font-semibold text-slate-900 whitespace-nowrap">RuoYi Admin</span>}
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {menuGroups.map((group) => (
            <MenuGroup key={group.id} group={group} pathname={pathname} collapsed={collapsed} />
          ))}
        </nav>

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

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">首页</Link>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-700">{getPageTitle(pathname, menuGroups)}</span>
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

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function isActive(item: SidebarItem, pathname: string): boolean {
  return Boolean(item.href && (pathname === item.href || pathname.startsWith(item.href + "/")))
    || item.children.some((child) => isActive(child, pathname))
}

function MenuGroup({ group, pathname, collapsed }: { group: SidebarGroup; pathname: string; collapsed: boolean }) {
  const hasActiveChild = group.children.some((item) => isActive(item, pathname))
  const [open, setOpen] = useState(hasActiveChild)

  useEffect(() => {
    if (hasActiveChild) setOpen(true)
  }, [hasActiveChild])

  if (collapsed) {
    const links = flattenLinks(group.children)
    return (
      <div className="mb-2">
        {links.map((item) => (
          <SidebarLink key={item.id} item={item} pathname={pathname} collapsed />
        ))}
      </div>
    )
  }

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition ${hasActiveChild ? "font-medium text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
      >
        <span className="shrink-0 text-base">{group.icon}</span>
        <span className="flex-1 truncate text-left">{group.title}</span>
        <Chevron open={open} />
      </button>
      {open && <MenuTreeItems items={group.children} pathname={pathname} level={1} />}
    </div>
  )
}

function MenuTreeItems({ items, pathname, level }: { items: SidebarItem[]; pathname: string; level: number }) {
  return (
    <ul className={`mt-0.5 space-y-0.5 ${level === 1 ? "ml-4 border-l border-slate-100 pl-2" : "ml-3 border-l border-slate-100 pl-2"}`}>
      {items.map((item) => <MenuTreeItem key={item.id} item={item} pathname={pathname} level={level} />)}
    </ul>
  )
}

function MenuTreeItem({ item, pathname, level }: { item: SidebarItem; pathname: string; level: number }) {
  const hasChildren = item.children.length > 0
  const active = isActive(item, pathname)
  const [open, setOpen] = useState(active)

  useEffect(() => {
    if (active) setOpen(true)
  }, [active])

  if (!hasChildren) {
    return <li><SidebarLink item={item} pathname={pathname} /></li>
  }

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition ${active ? "font-medium text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
      >
        <span className="shrink-0 text-sm">{item.icon}</span>
        <span className="flex-1 truncate text-left">{item.label}</span>
        <Chevron open={open} />
      </button>
      {open && <MenuTreeItems items={item.children} pathname={pathname} level={level + 1} />}
    </li>
  )
}

function SidebarLink({ item, pathname, collapsed = false }: { item: SidebarItem; pathname: string; collapsed?: boolean }) {
  const active = isActive(item, pathname)
  const className = collapsed
    ? `mb-0.5 flex items-center justify-center rounded-lg py-2 transition ${active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`
    : `flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition ${active ? "bg-blue-50 font-medium text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`

  if (!item.href) {
    return <span title={`${item.label}（页面尚未实现）`} className={`${className} cursor-not-allowed opacity-50`}><span className="shrink-0 text-sm">{item.icon}</span>{!collapsed && <span className="truncate">{item.label}</span>}</span>
  }

  return <Link href={item.href} title={collapsed ? item.label : undefined} className={className}><span className="shrink-0 text-sm">{item.icon}</span>{!collapsed && <span className="truncate">{item.label}</span>}</Link>
}

function Chevron({ open }: { open: boolean }) {
  return <svg className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
}

function flattenLinks(items: SidebarItem[]): SidebarItem[] {
  return items.flatMap((item) => item.href ? [item] : flattenLinks(item.children))
}

function getPageTitle(pathname: string, menuGroups: SidebarGroup[]): string {
  const findTitle = (items: SidebarItem[]): string | undefined => {
    for (const item of items) {
      if (item.href && (pathname === item.href || pathname.startsWith(item.href + "/"))) return item.label
      const childTitle = findTitle(item.children)
      if (childTitle) return childTitle
    }
  }
  for (const group of menuGroups) {
    const title = findTitle(group.children)
    if (title) return title
  }
  return "管理后台"
}
