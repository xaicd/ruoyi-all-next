import { NextResponse } from "next/server"
import { PageSchemaService } from "@/modules/online/backend/services/page-schema.service"

/**
 * C 端只读页面 Schema GET /api/v1/open/meta/page-schema/:entity
 * 供 C 端（portal Web / Expo）的 Schema 驱动渲染器消费——同一份 Schema，端无关。
 */
export async function GET(_request: Request, ctx: { params: Promise<{ entity: string }> }) {
  const { entity } = await ctx.params
  const data = await PageSchemaService.get(entity)
  return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "public, max-age=30" } })
}
