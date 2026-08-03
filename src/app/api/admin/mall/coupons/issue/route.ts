import { NextResponse } from "next/server"
import { mallCouponIssueSchema } from "@/backend/validators/mall.validator"
import { MallService } from "@/backend/services/mall.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.MALL_COUPON_ISSUE)
    const body = await request.json()
    const input = mallCouponIssueSchema.parse(body)

    const data = await MallService.issueCoupon(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}
