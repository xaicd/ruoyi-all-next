import { NextResponse } from "next/server"
import { createMailAccountSchema, systemModulePageQuerySchema } from "@/modules/system/backend/validators"
import { SystemMailService } from "@/modules/system/backend/services/mail.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_MAIL_ACCOUNT_VIEW)
    const { searchParams } = new URL(request.url)
    const input = systemModulePageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await SystemMailService.listAccounts(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.SYSTEM_MAIL_ACCOUNT_CREATE)
    const body = await request.json()
    const input = createMailAccountSchema.parse(body)
    const data = await SystemMailService.createAccount(auth.userId, input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status: 400 })
  }
}
