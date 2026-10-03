-- ============================================================
-- Auto-generated RBAC & Menu Migration for ImChannelMessage（源框架导入） (ImChannelMessage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-channel-message',
  'im-dir',
  'ImChannelMessage（源框架导入）管理',
  '/admin/im/im-channel-message',
  'im/im-channel-message/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_channel_message:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-channel-message-query',  'menu-im-channel-message', '查询ImChannelMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_channel_message:query',  1, NOW(), NOW()),
('menu-im-channel-message-create', 'menu-im-channel-message', '新增ImChannelMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_channel_message:create', 2, NOW(), NOW()),
('menu-im-channel-message-update', 'menu-im-channel-message', '修改ImChannelMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_channel_message:update', 3, NOW(), NOW()),
('menu-im-channel-message-delete', 'menu-im-channel-message', '删除ImChannelMessage（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_channel_message:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-channel-message'),
('1', 'menu-im-channel-message-query'),
('1', 'menu-im-channel-message-create'),
('1', 'menu-im-channel-message-update'),
('1', 'menu-im-channel-message-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-channel-message'),
('1', 'menu-im-channel-message-query'),
('1', 'menu-im-channel-message-create'),
('1', 'menu-im-channel-message-update'),
('1', 'menu-im-channel-message-delete')
ON CONFLICT DO NOTHING;
