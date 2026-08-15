import { NextResponse } from "next/server"
import { InfraPageRepository } from "@/modules/infra/backend/repositories/page.repository"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ slug: string }> }

/** Legacy migration reader only. Published Online releases use a separate renderer in a later phase. */
export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { slug } = await context.params
  const page = await InfraPageRepository.findBySlug(slug)
  if (!page) return NextResponse.json({ success: false, error: "页面不存在或未发布" }, { status: 404 })
  return NextResponse.json({ success: true, data: { id: page.id, name: page.name, slug: page.slug, data: JSON.parse(page.data) } })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_QUERY })
