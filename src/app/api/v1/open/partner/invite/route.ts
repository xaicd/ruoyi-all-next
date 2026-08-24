import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { SystemPartnerRepository } from "@/modules/system/backend/repositories/partner.repository"
import { SystemPartnerService } from "@/modules/system/backend/services/partner.service"

const BindInviteSchema = z.object({
  promoCode: z.string().min(1, "缺少邀请码"),
  tenantId: z.string().min(1, "缺少企业租户ID"),
})

// 查询邀请码有效性 (免登录公开端)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    if (!code) return NextResponse.json({ success: false, error: "缺少邀请码参数" }, { status: 400 })

    const partner = await SystemPartnerRepository.findByPromoCode(code)
    if (!partner || partner.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: "邀请码无效或合伙人已暂停合作" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        partnerId: partner.id,
        partnerName: partner.name,
        region: partner.region,
        level: partner.level,
        benefits: "享 1000 万 DeepSeek 国标红头公文排版与研发体验算力包",
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "查询邀请失败" }, { status: 500 })
  }
}

// 企业扫码注册后绑定邀请关系
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = BindInviteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || "参数错误" }, { status: 400 })
    }

    const { promoCode, tenantId } = parsed.data
    const updated = await SystemPartnerService.bindCustomerByPromoCode(promoCode, tenantId)

    return NextResponse.json({
      success: true,
      message: `已成功绑定归属于合伙人 [${updated.name}]`,
      data: {
        partnerId: updated.id,
        partnerName: updated.name,
        tenantId,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "绑定邀请失败" }, { status: 500 })
  }
}
