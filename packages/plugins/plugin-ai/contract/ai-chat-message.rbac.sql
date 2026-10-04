-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI Chat 消息 (AiChatMessage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-ai-chat-message',
  'ai-dir',
  'AI Chat 消息管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-ai-chat-message-query',  'menu-ai-chat-message', '查询AI Chat 消息', 'BUTTON', 'ACTIVE', 'ai:ai_chat_message:query',  1, NOW(), NOW()),
('menu-ai-chat-message-create', 'menu-ai-chat-message', '新增AI Chat 消息', 'BUTTON', 'ACTIVE', 'ai:ai_chat_message:create', 2, NOW(), NOW()),
('menu-ai-chat-message-update', 'menu-ai-chat-message', '修改AI Chat 消息', 'BUTTON', 'ACTIVE', 'ai:ai_chat_message:update', 3, NOW(), NOW()),
('menu-ai-chat-message-delete', 'menu-ai-chat-message', '删除AI Chat 消息', 'BUTTON', 'ACTIVE', 'ai:ai_chat_message:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-ai-chat-message-rm',        '1', 'menu-ai-chat-message'),
('menu-ai-chat-message-rm-query',  '1', 'menu-ai-chat-message-query'),
('menu-ai-chat-message-rm-create', '1', 'menu-ai-chat-message-create'),
('menu-ai-chat-message-rm-update', '1', 'menu-ai-chat-message-update'),
('menu-ai-chat-message-rm-delete', '1', 'menu-ai-chat-message-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-ai-chat-message-pm',        '1', 'menu-ai-chat-message'),
('menu-ai-chat-message-pm-query',  '1', 'menu-ai-chat-message-query'),
('menu-ai-chat-message-pm-create', '1', 'menu-ai-chat-message-create'),
('menu-ai-chat-message-pm-update', '1', 'menu-ai-chat-message-update'),
('menu-ai-chat-message-pm-delete', '1', 'menu-ai-chat-message-delete')
ON CONFLICT DO NOTHING;
