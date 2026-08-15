import { redirect } from "next/navigation"

/** Legacy Puck JSON pages are no longer rendered as production-style Online pages. */
export default function LegacyDynamicPageRedirect() {
  redirect("/admin/infra/online-definitions")
}
