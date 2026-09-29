import { NextResponse } from "next/server"
import { PageSchemaService } from "@/modules/online/backend/services/page-schema.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type Ctx = { params: Promise<{ entity: string }> }

/** 读取某实体页面 Schema GET /api/v1/admin/online/page-schema/:entity */
export const GET = withAdminRoute(
  async (_request, _auth, ctx: Ctx) => {
    const { entity } = await ctx.params
    const data = await PageSchemaService.get(entity)
    return NextResponse.json({ success: true, data })
  },
  { permission: PERMISSIONS.ONLINE_PAGE_SCHEMA_QUERY },
)

/** 更新页面 Schema（title/fields 整体）PUT — 同步真加物理列 */
export const PUT = withAdminRoute(
  async (request, _auth, ctx: Ctx) => {
    const { entity } = await ctx.params
    const body = await request.json().catch(() => ({}))
    const data = await PageSchemaService.update(entity, body)
    return NextResponse.json({ success: true, data })
  },
  { permission: PERMISSIONS.ONLINE_PAGE_SCHEMA_UPDATE },
)

/** 追加一个字段（"客户加个字段"最短路径）POST — 同步真 ALTER TABLE ADD COLUMN */
export const POST = withAdminRoute(
  async (request, _auth, ctx: Ctx) => {
    const { entity } = await ctx.params
    const body = await request.json().catch(() => ({}))
    const data = await PageSchemaService.addField(entity, body)
    return NextResponse.json({ success: true, data })
  },
  { permission: PERMISSIONS.ONLINE_PAGE_SCHEMA_UPDATE },
)
