import { NextResponse } from "next/server"
import { SystemDictService } from "@/modules/system/backend/services/dict.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional() })
const createTypeSchema = z.object({ name: z.string().trim().min(1).max(100), type: z.string().trim().min(1).max(100), status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"), remark: z.string().trim().max(500).optional() })

/**
 * GET /api/v1/admin/system/dicts?type=xxx  → 按 type 获取字典数据
 * GET /api/v1/admin/system/dicts            → 获取字典类型列表
 */
export async function GET(request: Request) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_DICT_VIEW)
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    // 按 type 查字典数据
    if (type) {
      const data = await SystemDictService.getDataByType(type)
      return NextResponse.json({ success: true, data })
    }

    // 查字典类型列表
    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined, status: searchParams.get("status") ?? undefined }) as any
    const data = await SystemDictService.listTypes(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

export async function POST(request: Request) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_DICT_CREATE)
    const body = await request.json()
    const input = createTypeSchema.parse(body) as any
    const data = await SystemDictService.createType(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}
