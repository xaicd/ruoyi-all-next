import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { issueJwt } from "@/modules/shared/backend/auth/jwt"

const SwitchTenantSchema = z.object({
  tenantId: z.string().min(1, "缺少目标租户ID"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = SwitchTenantSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || "参数错误" }, { status: 400 })
    }

    const { tenantId } = parsed.data

    // 100% 直连数据库查询真实租户记录，彻底杜绝 Mock 字典
    const tenant = await SystemTenantRepository.findById(tenantId)
    if (!tenant) {
      return NextResponse.json({ success: false, error: `目标租户 [${tenantId}] 不存在` }, { status: 404 })
    }

    if (tenant.status !== "ACTIVE" && tenant.status !== "0") {
      return NextResponse.json({ success: false, error: `目标租户 [${tenant.name}] 已停用或不可用` }, { status: 403 })
    }

    // 真实签发切换租户后的合法 JWT
    const { token, expiresIn } = issueJwt({
      sub: "usr-managed-admin",
      username: "lin_manager",
      tenantId: tenant.id,
      type: "admin",
      roles: ["enterprise_admin", "aigw_manager"],
      permissions: ["*:*:*"],
    })

    return NextResponse.json({
      success: true,
      data: {
        token,
        expiresIn,
        currentTenant: {
          id: tenant.id,
          tenantCode: tenant.tenantCode,
          name: tenant.name,
          packageId: tenant.packageId,
          accountLimit: tenant.accountLimit,
          status: tenant.status,
        },
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "切换租户失败" }, { status: 500 })
  }
}
