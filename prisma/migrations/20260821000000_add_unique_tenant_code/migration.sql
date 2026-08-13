-- A tenant code is the only public tenant-login identifier. UUIDs, numeric IDs
-- and bound domains remain internal/business data and are never login aliases.
ALTER TABLE "system_tenant" ADD COLUMN "tenant_code" VARCHAR(32);

-- Backfill stable codes for built-in tenants, then derive readable codes for
-- legacy tenants. Non-Latin or otherwise unsuitable names receive a safe
-- tenant-<id-prefix> code. Repeated legacy names get a numeric suffix.
WITH normalized AS (
  SELECT
    "id",
    CASE
      WHEN "id" = '1' THEN 'default'
      WHEN "id" = '2' THEN 'demo'
      ELSE COALESCE(
        NULLIF(TRIM(BOTH '-' FROM regexp_replace(lower(COALESCE("name", '')), '[^a-z0-9]+', '-', 'g')), ''),
        'tenant-' || LEFT(regexp_replace("id", '[^a-zA-Z0-9]', '', 'g'), 8)
      )
    END AS base_code
  FROM "system_tenant"
), ranked AS (
  SELECT "id", base_code, row_number() OVER (PARTITION BY base_code ORDER BY "id") AS duplicate_number
  FROM normalized
)
UPDATE "system_tenant" AS tenant
SET "tenant_code" = CASE
  WHEN ranked.duplicate_number = 1 THEN LEFT(ranked.base_code, 32)
  ELSE TRIM(TRAILING '-' FROM LEFT(ranked.base_code, 31 - length(ranked.duplicate_number::text))) || '-' || ranked.duplicate_number::text
END
FROM ranked
WHERE tenant."id" = ranked."id";

ALTER TABLE "system_tenant"
  ALTER COLUMN "tenant_code" SET NOT NULL;

ALTER TABLE "system_tenant"
  ADD CONSTRAINT "system_tenant_tenant_code_key" UNIQUE ("tenant_code"),
  ADD CONSTRAINT "system_tenant_tenant_code_format_check"
    CHECK ("tenant_code" ~ '^[a-z][a-z0-9-]*[a-z0-9]$');
