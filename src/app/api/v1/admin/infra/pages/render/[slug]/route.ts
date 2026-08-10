import { NextResponse } from "next/server"
import { InfraPageRepository } from "@/modules/infra/backend/repositories/page.repository"

type RouteContext = { params: Promise<{ slug: string }> }

/**
 * GET /api/v1/admin/infra/pages/render/:slug
 * 按 slug 获取已发布页面的 JSON 数据，供前端 Puck Render 使用
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params
    const page = await InfraPageRepository.findBySlug(slug)
    if (!page) return NextResponse.json({ success: false, error: "页面不存在或未发布" }, { status: 404 })
    return NextResponse.json({ success: true, data: { id: page.id, name: page.name, slug: page.slug, data: JSON.parse(page.data) } })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}
