import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { SystemPartnerService } from "@/modules/system/backend/services/partner.service"

const PartnerCreateSchema = z.object({
  partnerCode: z.string().min(1, "渠道编码不能为空"),
  name: z.string().min(1, "合伙人名称不能为空"),
  level: z.enum(["GOLD", "SILVER", "BRONZE", "STRATEGIC"]).default("GOLD"),
  registeredCapital: z.number().optional(),
  creditCode: z.string().min(1, "统一社会信用代码不能为空"),
  contactName: z.string().min(1, "负责人姓名不能为空"),
  contactPhone: z.string().min(11, "负责人手机号格式不正确"),
  region: z.string().default("广东省-广州市"),
  commissionRate: z.number().min(0).max(1).default(0.20),
  promoCode: z.string().min(1, "推广码不能为空"),
  balance: z.number().default(0),
  totalCommission: z.number().default(0),
  allowedTenantIds: z.array(z.string()).default(["2", "3", "4"]),
  masterPoolTokens: z.number().default(1000000000),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  tenantId: z.string().default("1"),
})

export const GET = withAdminRoute({
  requiredPermissions: ["system:partner:query"],
  handler: async (request: NextRequest) => {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
    const pageSize = Math.max(1, Number(searchParams.get("pageSize") ?? "20"))
    const keyword = searchParams.get("keyword") ?? undefined
    const level = searchParams.get("level") ?? undefined
    const status = searchParams.get("status") ?? undefined

    const result = await SystemPartnerService.page({ page, pageSize, keyword, level, status })
    return NextResponse.json({ success: true, ...result })
  },
})

export const POST = withAdminRoute({
  requiredPermissions: ["system:partner:create"],
  handler: async (request: NextRequest, { user }) => {
    const body = await request.json()
    const parsed = PartnerCreateSchema.parse(body)
    const row = await SystemPartnerService.create(parsed as any, user?.id)
    return NextResponse.json({ success: true, data: row }, { status: 201 })
  },
})

export const PUT = withAdminRoute({
  requiredPermissions: ["system:partner:update"],
  handler: async (request: NextRequest, { user }) => {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ success: false, error: "缺少合伙人ID" }, { status: 400 })
    const row = await SystemPartnerService.update(id, data, user?.id)
    return NextResponse.json({ success: true, data: row })
  },
})

export const DELETE = withAdminRoute({
  requiredPermissions: ["system:partner:delete"],
  handler: async (request: NextRequest, { user }) => {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ success: false, error: "缺少合伙人ID" }, { status: 400 })
    await SystemPartnerService.delete(id, user?.id)
    return NextResponse.json({ success: true, message: "删除成功" })
  },
})
