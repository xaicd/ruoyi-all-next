import { NextResponse } from "next/server"
import { SystemMailService } from "@/modules/system/backend/services"
import { systemModulePageQuerySchema } from "@/modules/system/backend/validators"

export async function GET(request: Request) {
  try {
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
