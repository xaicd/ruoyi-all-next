-- ============================================================
-- Auto-generated RBAC & Menu Migration for AI 聊天角色 (AiChatRole)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-ai-chat-role',
  'ai-dir',
  'AI 聊天角色管理',
  '/admin/ai/ai-chat-role',
  'ai/ai-chat-role/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'ai:ai_chat_role:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-ai-chat-role-query',  'menu-ai-chat-role', '查询AI 聊天角色', 'BUTTON', 'ACTIVE', 'ai:ai_chat_role:query',  1, NOW(), NOW()),
('menu-ai-chat-role-create', 'menu-ai-chat-role', '新增AI 聊天角色', 'BUTTON', 'ACTIVE', 'ai:ai_chat_role:create', 2, NOW(), NOW()),
('menu-ai-chat-role-update', 'menu-ai-chat-role', '修改AI 聊天角色', 'BUTTON', 'ACTIVE', 'ai:ai_chat_role:update', 3, NOW(), NOW()),
('menu-ai-chat-role-delete', 'menu-ai-chat-role', '删除AI 聊天角色', 'BUTTON', 'ACTIVE', 'ai:ai_chat_role:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-ai-chat-role-rm',        '1', 'menu-ai-chat-role'),
('menu-ai-chat-role-rm-query',  '1', 'menu-ai-chat-role-query'),
('menu-ai-chat-role-rm-create', '1', 'menu-ai-chat-role-create'),
('menu-ai-chat-role-rm-update', '1', 'menu-ai-chat-role-update'),
('menu-ai-chat-role-rm-delete', '1', 'menu-ai-chat-role-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-ai-chat-role-pm',        '1', 'menu-ai-chat-role'),
('menu-ai-chat-role-pm-query',  '1', 'menu-ai-chat-role-query'),
('menu-ai-chat-role-pm-create', '1', 'menu-ai-chat-role-create'),
('menu-ai-chat-role-pm-update', '1', 'menu-ai-chat-role-update'),
('menu-ai-chat-role-pm-delete', '1', 'menu-ai-chat-role-delete')
ON CONFLICT DO NOTHING;
