-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 群聊消息 (ImGroupMessage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-group-message',
  'im-dir',
  'IM 群聊消息管理',
  '/admin/im/im-group-message',
  'im/im-group-message/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_group_message:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-group-message-query',  'menu-im-group-message', '查询IM 群聊消息', 'BUTTON', 'ACTIVE', 'im:im_group_message:query',  1, NOW(), NOW()),
('menu-im-group-message-create', 'menu-im-group-message', '新增IM 群聊消息', 'BUTTON', 'ACTIVE', 'im:im_group_message:create', 2, NOW(), NOW()),
('menu-im-group-message-update', 'menu-im-group-message', '修改IM 群聊消息', 'BUTTON', 'ACTIVE', 'im:im_group_message:update', 3, NOW(), NOW()),
('menu-im-group-message-delete', 'menu-im-group-message', '删除IM 群聊消息', 'BUTTON', 'ACTIVE', 'im:im_group_message:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-group-message'),
('1', 'menu-im-group-message-query'),
('1', 'menu-im-group-message-create'),
('1', 'menu-im-group-message-update'),
('1', 'menu-im-group-message-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-group-message'),
('1', 'menu-im-group-message-query'),
('1', 'menu-im-group-message-create'),
('1', 'menu-im-group-message-update'),
('1', 'menu-im-group-message-delete')
ON CONFLICT DO NOTHING;
