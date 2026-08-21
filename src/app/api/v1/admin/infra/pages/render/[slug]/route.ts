import { NextResponse } from "next/server"
import { InfraPageService } from "@/modules/infra/backend/services/page.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

type RouteContext = { params: Promise<{ slug: string }> }

/** Legacy migration reader only. Published Online releases use a separate renderer in a later phase. */
export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { slug } = await context.params
  const page = await InfraPageService.getPageBySlug(parseActionBody(INFRA_ACTION_SCHEMAS["infra.getPageBySlug"], { slug }))
  if (!page) return NextResponse.json({ success: false, error: "页面不存在或未发布" }, { status: 404 })
  return NextResponse.json({ success: true, data: { id: page.id, name: page.name, slug: page.slug, data: JSON.parse(page.data) } })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_QUERY })
