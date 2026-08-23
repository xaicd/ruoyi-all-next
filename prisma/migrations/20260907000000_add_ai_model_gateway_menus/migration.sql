-- Add AI Model Gateway (new-api) menus into system_menu

INSERT INTO "system_menu" (
  "id", "name", "permission", "type", "parent_id", "path", "component", "icon", "sort", "status", "visible", "keep_alive", "created_at", "updated_at", "deleted"
) VALUES
  ('ai-gateway-dir', '模型中台', 'aigw:channel:view', 'DIR', NULL, '/admin/aigw', NULL, 'ep:aim', 14, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-channels', '上游渠道', 'aigw:channel:view', 'MENU', 'ai-gateway-dir', 'channels', 'aigw/channel/index', 'ep:connection', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-models', '模型目录', 'aigw:model:view', 'MENU', 'ai-gateway-dir', 'models', 'aigw/model/index', 'ep:collection', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-tokens', '调用令牌', 'aigw:token:view', 'MENU', 'ai-gateway-dir', 'tokens', 'aigw/token/index', 'fa:key', 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-usages', '用量日志', 'aigw:usage:view', 'MENU', 'ai-gateway-dir', 'usages', 'aigw/usage/index', 'fa:tasks', 4, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-playground', '联调探测', 'aigw:playground:view', 'MENU', 'ai-gateway-dir', 'playground', 'aigw/playground/index', 'ep:monitor', 5, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-chats', '对话记录', 'aigw:chat:view', 'MENU', 'ai-gateway-dir', 'chats', 'aigw/chat/index', 'ep:message', 6, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)
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

-- Grant AI Gateway menus to Admin roles safely via FK join
INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('ai-role-', role."id", '-dir'), role."id", 'ai-gateway-dir'
FROM "system_role" AS role
WHERE role."id" = '1' OR role."code" = 'admin' OR role."name" LIKE '%管理员%'
ON CONFLICT ("role_id", "menu_id") DO NOTHING;

INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('ai-role-', role."id", '-channels'), role."id", 'ai-gateway-channels'
FROM "system_role" AS role
WHERE role."id" = '1' OR role."code" = 'admin' OR role."name" LIKE '%管理员%'
ON CONFLICT ("role_id", "menu_id") DO NOTHING;

INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('ai-role-', role."id", '-models'), role."id", 'ai-gateway-models'
FROM "system_role" AS role
WHERE role."id" = '1' OR role."code" = 'admin' OR role."name" LIKE '%管理员%'
ON CONFLICT ("role_id", "menu_id") DO NOTHING;

INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('ai-role-', role."id", '-tokens'), role."id", 'ai-gateway-tokens'
FROM "system_role" AS role
WHERE role."id" = '1' OR role."code" = 'admin' OR role."name" LIKE '%管理员%'
ON CONFLICT ("role_id", "menu_id") DO NOTHING;

INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('ai-role-', role."id", '-usages'), role."id", 'ai-gateway-usages'
FROM "system_role" AS role
WHERE role."id" = '1' OR role."code" = 'admin' OR role."name" LIKE '%管理员%'
ON CONFLICT ("role_id", "menu_id") DO NOTHING;

INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('ai-role-', role."id", '-playground'), role."id", 'ai-gateway-playground'
FROM "system_role" AS role
WHERE role."id" = '1' OR role."code" = 'admin' OR role."name" LIKE '%管理员%'
ON CONFLICT ("role_id", "menu_id") DO NOTHING;

INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
SELECT concat('ai-role-', role."id", '-chats'), role."id", 'ai-gateway-chats'
FROM "system_role" AS role
WHERE role."id" = '1' OR role."code" = 'admin' OR role."name" LIKE '%管理员%'
ON CONFLICT ("role_id", "menu_id") DO NOTHING;
