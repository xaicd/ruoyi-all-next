import { NextResponse } from "next/server"
import { CrmCustomerService } from "@/modules/crm/backend/services/customer.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

type RouteContext = { params: Promise<{ id: string }> }
const updateSchema = z.object({ name: z.string().trim().min(1).max(100).optional(), phone: z.string().trim().max(20).optional(), email: z.string().trim().optional(), industry: z.string().trim().max(50).optional(), level: z.enum(["A", "B", "C", "D"]).optional(), source: z.string().trim().max(50).optional(), remark: z.string().trim().max(500).optional() })

export async function GET(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.CRM_CUSTOMER_VIEW)
    const { id } = await context.params
    const data = await CrmCustomerService.getById(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.CRM_CUSTOMER_VIEW)
    const { id } = await context.params
    const body = await request.json()
    const input = updateSchema.parse(body)
    const data = await CrmCustomerService.update({ id, ...input })
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.CRM_CUSTOMER_VIEW)
    const { id } = await context.params
    const data = await CrmCustomerService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}
