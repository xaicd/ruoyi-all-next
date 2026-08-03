import Link from "next/link"

const quickLinks = [
  { href: "/admin/system/users", label: "系统-用户管理" },
  { href: "/admin/system/online-users", label: "系统-在线用户" },
  { href: "/admin/infra/template-engine", label: "基础设施-模板引擎" },
]

export default function HomePage() {
  return (
    <main className="home-shell">
      <section className="hero-card">
        <p className="hero-eyebrow">RuoYi All Next</p>
        <h1>可独立运行的全栈基座已就绪</h1>
        <p>
          从 yudao-mini 与 yudao-ui-admin-vue3 吸收能力，先完成 Next 全栈最小可运行闭环，
          再按域持续补全治理与业务能力。
        </p>
      </section>

      <section className="quick-card">
        <h2>快速入口</h2>
        <ul>
          {quickLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
