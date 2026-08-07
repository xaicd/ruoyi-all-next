import { NextResponse } from "next/server"
import { mallCouponIssueSchema } from "@/modules/mall/backend/validators"
import { MallService } from "@/modules/mall/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

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
