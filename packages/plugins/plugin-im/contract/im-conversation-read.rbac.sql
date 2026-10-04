-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 会话读位置 DO只表达「用户在某个会话的最大已读位置」，私聊 / 群聊 / 频道统一落这张表，是读位置的唯一权威。 (ImConversationRead)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-conversation-read',
  'im-dir',
  'IM 会话读位置 DO只表达「用户在某个会话的最大已读位置」，私聊 / 群聊 / 频道统一落这张表，是读位置的唯一权威。管理',
  '/admin/im/im-conversation-read',
  'im/im-conversation-read/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_conversation_read:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-conversation-read-query',  'menu-im-conversation-read', '查询IM 会话读位置 DO只表达「用户在某个会话的最大已读位置」，私聊 / 群聊 / 频道统一落这张表，是读位置的唯一权威。', 'BUTTON', 'ACTIVE', 'im:im_conversation_read:query',  1, NOW(), NOW()),
('menu-im-conversation-read-create', 'menu-im-conversation-read', '新增IM 会话读位置 DO只表达「用户在某个会话的最大已读位置」，私聊 / 群聊 / 频道统一落这张表，是读位置的唯一权威。', 'BUTTON', 'ACTIVE', 'im:im_conversation_read:create', 2, NOW(), NOW()),
('menu-im-conversation-read-update', 'menu-im-conversation-read', '修改IM 会话读位置 DO只表达「用户在某个会话的最大已读位置」，私聊 / 群聊 / 频道统一落这张表，是读位置的唯一权威。', 'BUTTON', 'ACTIVE', 'im:im_conversation_read:update', 3, NOW(), NOW()),
('menu-im-conversation-read-delete', 'menu-im-conversation-read', '删除IM 会话读位置 DO只表达「用户在某个会话的最大已读位置」，私聊 / 群聊 / 频道统一落这张表，是读位置的唯一权威。', 'BUTTON', 'ACTIVE', 'im:im_conversation_read:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-conversation-read'),
('1', 'menu-im-conversation-read-query'),
('1', 'menu-im-conversation-read-create'),
('1', 'menu-im-conversation-read-update'),
('1', 'menu-im-conversation-read-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-conversation-read'),
('1', 'menu-im-conversation-read-query'),
('1', 'menu-im-conversation-read-create'),
('1', 'menu-im-conversation-read-update'),
('1', 'menu-im-conversation-read-delete')
ON CONFLICT DO NOTHING;
