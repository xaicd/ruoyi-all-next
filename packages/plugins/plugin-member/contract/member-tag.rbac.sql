-- ============================================================
-- Auto-generated RBAC & Menu Migration for 会员标签 (MemberTag)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-member-tag',
  'member-dir',
  '会员标签管理',
  '/admin/member/member-tag',
  'member/member-tag/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_tag:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-member-tag-query',  'menu-member-tag', '查询会员标签', 'BUTTON', 'ACTIVE', 'member:member_tag:query',  1, NOW(), NOW()),
('menu-member-tag-create', 'menu-member-tag', '新增会员标签', 'BUTTON', 'ACTIVE', 'member:member_tag:create', 2, NOW(), NOW()),
('menu-member-tag-update', 'menu-member-tag', '修改会员标签', 'BUTTON', 'ACTIVE', 'member:member_tag:update', 3, NOW(), NOW()),
('menu-member-tag-delete', 'menu-member-tag', '删除会员标签', 'BUTTON', 'ACTIVE', 'member:member_tag:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-member-tag-rm',        '1', 'menu-member-tag'),
('menu-member-tag-rm-query',  '1', 'menu-member-tag-query'),
('menu-member-tag-rm-create', '1', 'menu-member-tag-create'),
('menu-member-tag-rm-update', '1', 'menu-member-tag-update'),
('menu-member-tag-rm-delete', '1', 'menu-member-tag-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-member-tag-pm',        '1', 'menu-member-tag'),
('menu-member-tag-pm-query',  '1', 'menu-member-tag-query'),
('menu-member-tag-pm-create', '1', 'menu-member-tag-create'),
('menu-member-tag-pm-update', '1', 'menu-member-tag-update'),
('menu-member-tag-pm-delete', '1', 'menu-member-tag-delete')
ON CONFLICT DO NOTHING;
