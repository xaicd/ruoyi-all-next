import { NextResponse } from "next/server"
import { MallService } from "@/modules/mall/backend/services"
import { MALL_ACTION_SCHEMAS } from "@/modules/mall/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

export const POST = withAdminRoute(async (request) => {
  try {
    const data = await MallService.issueCoupon(parseActionBody(MALL_ACTION_SCHEMAS["mall.issueCoupon"], await request.json()))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.MALL_COUPON_ISSUE })
