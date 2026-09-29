import { NextRequest, NextResponse } from "next/server"
import { aigwSettlementRepository } from "@/modules/aigw/backend/repositories/aigw-settlement.repository"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page") || "1")
  const pageSize = Number(searchParams.get("pageSize") || "20")
  const tenantId = req.headers.get("x-tenant-id") || "1"

  const data = await aigwSettlementRepository.findPage(tenantId, page, pageSize)
  return NextResponse.json({ code: 0, msg: "success", data })
}

export async function POST(req: NextRequest) {
  const tenantId = req.headers.get("x-tenant-id") || "1"
  const body = await req.json()
  const data = await aigwSettlementRepository.create(tenantId, body)
  return NextResponse.json({ code: 0, msg: "success", data })
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ code: 400, msg: "ID is required" }, { status: 400 })
  const body = await req.json()
  const data = await aigwSettlementRepository.update(id, body)
  return NextResponse.json({ code: 0, msg: "success", data })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ code: 400, msg: "ID is required" }, { status: 400 })
  await aigwSettlementRepository.delete(id)
  return NextResponse.json({ code: 0, msg: "success" })
}
