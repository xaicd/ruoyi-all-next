import { NextResponse } from "next/server"
import { aigwIsvAppRepository } from "@/modules/aigw/backend/repositories/aigw-isv-app.repository"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const keyword = searchParams.get("keyword") || undefined
    const category = searchParams.get("category") || undefined
    const items = await aigwIsvAppRepository.findAll({ status, keyword, category })
    return NextResponse.json({ success: true, data: { items, total: items.length } })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const item = await aigwIsvAppRepository.create(body)
    return NextResponse.json({ success: true, data: item })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ success: false, error: "缺少 id" }, { status: 400 })
    const updated = await aigwIsvAppRepository.update(id, data)
    return NextResponse.json({ success: true, data: updated })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ success: false, error: "缺少 id" }, { status: 400 })
    const ok = await aigwIsvAppRepository.delete(id)
    return NextResponse.json({ success: ok })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
