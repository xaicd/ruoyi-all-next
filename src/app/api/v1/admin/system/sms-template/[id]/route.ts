import { NextResponse } from "next/server"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  // TODO: 实现短信模板详情查询
  return NextResponse.json({ success: false, error: `短信模板 ${id} 详情待实现` }, { status: 501 })
}

export async function PUT(_request: Request, context: RouteContext) {
  const { id } = await context.params
  return NextResponse.json({ success: false, error: `短信模板 ${id} 更新待实现` }, { status: 501 })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  return NextResponse.json({ success: false, error: `短信模板 ${id} 删除待实现` }, { status: 501 })
}
