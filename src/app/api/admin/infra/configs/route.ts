import { NextResponse } from "next/server"
import { infraPageQuerySchema, updateConfigSchema } from "@/backend/validators/infra.validator"
import { InfraConfigService } from "@/backend/services/infra-config.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"
import { writeAuditLog } from "@/backend/lib/audit-log"
import { sanitizeXssPayload } from "@/backend/lib/web-xss"
import { verifyApiSignature } from "@/backend/lib/protection-signature"
import { acquireIdempotencyKey } from "@/backend/lib/protection-idempotent"
import { withKeyedLock } from "@/backend/lib/protection-lock"
import { encryptApiPayload, shouldEncryptResponse } from "@/backend/lib/web-crypto"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.INFRA_CONFIG_VIEW)
    const { searchParams } = new URL(request.url)
    const input = infraPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await InfraConfigService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.INFRA_CONFIG_UPDATE)
    const rawBody = await request.text()
    verifyApiSignature(
      request.headers,
      rawBody,
      process.env.RUOYI_SIGNATURE_SECRET ?? "ruoyi-all-next-secret",
    )

    const idempotencyKey = request.headers.get("x-idempotency-key")?.trim()
    if (idempotencyKey && !acquireIdempotencyKey(idempotencyKey)) {
      throw new Error("重复提交，请稍后重试")
    }

    const body = rawBody ? JSON.parse(rawBody) : {}
    const safeBody = sanitizeXssPayload(body)
    const input = updateConfigSchema.parse(safeBody)
    const data = await withKeyedLock(`infra.config.${input.key}`, async () =>
      InfraConfigService.save(input),
    )
    await writeAuditLog({
      action: "infra.config.update",
      operatorId: auth.userId,
      targetType: "CONFIG",
      targetId: input.key,
      detail: { key: input.key },
    })

    const responseData = shouldEncryptResponse(request.headers)
      ? encryptApiPayload(data, process.env.RUOYI_API_ENCRYPT_KEY ?? "ruoyi-api-key")
      : data

    return NextResponse.json({ success: true, data: responseData })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "保存失败" }, { status: 400 })
  }
}
