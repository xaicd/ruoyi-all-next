import { NextResponse } from "next/server"
import { z } from "zod"
import { CrmCustomerService } from "@/modules/crm/backend/services/customer.service"
import { CRM_ACTION_SCHEMAS } from "@/modules/crm/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

const createSchema = z.object({ name: z.string().trim().min(1).max(100), phone: z.string().trim().max(20).optional(), email: z.string().trim().email().optional().or(z.literal("")), industry: z.string().trim().max(50).optional(), level: z.enum(["A", "B", "C", "D"]).default("C"), source: z.string().trim().max(50).optional(), remark: z.string().trim().max(500).optional() })

export const GET = withAdminRoute(async (request) => {
  try {
    const data = await CrmCustomerService.list(parseActionQuery(CRM_ACTION_SCHEMAS["crm.listCustomers"], request))
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
