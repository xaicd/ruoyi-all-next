-- Add AI Model Gateway (new-api) menus into system_menu

INSERT INTO "system_menu" (
  "id", "name", "permission", "type", "parent_id", "path", "component", "icon", "sort", "status", "visible", "keep_alive", "created_at", "updated_at", "deleted"
) VALUES
  ('ai-gateway-dir', '模型中台', 'ai:channel:view', 'DIR', NULL, '/admin/ai', NULL, 'ep:aim', 14, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-channels', '上游渠道', 'ai:channel:view', 'MENU', 'ai-gateway-dir', 'channels', 'ai/channel/index', 'ep:connection', 1, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-models', '模型目录', 'ai:model:view', 'MENU', 'ai-gateway-dir', 'models', 'ai/model/index', 'ep:collection', 2, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-tokens', '调用令牌', 'ai:token:view', 'MENU', 'ai-gateway-dir', 'tokens', 'ai/token/index', 'fa:key', 3, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-usages', '用量日志', 'ai:usage:view', 'MENU', 'ai-gateway-dir', 'usages', 'ai/usage/index', 'fa:tasks', 4, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-playground', '联调探测', 'ai:playground:view', 'MENU', 'ai-gateway-dir', 'playground', 'ai/playground/index', 'ep:monitor', 5, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false),
  ('ai-gateway-chats', '对话记录', 'ai:chat:view', 'MENU', 'ai-gateway-dir', 'chats', 'ai/chat/index', 'ep:message', 6, 'ACTIVE', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)
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

-- Grant AI Gateway menus to Super Admin role ('1')
INSERT INTO "system_role_menu" ("id", "role_id", "menu_id")
VALUES
  ('ai-role-1-dir', '1', 'ai-gateway-dir'),
  ('ai-role-1-channels', '1', 'ai-gateway-channels'),
  ('ai-role-1-models', '1', 'ai-gateway-models'),
  ('ai-role-1-tokens', '1', 'ai-gateway-tokens'),
  ('ai-role-1-usages', '1', 'ai-gateway-usages'),
  ('ai-role-1-playground', '1', 'ai-gateway-playground'),
  ('ai-role-1-chats', '1', 'ai-gateway-chats')
ON CONFLICT ("id") DO NOTHING;
