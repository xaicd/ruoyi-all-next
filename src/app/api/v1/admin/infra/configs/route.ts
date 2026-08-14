import { NextResponse } from "next/server"
import { InfraConfigService } from "@/modules/infra/backend/services/config.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional(), category: z.string().trim().optional() })
const createSchema = z.object({ name: z.string().trim().min(1).max(100), configKey: z.string().trim().min(1).max(100), value: z.string().trim().min(0).max(500), category: z.string().trim().max(50).optional(), visible: z.boolean().default(true), remark: z.string().trim().max(500).optional() })

export const GET = withAdminRoute(async (request: Request, _auth) => {
  try {
    const { searchParams } = new URL(request.url)

    // 按 key 查单值
    const key = searchParams.get("key")
    if (key) {
      const data = await InfraConfigService.getByKey(key)
      return NextResponse.json({ success: true, data })
    }

    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined, category: searchParams.get("category") ?? undefined }) as any
    const data = await InfraConfigService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_CONFIG_VIEW })

export const POST = withAdminRoute(async (request: Request, _auth) => {
  try {
    const body = await request.json()
    const input = createSchema.parse(body) as any as any
    const data = await InfraConfigService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_CONFIG_UPDATE })
