import { NextResponse } from "next/server"
import { CrmCustomerService } from "@/modules/crm/backend/services/customer.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional(), level: z.enum(["A", "B", "C", "D"]).optional(), status: z.enum(["ACTIVE", "LOCKED", "POOL"]).optional() })
const createSchema = z.object({ name: z.string().trim().min(1).max(100), phone: z.string().trim().max(20).optional(), email: z.string().trim().email().optional().or(z.literal("")), industry: z.string().trim().max(50).optional(), level: z.enum(["A", "B", "C", "D"]).default("C"), source: z.string().trim().max(50).optional(), remark: z.string().trim().max(500).optional() })

export const GET = withAdminRoute(async (request) => {
  try {
    const { searchParams } = new URL(request.url)
    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined, level: searchParams.get("level") ?? undefined, status: searchParams.get("status") ?? undefined })
    const data = await CrmCustomerService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.CRM_CUSTOMER_VIEW })

export const POST = withAdminRoute(async (request) => {
  try {
    const body = await request.json()
    const input = createSchema.parse(body)
    const data = await CrmCustomerService.create({ ...input, email: input.email || undefined })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.CRM_CUSTOMER_VIEW })
