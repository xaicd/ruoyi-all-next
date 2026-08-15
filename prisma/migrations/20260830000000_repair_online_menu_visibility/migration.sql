-- Forward repair for databases whose legacy form-builder menu was not upgraded.
-- This migration is intentionally deployment-only; it is not executed by application startup.
INSERT INTO "system_menu" (
  "id", "name", "permission", "type", "parent_id", "path", "component", "icon", "sort", "status", "visible", "keep_alive", "created_at", "updated_at", "deleted"
) VALUES
  ('114', 'Online 开发', 'infra:online-definition:query', 'MENU', '2', 'online-definitions', 'infra/online-definition/index', 'fa:wpforms', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('online-114-test-page', 'Online 测试', 'infra:online-definition:test', 'MENU', '2', 'online-test', 'infra/online-test/index', 'ep:aim', 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "permission" = EXCLUDED."permission",
  "type" = EXCLUDED."type",
  "parent_id" = EXCLUDED."parent_id",
  "path" = EXCLUDED."path",
  "component" = EXCLUDED."component",
  "icon" = EXCLUDED."icon",
  "sort" = EXCLUDED."sort",
  "status" = EXCLUDED."status",
  "visible" = EXCLUDED."visible",
  "keep_alive" = EXCLUDED."keep_alive",
  "updated_at" = CURRENT_TIMESTAMP,
  "deleted" = false;

-- Preserve the capability boundary: only roles and tenant packages that already
-- have the Online parent menu receive the Online Test navigation entry.
INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('online-test-page-', role_menu."role_id"), role_menu."role_id", 'online-114-test-page'
FROM "system_role_menu" AS role_menu
WHERE role_menu."menu_id" = '114'
ON CONFLICT ("role_id", "menu_id") DO NOTHING;

INSERT INTO "system_tenant_package_menu" ("id", "package_id", "menu_id")
SELECT concat('online-test-page-', package_menu."package_id"), package_menu."package_id", 'online-114-test-page'
FROM "system_tenant_package_menu" AS package_menu
WHERE package_menu."menu_id" = '114'
ON CONFLICT ("package_id", "menu_id") DO NOTHING;
