import { NextResponse } from "next/server"
import { InfraFileService } from "@/modules/infra/backend/services/file.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), keyword: z.string().trim().optional(), type: z.string().trim().optional() })

export async function GET(request: Request) {
  try {
    await ensurePermission(request, PERMISSIONS.INFRA_FILE_VIEW)
    const { searchParams } = new URL(request.url)
    const input = listSchema.parse({ page: searchParams.get("page") ?? 1, pageSize: searchParams.get("pageSize") ?? 20, keyword: searchParams.get("keyword") ?? undefined, type: searchParams.get("type") ?? undefined })
    const data = await InfraFileService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

/** POST 用于记录文件上传（实际文件通过 multipart 上传到存储后调用此接口登记） */
export async function POST(request: Request) {
  try {
    await ensurePermission(request, PERMISSIONS.INFRA_FILE_VIEW)
    const body = await request.json()
    const input = z.object({ configId: z.string().trim().min(1), name: z.string().trim().optional(), path: z.string().trim().min(1), url: z.string().trim().min(1), type: z.string().trim().optional(), size: z.coerce.number().int().min(0) }).parse(body) as any
    const data = await InfraFileService.recordUpload(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}
