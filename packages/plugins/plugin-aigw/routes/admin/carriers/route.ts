import { NextResponse } from "next/server"
import { aigwCarrierRepository } from "@/modules/aigw/backend/repositories/aigw-carrier.repository"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get("page") || "1")
  const pageSize = Number(url.searchParams.get("pageSize") || "20")

  const result = await aigwCarrierRepository.page(page, pageSize)
  return NextResponse.json({
    code: 0,
    msg: "success",
    data: result,
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  const result = await aigwCarrierRepository.create({
    carrierCode: body.carrierCode,
    carrierName: body.carrierName,
    province: body.province,
    revenueShareRatio: body.revenueShareRatio,
    contactName: body.contactName,
    contactPhone: body.contactPhone,
  })
  return NextResponse.json({
    code: 0,
    msg: "success",
    data: result,
  })
}
