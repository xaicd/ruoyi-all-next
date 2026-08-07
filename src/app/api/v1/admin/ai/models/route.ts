import { NextResponse } from "next/server"
import { aiPageQuerySchema, aiModelCreateSchema } from "@/modules/ai/backend/validators"
import { AiService } from "@/modules/ai/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.AI_MODEL_VIEW)
    const { searchParams } = new URL(request.url)
    const input = aiPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await AiService.listModels(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.AI_MODEL_CREATE)
    const body = await request.json()
    const input = aiModelCreateSchema.parse(body)
    const data = await AiService.createModel(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status: 400 })
  }
}
