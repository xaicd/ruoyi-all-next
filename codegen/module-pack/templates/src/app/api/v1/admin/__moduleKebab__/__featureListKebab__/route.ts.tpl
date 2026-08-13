import { NextResponse } from "next/server"
import { {{featureCamel}}PageQuerySchema } from "@/modules/{{moduleKebab}}/backend/validators"
import { {{modulePascal}}{{featureListPascal}}Service } from "@/modules/{{moduleKebab}}/backend/services"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const input = {{featureCamel}}PageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })

    const data = await {{modulePascal}}{{featureListPascal}}Service.page(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}
