import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { PayWalletRechargePackageService } from "@/modules/pay/backend/services/pay-wallet-recharge-package.service"

export const GET = withAdminRoute(async (request, auth) => {
  try {
    const { searchParams } = new URL(request.url)
    const input = {
      page: Number(searchParams.get("page") || 1),
      pageSize: Number(searchParams.get("pageSize") || 20),
      keyword: searchParams.get("keyword") || undefined,
    }
    const data = await PayWalletRechargePackageService.page(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "鏌ヨ澶辫触" }, { status: 400 })
  }
}, { permission: PERMISSIONS.PAY_WALLET_RECHARGE_PACKAGE_VIEW })

export const POST = withAdminRoute(async (request, auth) => {
  try {
    const body = await request.json()
    const data = await PayWalletRechargePackageService.create(body)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "鍒涘缓澶辫触" }, { status: 400 })
  }
}, { permission: PERMISSIONS.PAY_WALLET_RECHARGE_PACKAGE_CREATE })
