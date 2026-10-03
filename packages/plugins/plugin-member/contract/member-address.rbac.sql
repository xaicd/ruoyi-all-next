-- ============================================================
-- Auto-generated RBAC & Menu Migration for MemberAddress（源框架导入） (MemberAddress)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-member-address',
  'member-dir',
  'MemberAddress（源框架导入）管理',
  '/admin/member/member-address',
  'member/member-address/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_address:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-member-address-query',  'menu-member-address', '查询MemberAddress（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_address:query',  1, NOW(), NOW()),
('menu-member-address-create', 'menu-member-address', '新增MemberAddress（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_address:create', 2, NOW(), NOW()),
('menu-member-address-update', 'menu-member-address', '修改MemberAddress（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_address:update', 3, NOW(), NOW()),
('menu-member-address-delete', 'menu-member-address', '删除MemberAddress（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_address:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-member-address'),
('1', 'menu-member-address-query'),
('1', 'menu-member-address-create'),
('1', 'menu-member-address-update'),
('1', 'menu-member-address-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-member-address'),
('1', 'menu-member-address-query'),
('1', 'menu-member-address-create'),
('1', 'menu-member-address-update'),
('1', 'menu-member-address-delete')
ON CONFLICT DO NOTHING;
