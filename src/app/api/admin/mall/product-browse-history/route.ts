import { NextResponse } from "next/server"
import { ProductBrowseHistoryService } from "@/modules/mall/backend/services/product-browse-history.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (id) {
      const data = await ProductBrowseHistoryService.get(id)
      return NextResponse.json({ success: true, data })
    }
    const input = {
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("pageSize") || 20),
      keyword: searchParams.get("keyword") || undefined,
    }
    const data = await ProductBrowseHistoryService.page(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await ProductBrowseHistoryService.create(body)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "创建失败" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const data = await ProductBrowseHistoryService.update(body)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "更新失败" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ success: false, error: "id 不能为空" }, { status: 400 })
    const data = await ProductBrowseHistoryService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "删除失败" }, { status: 400 })
  }
}
