ALTER TABLE "infra_api_error_log"
  ADD COLUMN IF NOT EXISTS "processed_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "processed_by" TEXT,
  ADD COLUMN IF NOT EXISTS "process_note" VARCHAR(500);

CREATE INDEX IF NOT EXISTS "infra_api_error_log_status_created_at_idx"
  ON "infra_api_error_log"("status", "created_at");
