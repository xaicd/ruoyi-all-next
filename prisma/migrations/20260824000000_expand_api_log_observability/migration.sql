ALTER TABLE "infra_api_access_log"
  ADD COLUMN IF NOT EXISTS "trace_id" varchar(64),
  ADD COLUMN IF NOT EXISTS "tenant_id" varchar(64),
  ADD COLUMN IF NOT EXISTS "user_agent" varchar(500),
  ADD COLUMN IF NOT EXISTS "operation" varchar(200);

ALTER TABLE "infra_api_error_log"
  ADD COLUMN IF NOT EXISTS "trace_id" varchar(64),
  ADD COLUMN IF NOT EXISTS "tenant_id" varchar(64),
  ADD COLUMN IF NOT EXISTS "user_agent" varchar(500),
  ADD COLUMN IF NOT EXISTS "error_code" varchar(64),
  ADD COLUMN IF NOT EXISTS "root_cause" text;

CREATE INDEX IF NOT EXISTS "infra_api_access_log_trace_id_idx" ON "infra_api_access_log"("trace_id");
CREATE INDEX IF NOT EXISTS "infra_api_access_log_tenant_id_created_at_idx" ON "infra_api_access_log"("tenant_id", "created_at");
CREATE INDEX IF NOT EXISTS "infra_api_error_log_trace_id_idx" ON "infra_api_error_log"("trace_id");
CREATE INDEX IF NOT EXISTS "infra_api_error_log_tenant_id_created_at_idx" ON "infra_api_error_log"("tenant_id", "created_at");
