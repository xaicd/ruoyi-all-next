import { NextResponse } from "next/server"
import { aigwQuotaLedgerRepository } from "@/modules/aigw/backend/repositories/aigw-ledger.repository"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const tenantId = url.searchParams.get("tenantId") || "1"
  const page = Number(url.searchParams.get("page") || "1")
  const pageSize = Number(url.searchParams.get("pageSize") || "20")

  const result = await aigwQuotaLedgerRepository.queryHistory(tenantId, page, pageSize)
  return NextResponse.json({
    code: 0,
    msg: "success",
    data: result,
  })
}
