import { NextResponse } from "next/server"
import {
  infraCodegenPreviewSchema,
  infraCodegenTemplateSchema,
  infraPageQuerySchema,
} from "@/modules/infra/backend/validators"
import { InfraCodegenService, InfraTemplateEngineService } from "@/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { writeAuditLog } from "@/modules/shared/backend/lib/audit-log"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.INFRA_CODEGEN_VIEW)
    const { searchParams } = new URL(request.url)
    const input = infraPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await InfraCodegenService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.INFRA_CODEGEN_VIEW)
    const body = await request.json()
    const input = infraCodegenPreviewSchema.parse(body)
    const data = await InfraTemplateEngineService.preview({
      templateCode: input.templateCode,
      variables: input.variables ?? {},
    })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "预览失败" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.INFRA_CODEGEN_UPDATE)
    const body = await request.json()
    const input = infraCodegenTemplateSchema.parse(body)
    const data = await InfraTemplateEngineService.save(auth.userId, {
      id: input.id,
      code: input.code,
      name: input.name,
      category: input.category,
      templateType: input.templateType,
      engine: input.engine,
      content: input.content,
      status: input.status,
      description: input.description,
      options: input.options,
    })
    await writeAuditLog({
      action: "infra.codegen.template.save",
      operatorId: auth.userId,
      targetType: "CODEGEN_TEMPLATE",
      targetId: input.code,
      detail: { code: input.code, templateType: input.templateType, category: input.category },
    })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "保存失败" }, { status: 400 })
  }
}
