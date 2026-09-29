import { NextRequest, NextResponse } from "next/server"
import { aigwEnterpriseService } from "@/modules/aigw/backend/services"
import { createEnterpriseSchema } from "@/modules/aigw/backend/validators"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page") || "1")
  const pageSize = Number(searchParams.get("pageSize") || "20")
  const keyword = searchParams.get("keyword") || undefined
  const tenantId = req.headers.get("x-tenant-id") || "1"

  const data = await aigwEnterpriseService.getPage(tenantId, page, pageSize, keyword)
  return NextResponse.json({ code: 0, msg: "success", data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = createEnterpriseSchema.parse(body)
  const tenantId = req.headers.get("x-tenant-id") || "1"

  const data = await aigwEnterpriseService.create(tenantId, parsed)
  return NextResponse.json({ code: 0, msg: "success", data })
}
