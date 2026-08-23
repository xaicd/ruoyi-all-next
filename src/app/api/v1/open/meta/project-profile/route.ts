import { NextResponse } from "next/server"
import { toPublicProjectProfile } from "@/modules/shared/contract/project-profile"

/** Public branding for PC / H5 / uni-app / Flutter / desktop. No login required. */
export function GET() {
  return NextResponse.json(
    { success: true, data: toPublicProjectProfile() },
    { headers: { "Cache-Control": "public, max-age=300" } },
  )
}
