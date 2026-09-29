import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { aigwSkuRepository } from "@/modules/aigw/backend/repositories/aigw-sku.repository"

export const GET = withAdminRoute(async (request, auth) => {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page") || "1")
  const pageSize = Number(searchParams.get("pageSize") || "20")
  const category = searchParams.get("category") || undefined
  const tenantId = auth.roles.includes("platform_admin") || auth.roles.includes("admin") ? (searchParams.get("tenantId") || auth.tenantId) : auth.tenantId

  const data = await aigwSkuRepository.findPage(tenantId, page, pageSize, category)
  return NextResponse.json({ success: true, data })
})

export const POST = withAdminRoute(async (request, auth) => {
  const body = await request.json()
  const data = await aigwSkuRepository.create(auth.tenantId, body)
  return NextResponse.json({ success: true, data })
})

export const PUT = withAdminRoute(async (request) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 })
  const body = await request.json()
  const data = await aigwSkuRepository.update(id, body)
  return NextResponse.json({ success: true, data })
})

export const DELETE = withAdminRoute(async (request) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 })
  await aigwSkuRepository.delete(id)
  return NextResponse.json({ success: true })
})
