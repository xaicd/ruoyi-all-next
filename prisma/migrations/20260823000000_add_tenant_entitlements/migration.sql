-- A package is a reusable feature/seat template; a tenant keeps its current
-- subscription window and any seat-limit override. Existing tenant limits are
-- preserved exactly as overrides so this migration never reduces entitlement.
ALTER TABLE "system_tenant_package"
  ADD COLUMN "account_limit" INTEGER;

ALTER TABLE "system_tenant"
  ADD COLUMN "effective_at" TIMESTAMP(3),
  ADD COLUMN "account_limit" INTEGER;

UPDATE "system_tenant"
SET "effective_at" = "created_at",
    "account_limit" = "account_count"
WHERE "effective_at" IS NULL;

ALTER TABLE "system_tenant"
  ALTER COLUMN "effective_at" SET NOT NULL,
  ADD CONSTRAINT "system_tenant_account_limit_check"
    CHECK ("account_limit" IS NULL OR "account_limit" > 0),
  ADD CONSTRAINT "system_tenant_subscription_window_check"
    CHECK ("expire_time" IS NULL OR "effective_at" < "expire_time");

ALTER TABLE "system_tenant_package"
  ADD CONSTRAINT "system_tenant_package_account_limit_check"
    CHECK ("account_limit" IS NULL OR "account_limit" > 0);

ALTER TABLE "system_tenant" DROP COLUMN "account_count";

CREATE TABLE "system_tenant_subscription" (
  "id" TEXT PRIMARY KEY,
  "tenant_id" TEXT NOT NULL,
  "package_id" TEXT NOT NULL,
  "effective_at" TIMESTAMP(3) NOT NULL,
  "expire_at" TIMESTAMP(3),
  "account_limit" INTEGER,
  "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  "change_type" VARCHAR(20) NOT NULL,
  "remark" VARCHAR(500),
  "created_by" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "system_tenant_subscription_account_limit_check"
    CHECK ("account_limit" IS NULL OR "account_limit" > 0),
  CONSTRAINT "system_tenant_subscription_window_check"
    CHECK ("expire_at" IS NULL OR "effective_at" < "expire_at"),
  CONSTRAINT "system_tenant_subscription_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT,
  CONSTRAINT "system_tenant_subscription_package_id_fkey"
    FOREIGN KEY ("package_id") REFERENCES "system_tenant_package"("id") ON DELETE RESTRICT
);

INSERT INTO "system_tenant_subscription" (
  "id", "tenant_id", "package_id", "effective_at", "expire_at",
  "account_limit", "status", "change_type", "remark", "created_at"
)
SELECT
  'initial-' || tenant."id", tenant."id", tenant."package_id", tenant."effective_at", tenant."expire_time",
  tenant."account_limit", 'ACTIVE', 'MIGRATION', '历史租户权益初始化', CURRENT_TIMESTAMP
FROM "system_tenant" AS tenant
WHERE tenant."deleted" = false
  AND tenant."package_id" IS NOT NULL;

CREATE INDEX "system_tenant_effective_at_expire_time_idx"
  ON "system_tenant"("effective_at", "expire_time");
CREATE INDEX "system_tenant_subscription_tenant_id_created_at_idx"
  ON "system_tenant_subscription"("tenant_id", "created_at" DESC);
CREATE INDEX "system_tenant_subscription_status_idx"
  ON "system_tenant_subscription"("status");
