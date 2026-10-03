-- ============================================================
-- Auto-generated RBAC & Menu Migration for AiChatMessage（源框架导入） (AiChatMessage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-ai-chat-message',
  'ai-dir',
  'AiChatMessage（源框架导入）管理',
  '/admin/ai/ai-chat-message',
  'ai/ai-chat-message/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_chat_message:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-ai-chat-message-query',  'menu-ai-chat-message', '查询AiChatMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_chat_message:query',  1, NOW(), NOW()),
('menu-ai-chat-message-create', 'menu-ai-chat-message', '新增AiChatMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_chat_message:create', 2, NOW(), NOW()),
('menu-ai-chat-message-update', 'menu-ai-chat-message', '修改AiChatMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_chat_message:update', 3, NOW(), NOW()),
('menu-ai-chat-message-delete', 'menu-ai-chat-message', '删除AiChatMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'ai:ai_chat_message:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-ai-chat-message'),
('1', 'menu-ai-chat-message-query'),
('1', 'menu-ai-chat-message-create'),
('1', 'menu-ai-chat-message-update'),
('1', 'menu-ai-chat-message-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-ai-chat-message'),
('1', 'menu-ai-chat-message-query'),
('1', 'menu-ai-chat-message-create'),
('1', 'menu-ai-chat-message-update'),
('1', 'menu-ai-chat-message-delete')
ON CONFLICT DO NOTHING;
