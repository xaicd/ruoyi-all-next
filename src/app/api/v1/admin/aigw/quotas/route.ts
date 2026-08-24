import { NextRequest, NextResponse } from "next/server"
import { aigwQuotaService } from "@/modules/aigw/backend/services"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page") || "1")
  const pageSize = Number(searchParams.get("pageSize") || "20")
  const enterpriseId = searchParams.get("enterpriseId") || undefined
  const tenantId = req.headers.get("x-tenant-id") || "1"

  const data = await aigwQuotaService.getPage(tenantId, page, pageSize, enterpriseId)
  return NextResponse.json({ code: 0, msg: "success", data })
}
