-- ============================================================
-- Auto-generated RBAC & Menu Migration for 会员等级 DO配置每个等级需要的积分 (MemberLevel)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-member-level',
  'member-dir',
  '会员等级 DO配置每个等级需要的积分管理',
  '/admin/member/member-level',
  'member/member-level/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_level:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-member-level-query',  'menu-member-level', '查询会员等级 DO配置每个等级需要的积分', 'BUTTON', 'ACTIVE', 'member:member_level:query',  1, NOW(), NOW()),
('menu-member-level-create', 'menu-member-level', '新增会员等级 DO配置每个等级需要的积分', 'BUTTON', 'ACTIVE', 'member:member_level:create', 2, NOW(), NOW()),
('menu-member-level-update', 'menu-member-level', '修改会员等级 DO配置每个等级需要的积分', 'BUTTON', 'ACTIVE', 'member:member_level:update', 3, NOW(), NOW()),
('menu-member-level-delete', 'menu-member-level', '删除会员等级 DO配置每个等级需要的积分', 'BUTTON', 'ACTIVE', 'member:member_level:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-member-level-rm',        '1', 'menu-member-level'),
('menu-member-level-rm-query',  '1', 'menu-member-level-query'),
('menu-member-level-rm-create', '1', 'menu-member-level-create'),
('menu-member-level-rm-update', '1', 'menu-member-level-update'),
('menu-member-level-rm-delete', '1', 'menu-member-level-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-member-level-pm',        '1', 'menu-member-level'),
('menu-member-level-pm-query',  '1', 'menu-member-level-query'),
('menu-member-level-pm-create', '1', 'menu-member-level-create'),
('menu-member-level-pm-update', '1', 'menu-member-level-update'),
('menu-member-level-pm-delete', '1', 'menu-member-level-delete')
ON CONFLICT DO NOTHING;
