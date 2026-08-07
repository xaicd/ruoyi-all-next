import Link from "next/link"

const systemLinks = [
  { href: "/admin/system/users", label: "用户管理" },
  { href: "/admin/system/roles", label: "角色管理" },
  { href: "/admin/system/menus", label: "菜单管理" },
  { href: "/admin/system/depts", label: "部门管理" },
  { href: "/admin/system/posts", label: "岗位管理" },
  { href: "/admin/system/dicts", label: "字典管理" },
]

const infraLinks = [
  { href: "/admin/infra/configs", label: "系统配置" },
  { href: "/admin/infra/template-engine", label: "模板引擎" },
]

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <section className="mb-8 rounded-xl border bg-white p-6">
        <p className="text-sm font-medium text-blue-600">RuoYi All Next</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">企业级全栈管理平台</h1>
        <p className="mt-2 text-sm text-slate-500">
          基于 Next.js 15 + Kysely + Prisma 的模块化单体架构，支持 PostgreSQL / MySQL / SQLite 及国产数据库。
        </p>
        <div className="mt-4">
          <Link href="/login" className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            登录管理后台
          </Link>
        </div>
      </section>

      <section className="mb-6 rounded-xl border bg-white p-6">
        <h2 className="mb-3 text-base font-semibold text-slate-900">系统管理</h2>
        <div className="grid grid-cols-3 gap-2">
          {systemLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg border px-3 py-2 text-sm text-slate-700 hover:border-blue-300 hover:bg-blue-50">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6">
        <h2 className="mb-3 text-base font-semibold text-slate-900">基础设施</h2>
        <div className="grid grid-cols-3 gap-2">
          {infraLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg border px-3 py-2 text-sm text-slate-700 hover:border-blue-300 hover:bg-blue-50">
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
