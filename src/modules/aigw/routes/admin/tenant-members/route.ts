import { NextResponse } from "next/server"
import { aigwMemberAllocationRepository } from "@/modules/aigw/backend/repositories/aigw-member-allocation.repository"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenantId") || undefined
    const keyword = searchParams.get("keyword") || undefined
    const status = searchParams.get("status") || undefined
    const items = await aigwMemberAllocationRepository.findAll({ tenantId, keyword, status })
    return NextResponse.json({ success: true, data: { items, total: items.length } })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const item = await aigwMemberAllocationRepository.create({
      tenantId: body.tenantId || "1",
      phone: body.phone,
      name: body.name,
      deptName: body.deptName || "综合管理部",
      monthlyTokenCap: Number(body.monthlyTokenCap || 5_000_000),
      momaBeansBalance: Number(body.momaBeansBalance || 5000),
      allowedApps: body.allowedApps || ["workbuddy"],
      status: body.status || "ACTIVE",
    })
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
    const updated = await aigwMemberAllocationRepository.update(id, data)
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
    const ok = await aigwMemberAllocationRepository.delete(id)
    return NextResponse.json({ success: ok })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
