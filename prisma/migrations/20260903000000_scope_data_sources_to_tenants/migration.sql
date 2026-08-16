-- A datasource belongs to one tenant. Existing unassigned rows remain invisible
-- to tenant report APIs until a platform operator explicitly assigns an owner.
ALTER TABLE "infra_data_source_config" ADD COLUMN IF NOT EXISTS "tenant_id" TEXT;

ALTER TABLE "infra_data_source_config"
  ADD CONSTRAINT "infra_data_source_config_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "system_tenant"("id") ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS "infra_data_source_config_tenant_deleted_updated_idx"
  ON "infra_data_source_config" ("tenant_id", "deleted", "updated_at" DESC);

-- AUTO报表 is a tenant package capability. Existing tenant administrators receive
-- it immediately; tenant operations roles can be assigned it from the role menu.
INSERT INTO "system_tenant_package_menu" ("id", "package_id", "menu_id")
SELECT concat('auto-report-package-', pkg."id"), pkg."id", 'online-114-test-page'
FROM "system_tenant_package" AS pkg
WHERE pkg."status" = 'ACTIVE' AND pkg."deleted" = false
ON CONFLICT ("package_id", "menu_id") DO NOTHING;

INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('auto-report-role-', role."id"), role."id", 'online-114-test-page'
FROM "system_role" AS role
JOIN "system_tenant" AS tenant ON tenant."id" = role."tenant_id"
JOIN "system_tenant_package_menu" AS package_menu
  ON package_menu."package_id" = tenant."package_id"
 AND package_menu."menu_id" = 'online-114-test-page'
WHERE role."deleted" = false
  AND tenant."deleted" = false
  AND (role."name" = '租户管理员' OR role."name" LIKE '%运营%' OR role."code" LIKE '%operator%')
ON CONFLICT ("role_id", "menu_id") DO NOTHING;