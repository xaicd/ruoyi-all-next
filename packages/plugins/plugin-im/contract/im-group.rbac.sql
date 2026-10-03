-- ============================================================
-- Auto-generated RBAC & Menu Migration for ImGroup（源框架导入） (ImGroup)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-im-group',
  'im-dir',
  'ImGroup（源框架导入）管理',
  '/admin/im/im-group',
  'im/im-group/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'im:im_group:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-im-group-query',  'menu-im-group', '查询ImGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group:query',  1, NOW(), NOW()),
('menu-im-group-create', 'menu-im-group', '新增ImGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group:create', 2, NOW(), NOW()),
('menu-im-group-update', 'menu-im-group', '修改ImGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group:update', 3, NOW(), NOW()),
('menu-im-group-delete', 'menu-im-group', '删除ImGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'im:im_group:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-im-group'),
('1', 'menu-im-group-query'),
('1', 'menu-im-group-create'),
('1', 'menu-im-group-update'),
('1', 'menu-im-group-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-im-group'),
('1', 'menu-im-group-query'),
('1', 'menu-im-group-create'),
('1', 'menu-im-group-update'),
('1', 'menu-im-group-delete')
ON CONFLICT DO NOTHING;
