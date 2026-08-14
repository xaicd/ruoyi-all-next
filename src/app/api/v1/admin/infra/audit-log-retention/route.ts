import { NextResponse } from "next/server"
import { z } from "zod"
import { AuditLogRetentionService } from "@/modules/infra/backend/services/audit-log-retention.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

const runSchema = z.object({ dryRun: z.boolean().default(true) })

/** Manual protected runner. A deployment scheduler may invoke this with dryRun=false after review. */
export const POST = withAdminRoute(async (request) => {
  const input = runSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await AuditLogRetentionService.run(input) })
}, { permission: PERMISSIONS.INFRA_AUDIT_LOG_RETENTION, platformOnly: true })
