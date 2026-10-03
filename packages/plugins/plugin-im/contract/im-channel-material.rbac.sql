-- ============================================================
-- Auto-generated RBAC & Menu Migration for ImChannelMaterial（源框架导入） (ImChannelMaterial)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-channel-material',
  'im-dir',
  'ImChannelMaterial（源框架导入）管理',
  '/admin/im/im-channel-material',
  'im/im-channel-material/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_channel_material:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-channel-material-query',  'menu-im-channel-material', '查询ImChannelMaterial（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_channel_material:query',  1, NOW(), NOW()),
('menu-im-channel-material-create', 'menu-im-channel-material', '新增ImChannelMaterial（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_channel_material:create', 2, NOW(), NOW()),
('menu-im-channel-material-update', 'menu-im-channel-material', '修改ImChannelMaterial（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_channel_material:update', 3, NOW(), NOW()),
('menu-im-channel-material-delete', 'menu-im-channel-material', '删除ImChannelMaterial（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_channel_material:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-channel-material'),
('1', 'menu-im-channel-material-query'),
('1', 'menu-im-channel-material-create'),
('1', 'menu-im-channel-material-update'),
('1', 'menu-im-channel-material-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-channel-material'),
('1', 'menu-im-channel-material-query'),
('1', 'menu-im-channel-material-create'),
('1', 'menu-im-channel-material-update'),
('1', 'menu-im-channel-material-delete')
ON CONFLICT DO NOTHING;
