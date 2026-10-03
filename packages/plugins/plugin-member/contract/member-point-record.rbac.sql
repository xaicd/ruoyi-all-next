-- ============================================================
-- Auto-generated RBAC & Menu Migration for MemberPointRecord（源框架导入） (MemberPointRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-member-point-record',
  'member-dir',
  'MemberPointRecord（源框架导入）管理',
  '/admin/member/member-point-record',
  'member/member-point-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_point_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-member-point-record-query',  'menu-member-point-record', '查询MemberPointRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_point_record:query',  1, NOW(), NOW()),
('menu-member-point-record-create', 'menu-member-point-record', '新增MemberPointRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_point_record:create', 2, NOW(), NOW()),
('menu-member-point-record-update', 'menu-member-point-record', '修改MemberPointRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_point_record:update', 3, NOW(), NOW()),
('menu-member-point-record-delete', 'menu-member-point-record', '删除MemberPointRecord（源框架导入）', 'BUTTON', 'ACTIVE', 'member:member_point_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-member-point-record'),
('1', 'menu-member-point-record-query'),
('1', 'menu-member-point-record-create'),
('1', 'menu-member-point-record-update'),
('1', 'menu-member-point-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-member-point-record'),
('1', 'menu-member-point-record-query'),
('1', 'menu-member-point-record-create'),
('1', 'menu-member-point-record-update'),
('1', 'menu-member-point-record-delete')
ON CONFLICT DO NOTHING;
