import { NextResponse } from "next/server"
import { getLivenessPayload } from "@/modules/shared/backend/lib/runtime-readiness"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Anonymous process liveness probe; it intentionally does not query dependencies. */
export async function GET() {
  return NextResponse.json(getLivenessPayload(), { headers: { "Cache-Control": "no-store" } })
}
