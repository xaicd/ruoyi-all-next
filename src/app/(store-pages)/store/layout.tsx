import type { ReactNode } from "react"

export const dynamic = "force-dynamic"

/** C 端（用户前台）路由组布局。与 (admin-pages) 隔离，供平台"C 端预览"指向 /store。 */
export default function StoreLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>
}
