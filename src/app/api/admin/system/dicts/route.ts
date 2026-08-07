import { NextResponse } from "next/server"
import { createDictItemSchema, pageQuerySchema } from "@/modules/system/backend/validators"
import { SystemDictService } from "@/modules/system/backend/services/dict.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_DICT_VIEW)
    const { searchParams } = new URL(request.url)
    const input = pageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })

    const data = await SystemDictService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.SYSTEM_DICT_CREATE)
    const body = await request.json()
    const input = createDictItemSchema.parse(body)

    const data = await SystemDictService.create(auth.userId, input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status: 400 })
  }
}
