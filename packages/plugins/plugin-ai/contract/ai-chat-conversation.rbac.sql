-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI Chat 对话 DO用户每次发起 Chat 聊天时，会创建一个 对象，将它 (AiChatConversation)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-ai-chat-conversation',
  'ai-dir',
  'AI Chat 对话 DO用户每次发起 Chat 聊天时，会创建一个 对象，将它管理',
  '/admin/ai/ai-chat-conversation',
  'ai/ai-chat-conversation/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_chat_conversation:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-ai-chat-conversation-query',  'menu-ai-chat-conversation', '查询AI Chat 对话 DO用户每次发起 Chat 聊天时，会创建一个 对象，将它', 'BUTTON', 'ACTIVE', 'ai:ai_chat_conversation:query',  1, NOW(), NOW()),
('menu-ai-chat-conversation-create', 'menu-ai-chat-conversation', '新增AI Chat 对话 DO用户每次发起 Chat 聊天时，会创建一个 对象，将它', 'BUTTON', 'ACTIVE', 'ai:ai_chat_conversation:create', 2, NOW(), NOW()),
('menu-ai-chat-conversation-update', 'menu-ai-chat-conversation', '修改AI Chat 对话 DO用户每次发起 Chat 聊天时，会创建一个 对象，将它', 'BUTTON', 'ACTIVE', 'ai:ai_chat_conversation:update', 3, NOW(), NOW()),
('menu-ai-chat-conversation-delete', 'menu-ai-chat-conversation', '删除AI Chat 对话 DO用户每次发起 Chat 聊天时，会创建一个 对象，将它', 'BUTTON', 'ACTIVE', 'ai:ai_chat_conversation:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-ai-chat-conversation-rm',        '1', 'menu-ai-chat-conversation'),
('menu-ai-chat-conversation-rm-query',  '1', 'menu-ai-chat-conversation-query'),
('menu-ai-chat-conversation-rm-create', '1', 'menu-ai-chat-conversation-create'),
('menu-ai-chat-conversation-rm-update', '1', 'menu-ai-chat-conversation-update'),
('menu-ai-chat-conversation-rm-delete', '1', 'menu-ai-chat-conversation-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-ai-chat-conversation-pm',        '1', 'menu-ai-chat-conversation'),
('menu-ai-chat-conversation-pm-query',  '1', 'menu-ai-chat-conversation-query'),
('menu-ai-chat-conversation-pm-create', '1', 'menu-ai-chat-conversation-create'),
('menu-ai-chat-conversation-pm-update', '1', 'menu-ai-chat-conversation-update'),
('menu-ai-chat-conversation-pm-delete', '1', 'menu-ai-chat-conversation-delete')
ON CONFLICT DO NOTHING;
