-- Ensure menu 114 exists before child buttons are attached
INSERT INTO "system_menu" (
  "id", "name", "permission", "type", "parent_id", "path", "component", "icon", "sort", "status", "visible", "keep_alive", "created_at", "updated_at", "deleted"
) VALUES (
  '114', 'Online开发', 'infra:online-definition:query', 'MENU', NULL, 'online-definitions', 'infra/online-definition/index', 'code', 99, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false
)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "permission" = EXCLUDED."permission",
  "path" = EXCLUDED."path",
  "component" = EXCLUDED."component",
  "updated_at" = CURRENT_TIMESTAMP,
  "deleted" = false;


INSERT INTO "system_menu" (
  "id", "name", "permission", "type", "parent_id", "path", "component", "icon", "sort", "status", "visible", "keep_alive", "created_at", "updated_at", "deleted"
) VALUES
  ('online-114-query', 'Online 定义查询', 'infra:online-definition:query', 'BUTTON', '114', NULL, NULL, NULL, 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('online-114-create', 'Online 定义新增', 'infra:online-definition:create', 'BUTTON', '114', NULL, NULL, NULL, 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('online-114-update', 'Online 定义修改', 'infra:online-definition:update', 'BUTTON', '114', NULL, NULL, NULL, 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('online-114-delete', 'Online 定义删除', 'infra:online-definition:delete', 'BUTTON', '114', NULL, NULL, NULL, 4, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('online-114-publish', 'Online 定义发布', 'infra:online-definition:publish', 'BUTTON', '114', NULL, NULL, NULL, 5, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('online-114-test', 'Online 在线测试', 'infra:online-definition:test', 'BUTTON', '114', NULL, NULL, NULL, 6, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('online-114-generate', 'Online 生成代码', 'infra:online-definition:generate', 'BUTTON', '114', NULL, NULL, NULL, 7, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('online-114-migrate', 'Online 执行迁移', 'infra:online-definition:migrate', 'BUTTON', '114', NULL, NULL, NULL, 8, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)
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

-- Existing package access to menu 114 is intentionally inherited by its action
-- buttons; do not auto-grant Online development to packages that never had it.
INSERT INTO "system_tenant_package_menu" ("id", "package_id", "menu_id")
SELECT concat('online-', package_menu."package_id", '-', button."id"), package_menu."package_id", button."id"
FROM "system_tenant_package_menu" AS package_menu
CROSS JOIN (VALUES
  ('online-114-query'), ('online-114-create'), ('online-114-update'), ('online-114-delete'),
  ('online-114-publish'), ('online-114-test'), ('online-114-generate'), ('online-114-migrate')
) AS button("id")
WHERE package_menu."menu_id" = '114'
ON CONFLICT ("package_id", "menu_id") DO NOTHING;

-- Roles already granted the legacy builder receive the Online action set. This
-- preserves the previous capability boundary without granting new roles access.
INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('online-', role_menu."role_id", '-', button."id"), role_menu."role_id", button."id"
FROM "system_role_menu" AS role_menu
CROSS JOIN (VALUES
  ('online-114-query'), ('online-114-create'), ('online-114-update'), ('online-114-delete'),
  ('online-114-publish'), ('online-114-test'), ('online-114-generate'), ('online-114-migrate')
) AS button("id")
WHERE role_menu."menu_id" = '114'
ON CONFLICT ("role_id", "menu_id") DO NOTHING;
