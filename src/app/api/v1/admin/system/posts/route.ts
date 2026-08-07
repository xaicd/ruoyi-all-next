import { NextResponse } from "next/server"
import { SystemPostService } from "@/modules/system/backend/services/post.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional() })
const createSchema = z.object({ name: z.string().trim().min(1).max(50), code: z.string().trim().min(1).max(64), sort: z.coerce.number().int().min(0).default(0), status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"), remark: z.string().trim().max(500).optional() })

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_POST_VIEW)
    const { searchParams } = new URL(request.url)
    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined, status: searchParams.get("status") ?? undefined })
    const data = await SystemPostService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_POST_CREATE)
    const body = await request.json()
    const input = createSchema.parse(body)
    const data = await SystemPostService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}
