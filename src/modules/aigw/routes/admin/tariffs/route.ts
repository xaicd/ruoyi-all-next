import { NextRequest, NextResponse } from "next/server"
import { aigwTariffService } from "@/modules/aigw/backend/services"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get("page") || "1")
  const pageSize = Number(searchParams.get("pageSize") || "20")
  const tenantId = req.headers.get("x-tenant-id") || "1"

  const data = await aigwTariffService.getPage(tenantId, page, pageSize)
  return NextResponse.json({ code: 0, msg: "success", data })
}
