-- ============================================================
-- Auto-generated RBAC & Menu Migration for IM 私聊消息 (ImPrivateMessage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-private-message',
  'im-dir',
  'IM 私聊消息管理',
  '/admin/im/im-private-message',
  'im/im-private-message/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_private_message:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-private-message-query',  'menu-im-private-message', '查询IM 私聊消息', 'BUTTON', 'ACTIVE', 'im:im_private_message:query',  1, NOW(), NOW()),
('menu-im-private-message-create', 'menu-im-private-message', '新增IM 私聊消息', 'BUTTON', 'ACTIVE', 'im:im_private_message:create', 2, NOW(), NOW()),
('menu-im-private-message-update', 'menu-im-private-message', '修改IM 私聊消息', 'BUTTON', 'ACTIVE', 'im:im_private_message:update', 3, NOW(), NOW()),
('menu-im-private-message-delete', 'menu-im-private-message', '删除IM 私聊消息', 'BUTTON', 'ACTIVE', 'im:im_private_message:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-private-message'),
('1', 'menu-im-private-message-query'),
('1', 'menu-im-private-message-create'),
('1', 'menu-im-private-message-update'),
('1', 'menu-im-private-message-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-private-message'),
('1', 'menu-im-private-message-query'),
('1', 'menu-im-private-message-create'),
('1', 'menu-im-private-message-update'),
('1', 'menu-im-private-message-delete')
ON CONFLICT DO NOTHING;
