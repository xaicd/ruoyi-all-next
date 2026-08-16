-- AUTO报表 executes against platform-wide configured data sources. It must never
-- inherit tenant Online sandbox access, even when an old role/package grant exists.
UPDATE "system_menu"
SET "name" = 'AUTO报表',
    "permission" = 'report:custom-sql:execute',
    "updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'online-114-test-page'
  AND "path" = 'online-test'
  AND "deleted" = false;

DELETE FROM "system_tenant_package_menu"
WHERE "menu_id" = 'online-114-test-page';

DELETE FROM "system_role_menu" AS role_menu
USING "system_role" AS role
WHERE role_menu."role_id" = role."id"
  AND role_menu."menu_id" = 'online-114-test-page'
  AND role."code" <> 'platform-admin';

INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('auto-report-', role."id"), role."id", 'online-114-test-page'
FROM "system_role" AS role
WHERE role."code" = 'platform-admin'
  AND role."deleted" = false
ON CONFLICT ("role_id", "menu_id") DO NOTHING;