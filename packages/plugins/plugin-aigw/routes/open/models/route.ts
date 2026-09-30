import { NextResponse } from "next/server"
import { AigwRelayService } from "@/modules/aigw/backend/services/aigw-relay.service"

export async function GET() {
  const models = AigwRelayService.listPublicModels()
  const data = models.map((id) => ({
    id,
    object: "model",
    created: Math.floor(Date.now() / 1000),
    owned_by: "aigw",
  }))
  return NextResponse.json({ object: "list", data })
}
