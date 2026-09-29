import { NextRequest, NextResponse } from "next/server"
import { AigwMcpRepository } from "@/modules/aigw/backend/repositories/aigw-mcp.repository"
import { createMcpAssetSchema, updateMcpAssetSchema, mcpAssetPageQuerySchema } from "@/modules/aigw/backend/validators/aigw-mcp.validator"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = mcpAssetPageQuerySchema.parse({
      page: searchParams.get("page") || 1,
      pageSize: searchParams.get("pageSize") || 20,
      keyword: searchParams.get("keyword") || undefined,
      category: searchParams.get("category") || undefined,
      status: searchParams.get("status") || undefined,
    })

    const result = await AigwMcpRepository.page(query)
    return NextResponse.json({
      code: 0,
      msg: "success",
      data: result,
      total: result.total,
      success: true,
    })
  } catch (err: any) {
    return NextResponse.json({ code: 400, msg: err.message, success: false }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const input = createMcpAssetSchema.parse(body)
    const item = await AigwMcpRepository.create(input)
    return NextResponse.json({
      code: 0,
      msg: "上架成功",
      data: item,
      success: true,
    })
  } catch (err: any) {
    return NextResponse.json({ code: 400, msg: err.message, success: false }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const input = updateMcpAssetSchema.parse(body)
    const item = await AigwMcpRepository.update(input)
    return NextResponse.json({
      code: 0,
      msg: "更新成功",
      data: item,
      success: true,
    })
  } catch (err: any) {
    return NextResponse.json({ code: 400, msg: err.message, success: false }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ code: 400, msg: "缺少 id 参数", success: false }, { status: 400 })
    }
    const success = await AigwMcpRepository.delete(id)
    return NextResponse.json({
      code: 0,
      msg: success ? "删除成功" : "未找到记录",
      data: { success },
      success,
    })
  } catch (err: any) {
    return NextResponse.json({ code: 500, msg: err.message, success: false }, { status: 500 })
  }
}
