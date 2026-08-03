import { NextResponse } from "next/server"
import { erpPageQuerySchema } from "@/backend/validators/erp.validator"
import { ErpService } from "@/backend/services/erp.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.ERP_PRODUCT_VIEW)
    const { searchParams } = new URL(request.url)
    const input = erpPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })

    const data = await ErpService.listProducts(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}
