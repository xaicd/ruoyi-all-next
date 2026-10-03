-- ============================================================
-- Auto-generated RBAC & Menu Migration for MemberConfig（源框架导入） (MemberConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-member-config',
  'member-dir',
  'MemberConfig（源框架导入）管理',
  '/admin/member/member-config',
  'member/member-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-member-config-query',  'menu-member-config', '查询MemberConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_config:query',  1, NOW(), NOW()),
('menu-member-config-create', 'menu-member-config', '新增MemberConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_config:create', 2, NOW(), NOW()),
('menu-member-config-update', 'menu-member-config', '修改MemberConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_config:update', 3, NOW(), NOW()),
('menu-member-config-delete', 'menu-member-config', '删除MemberConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-member-config'),
('1', 'menu-member-config-query'),
('1', 'menu-member-config-create'),
('1', 'menu-member-config-update'),
('1', 'menu-member-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-member-config'),
('1', 'menu-member-config-query'),
('1', 'menu-member-config-create'),
('1', 'menu-member-config-update'),
('1', 'menu-member-config-delete')
ON CONFLICT DO NOTHING;
