import { NextRequest, NextResponse } from "next/server"
import { aigwSkuRepository } from "@/modules/aigw/backend/repositories/aigw-sku.repository"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page") || "1")
  const pageSize = Number(searchParams.get("pageSize") || "20")
  const tenantId = req.headers.get("x-tenant-id") || "1"

  const data = await aigwSkuRepository.findPage(tenantId, page, pageSize)
  return NextResponse.json({ code: 0, msg: "success", data })
}

export async function POST(req: NextRequest) {
  const tenantId = req.headers.get("x-tenant-id") || "1"
  const body = await req.json()
  const data = await aigwSkuRepository.create(tenantId, body)
  return NextResponse.json({ code: 0, msg: "success", data })
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ code: 400, msg: "ID is required" }, { status: 400 })
  const body = await req.json()
  const data = await aigwSkuRepository.update(id, body)
  return NextResponse.json({ code: 0, msg: "success", data })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ code: 400, msg: "ID is required" }, { status: 400 })
  await aigwSkuRepository.delete(id)
  return NextResponse.json({ code: 0, msg: "success" })
}
