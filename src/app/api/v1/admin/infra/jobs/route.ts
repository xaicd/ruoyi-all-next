import { NextResponse } from "next/server"
import { InfraJobService } from "@/modules/infra/backend/services/job.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional() })
const createSchema = z.object({ name: z.string().trim().min(1).max(100), handlerName: z.string().trim().min(1).max(200), handlerParam: z.string().trim().max(500).optional(), cronExpression: z.string().trim().min(1).max(50), retryCount: z.coerce.number().int().min(0).default(0), retryInterval: z.coerce.number().int().min(0).default(0), status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE") })

export const GET = withAdminRoute(async (request: Request, _auth) => {
  try {
    const { searchParams } = new URL(request.url)
    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined, status: searchParams.get("status") ?? undefined })
    const data = await InfraJobService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_JOB_VIEW })

export const POST = withAdminRoute(async (request: Request, _auth) => {
  try {
    const body = await request.json()
    const input = createSchema.parse(body)
    const data = await InfraJobService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_JOB_OPERATE })
