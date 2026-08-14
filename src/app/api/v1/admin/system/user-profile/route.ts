import { NextResponse } from "next/server"
import { z } from "zod"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { UserProfileService } from "@/modules/system/backend/services/user-profile.service"

const updateProfileSchema = z.object({
  nickname: z.string().trim().min(1).max(30).optional(),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email().max(50).optional(),
}).refine((value) => Object.values(value).some((item) => item !== undefined), "至少提供一个可更新字段")

/** Current authenticated administrator's self-service profile. */
export const GET = withAdminRoute(async (_request, auth) => {
  try {
    const data = await UserProfileService.getProfile(auth.userId)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询资料失败" }, { status: 400 })
  }
})

export const PUT = withAdminRoute(async (request, auth) => {
  try {
    const input = updateProfileSchema.parse(await request.json())
    const data = await UserProfileService.updateProfile(auth.userId, input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "更新资料失败" }, { status: 400 })
  }
})
