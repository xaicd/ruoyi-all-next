import { NextResponse } from "next/server"
import { AuditLogRetentionService } from "@/modules/infra/backend/services/audit-log-retention.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

export const POST = withAdminRoute(async (request) => {
  const input = parseActionBody(INFRA_ACTION_SCHEMAS["infra.runAuditLogRetention"], await request.json())
  return NextResponse.json({ success: true, data: await AuditLogRetentionService.run(input) })
}, { permission: PERMISSIONS.INFRA_AUDIT_LOG_RETENTION, platformOnly: true })
