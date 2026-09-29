import { NextResponse } from "next/server"
import { ProductsService } from "@/modules/erp/backend/services/products.service"
import { ERP_ACTION_SCHEMAS } from "@/modules/erp/contract/actions"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export async function GET(request: Request) {
  try {
    const data = await ProductsService.page(parseActionQuery(ERP_ACTION_SCHEMAS["erp.listProducts"], request))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await ProductsService.create(body)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "创建失败" }, { status: 400 })
  }
}
