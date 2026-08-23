import Link from "next/link"
import { projectProfile } from "@/modules/shared/contract/project-profile"

const systemModules = [
  { href: "/admin/system/users", label: "用户管理", icon: "👤", desc: "管理系统用户账号" },
  { href: "/admin/system/roles", label: "角色管理", icon: "🛡️", desc: "角色与数据权限" },
  { href: "/admin/system/menus", label: "菜单管理", icon: "📋", desc: "菜单权限配置" },
  { href: "/admin/system/depts", label: "部门管理", icon: "🏢", desc: "组织架构维护" },
  { href: "/admin/system/posts", label: "岗位管理", icon: "💼", desc: "岗位编制管理" },
  { href: "/admin/system/dicts", label: "字典管理", icon: "📖", desc: "数据字典维护" },
]

const infraModules = [
  { href: "/admin/infra/configs", label: "系统配置", icon: "⚙️", desc: "运行参数配置" },
  { href: "/admin/infra/template-engine", label: "模板引擎", icon: "🔧", desc: "低代码生成" },
]

const stats = [
  { label: "业务域", value: "15", color: "from-blue-500 to-blue-600" },
  { label: "API 端点", value: "2,095", color: "from-emerald-500 to-emerald-600" },
  { label: "页面模块", value: "130", color: "from-violet-500 to-violet-600" },
  { label: "数据库支持", value: "9+", color: "from-amber-500 to-amber-600" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={projectProfile.branding.logoSrc} alt={projectProfile.platformName} className="h-9 w-9 rounded-lg" />
            <span className="text-lg font-semibold text-slate-900">{projectProfile.platformName}</span>
          </div>
          <Link href="/login" className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            登录后台
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Hero */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {projectProfile.loginHeadline}
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-500">
            {projectProfile.description}
          </p>
        </section>

        {/* Stats */}
        <section className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              <div className={`mt-3 h-1 w-12 rounded-full bg-gradient-to-r ${stat.color}`} />
            </div>
          ))}
        </section>

        {/* System Modules */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">系统管理</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {systemModules.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="group rounded-xl border bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="text-2xl">{m.icon}</div>
                <p className="mt-2 text-sm font-medium text-slate-900 group-hover:text-blue-600">{m.label}</p>
                <p className="mt-0.5 text-xs text-slate-400">{m.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Infra Modules */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-emerald-600" />
            <h2 className="text-lg font-semibold text-slate-900">基础设施</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {infraModules.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="group rounded-xl border bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                <div className="text-2xl">{m.icon}</div>
                <p className="mt-2 text-sm font-medium text-slate-900 group-hover:text-emerald-600">{m.label}</p>
                <p className="mt-0.5 text-xs text-slate-400">{m.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-900">技术架构</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
            <div><span className="text-slate-400">框架</span><p className="font-medium text-slate-700">Next.js 15</p></div>
            <div><span className="text-slate-400">语言</span><p className="font-medium text-slate-700">TypeScript 5</p></div>
            <div><span className="text-slate-400">ORM</span><p className="font-medium text-slate-700">Kysely + Prisma</p></div>
            <div><span className="text-slate-400">校验</span><p className="font-medium text-slate-700">Zod</p></div>
            <div><span className="text-slate-400">数据库</span><p className="font-medium text-slate-700">PG / MySQL / 国产</p></div>
            <div><span className="text-slate-400">部署</span><p className="font-medium text-slate-700">Docker + Traefik</p></div>
            <div><span className="text-slate-400">认证</span><p className="font-medium text-slate-700">JWT + RBAC</p></div>
            <div><span className="text-slate-400">架构</span><p className="font-medium text-slate-700">模块化单体 → 微服务</p></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-center text-xs text-slate-400">
        {projectProfile.platformName} v{projectProfile.version} · {projectProfile.copyright}
      </footer>
    </div>
  )
}
