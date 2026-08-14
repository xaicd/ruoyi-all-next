import { NextResponse } from "next/server"
import { CodegenTableRepository } from "@/modules/infra/backend/repositories/codegen-table.repository"
import { CodegenEngineService } from "@/modules/infra/backend/services/codegen-engine.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ id: string }> }

/**
 * GET /api/v1/admin/infra/codegen/:id
 * 获取表配置详情（含列配置）
 */
export const GET = withAdminRoute(async (request: Request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await CodegenTableRepository.findById(id)
    if (!data) return NextResponse.json({ success: false, error: "表配置不存在" }, { status: 404 })
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_CODEGEN_VIEW })

/**
 * PUT /api/v1/admin/infra/codegen/:id
 * 更新表配置（含列配置编辑）
 */
export const PUT = withAdminRoute(async (request: Request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const body = await request.json()
    const data = await CodegenTableRepository.update(id, body)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_CODEGEN_UPDATE })

/**
 * DELETE /api/v1/admin/infra/codegen/:id
 * 删除表配置
 */
export const DELETE = withAdminRoute(async (request: Request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    await CodegenTableRepository.delete(id)
    return NextResponse.json({ success: true })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}, { permission: PERMISSIONS.INFRA_CODEGEN_UPDATE })
