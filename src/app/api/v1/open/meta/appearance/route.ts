import { NextResponse } from "next/server"
import { AppearanceService } from "@/modules/infra/backend/services/appearance.service"

/**
 * C 端公开只读站点/主题外观 GET /api/v1/open/meta/appearance
 * 无需登录（游客可读），供各端（H5/PC/App）消费主题与品牌。无配置时返回默认值。
 */
export async function GET() {
  const data = await AppearanceService.getPublic()
  return NextResponse.json(
    { success: true, data },
    { headers: { "Cache-Control": "public, max-age=60" } },
  )
}
