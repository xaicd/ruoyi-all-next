-- ============================================================
-- Auto-generated RBAC & Menu Migration for 会员用户 DOuk_mobile 索引：基于 字段 (MemberUser)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-member-user',
  'member-dir',
  '会员用户 DOuk_mobile 索引：基于 字段管理',
  '/admin/member/member-user',
  'member/member-user/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_user:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-member-user-query',  'menu-member-user', '查询会员用户 DOuk_mobile 索引：基于 字段', 'BUTTON', 'ACTIVE', 'member:member_user:query',  1, NOW(), NOW()),
('menu-member-user-create', 'menu-member-user', '新增会员用户 DOuk_mobile 索引：基于 字段', 'BUTTON', 'ACTIVE', 'member:member_user:create', 2, NOW(), NOW()),
('menu-member-user-update', 'menu-member-user', '修改会员用户 DOuk_mobile 索引：基于 字段', 'BUTTON', 'ACTIVE', 'member:member_user:update', 3, NOW(), NOW()),
('menu-member-user-delete', 'menu-member-user', '删除会员用户 DOuk_mobile 索引：基于 字段', 'BUTTON', 'ACTIVE', 'member:member_user:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-member-user-rm',        '1', 'menu-member-user'),
('menu-member-user-rm-query',  '1', 'menu-member-user-query'),
('menu-member-user-rm-create', '1', 'menu-member-user-create'),
('menu-member-user-rm-update', '1', 'menu-member-user-update'),
('menu-member-user-rm-delete', '1', 'menu-member-user-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-member-user-pm',        '1', 'menu-member-user'),
('menu-member-user-pm-query',  '1', 'menu-member-user-query'),
('menu-member-user-pm-create', '1', 'menu-member-user-create'),
('menu-member-user-pm-update', '1', 'menu-member-user-update'),
('menu-member-user-pm-delete', '1', 'menu-member-user-delete')
ON CONFLICT DO NOTHING;
