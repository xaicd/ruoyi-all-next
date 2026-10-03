-- ============================================================
-- Auto-generated RBAC & Menu Migration for MemberSignInRecord（源框架导入） (MemberSignInRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-member-sign-in-record',
  'member-dir',
  'MemberSignInRecord（源框架导入）管理',
  '/admin/member/member-sign-in-record',
  'member/member-sign-in-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_sign_in_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-member-sign-in-record-query',  'menu-member-sign-in-record', '查询MemberSignInRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_sign_in_record:query',  1, NOW(), NOW()),
('menu-member-sign-in-record-create', 'menu-member-sign-in-record', '新增MemberSignInRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_sign_in_record:create', 2, NOW(), NOW()),
('menu-member-sign-in-record-update', 'menu-member-sign-in-record', '修改MemberSignInRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_sign_in_record:update', 3, NOW(), NOW()),
('menu-member-sign-in-record-delete', 'menu-member-sign-in-record', '删除MemberSignInRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_sign_in_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-member-sign-in-record'),
('1', 'menu-member-sign-in-record-query'),
('1', 'menu-member-sign-in-record-create'),
('1', 'menu-member-sign-in-record-update'),
('1', 'menu-member-sign-in-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-member-sign-in-record'),
('1', 'menu-member-sign-in-record-query'),
('1', 'menu-member-sign-in-record-create'),
('1', 'menu-member-sign-in-record-update'),
('1', 'menu-member-sign-in-record-delete')
ON CONFLICT DO NOTHING;
