import { NextResponse } from "next/server"
import { clientChannels } from "@/modules/shared/contract/client-channels"

/** Published client-channel standard. Does not imply every client is implemented. */
export function GET() {
  return NextResponse.json(
    { success: true, data: clientChannels },
    { headers: { "Cache-Control": "public, max-age=300" } },
  )
}
