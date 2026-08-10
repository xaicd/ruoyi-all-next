import { NextResponse } from "next/server"
import { InfraPageRepository } from "@/modules/infra/backend/repositories/page.repository"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const page = await InfraPageRepository.findById(id)
    if (!page) return NextResponse.json({ success: false, error: "页面不存在" }, { status: 404 })
    return NextResponse.json({ success: true, data: page })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const page = await InfraPageRepository.update(id, body)
    return NextResponse.json({ success: true, data: page })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    await InfraPageRepository.delete(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}
