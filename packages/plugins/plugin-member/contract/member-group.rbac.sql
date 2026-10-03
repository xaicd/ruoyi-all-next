-- ============================================================
-- Auto-generated RBAC & Menu Migration for MemberGroup（源框架导入） (MemberGroup)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-member-group',
  'member-dir',
  'MemberGroup（源框架导入）管理',
  '/admin/member/member-group',
  'member/member-group/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_group:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-member-group-query',  'menu-member-group', '查询MemberGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_group:query',  1, NOW(), NOW()),
('menu-member-group-create', 'menu-member-group', '新增MemberGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_group:create', 2, NOW(), NOW()),
('menu-member-group-update', 'menu-member-group', '修改MemberGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_group:update', 3, NOW(), NOW()),
('menu-member-group-delete', 'menu-member-group', '删除MemberGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_group:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-member-group'),
('1', 'menu-member-group-query'),
('1', 'menu-member-group-create'),
('1', 'menu-member-group-update'),
('1', 'menu-member-group-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-member-group'),
('1', 'menu-member-group-query'),
('1', 'menu-member-group-create'),
('1', 'menu-member-group-update'),
('1', 'menu-member-group-delete')
ON CONFLICT DO NOTHING;
