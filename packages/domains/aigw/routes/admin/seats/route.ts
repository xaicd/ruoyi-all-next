import { NextRequest, NextResponse } from "next/server"
import { aigwSeatService } from "@/modules/aigw/backend/services"
import { createSeatSchema } from "@/modules/aigw/backend/validators"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page") || "1")
  const pageSize = Number(searchParams.get("pageSize") || "20")
  const enterpriseId = searchParams.get("enterpriseId") || undefined
  const tenantId = req.headers.get("x-tenant-id") || "1"

  const data = await aigwSeatService.getPage(tenantId, page, pageSize, enterpriseId)
  return NextResponse.json({ code: 0, msg: "success", data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = createSeatSchema.parse(body)
  const tenantId = req.headers.get("x-tenant-id") || "1"

  const data = await aigwSeatService.create(tenantId, parsed)
  return NextResponse.json({ code: 0, msg: "success", data })
}
