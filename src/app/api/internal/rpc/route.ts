import { NextResponse } from "next/server"
import { handleInternalRpc, headersFromRequest } from "@/modules/shared/backend/lib/rpc-http"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const result = await handleInternalRpc({
    domain: body.domain,
    method: body.method,
    protocol: body.protocol,
    payload: body.payload,
    headers: headersFromRequest(request),
  })
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: result.status })
  }
  return NextResponse.json({ success: true, data: result.data })
}
