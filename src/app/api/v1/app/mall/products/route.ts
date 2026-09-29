import { NextResponse } from "next/server"
import { ensureAppAuth } from "@/modules/shared/backend/lib/app-auth-guard"

/**
 * 商品列表 - 用户端（允许游客浏览）
 * GET /api/v1/app/mall/products
 */
export async function GET(request: Request) {
  try {
    const auth = ensureAppAuth(request)
    const { searchParams } = new URL(request.url)
    const input = {
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("pageSize") || 20),
      keyword: searchParams.get("keyword") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
    }

    // TODO: 调用 MallProductService.listForApp(input, auth)
    return NextResponse.json({
      success: true,
      data: { items: [], total: 0, page: input.page, pageSize: input.pageSize },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status: 400 })
  }
}
