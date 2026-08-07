import { NextResponse } from "next/server"
import { SystemMenuService } from "@/modules/system/backend/services/menu.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

const createMenuSchema = z.object({
  name: z.string().trim().min(1).max(50),
  type: z.enum(["DIR", "MENU", "BUTTON"]),
  parentId: z.string().trim().optional(),
  permission: z.string().trim().max(100).optional(),
  path: z.string().trim().max(200).optional(),
  component: z.string().trim().max(200).optional(),
  icon: z.string().trim().max(100).optional(),
  sort: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  visible: z.boolean().default(true),
  keepAlive: z.boolean().default(true),
})

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_MENU_VIEW)
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get("mode")
    const status = searchParams.get("status") || undefined

    if (mode === "list") {
      const data = await SystemMenuService.list({ status })
      return NextResponse.json({ success: true, data })
    }
    const data = await SystemMenuService.tree({ status })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_MENU_CREATE)
    const body = await request.json()
    const input = createMenuSchema.parse(body)
    const data = await SystemMenuService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}
