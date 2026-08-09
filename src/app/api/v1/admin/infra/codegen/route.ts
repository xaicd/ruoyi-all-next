import { NextResponse } from "next/server"
import { CodegenTableRepository } from "@/modules/infra/backend/repositories/codegen-table.repository"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional() })

/**
 * GET /api/v1/admin/infra/codegen
 * 获取已导入的表列表
 */
export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.INFRA_CODEGEN_VIEW)
    const { searchParams } = new URL(request.url)
    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined })
    const data = await CodegenTableRepository.findList(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

/**
 * DELETE /api/v1/admin/infra/codegen?ids=1,2,3
 * 批量删除
 */
export async function DELETE(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.INFRA_CODEGEN_UPDATE)
    const { searchParams } = new URL(request.url)
    const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean)
    if (ids.length === 0) return NextResponse.json({ success: false, error: "ids 不能为空" }, { status: 400 })
    await CodegenTableRepository.deleteByIds(ids)
    return NextResponse.json({ success: true, data: { deleted: ids.length } })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}
