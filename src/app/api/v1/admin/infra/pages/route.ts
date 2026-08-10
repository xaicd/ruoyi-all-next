import { NextResponse } from "next/server"
import { InfraPageRepository } from "@/modules/infra/backend/repositories/page.repository"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const pages = await InfraPageRepository.findAll({ status })
    return NextResponse.json({ success: true, data: pages })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, data, status, remark } = body
    if (!name || !slug || !data) {
      return NextResponse.json({ success: false, error: "name, slug, data 为必填" }, { status: 400 })
    }
    const page = await InfraPageRepository.create({ name, slug, data, status, remark })
    return NextResponse.json({ success: true, data: page })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}
