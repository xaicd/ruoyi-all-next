-- ============================================================
-- Auto-generated RBAC & Menu Migration for 会员配置 (MemberConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-member-config',
  'member-dir',
  '会员配置管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-member-config-query',  'menu-member-config', '查询会员配置', 'BUTTON', 'ACTIVE', 'member:member_config:query',  1, NOW(), NOW()),
('menu-member-config-create', 'menu-member-config', '新增会员配置', 'BUTTON', 'ACTIVE', 'member:member_config:create', 2, NOW(), NOW()),
('menu-member-config-update', 'menu-member-config', '修改会员配置', 'BUTTON', 'ACTIVE', 'member:member_config:update', 3, NOW(), NOW()),
('menu-member-config-delete', 'menu-member-config', '删除会员配置', 'BUTTON', 'ACTIVE', 'member:member_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-member-config-rm',        '1', 'menu-member-config'),
('menu-member-config-rm-query',  '1', 'menu-member-config-query'),
('menu-member-config-rm-create', '1', 'menu-member-config-create'),
('menu-member-config-rm-update', '1', 'menu-member-config-update'),
('menu-member-config-rm-delete', '1', 'menu-member-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-member-config-pm',        '1', 'menu-member-config'),
('menu-member-config-pm-query',  '1', 'menu-member-config-query'),
('menu-member-config-pm-create', '1', 'menu-member-config-create'),
('menu-member-config-pm-update', '1', 'menu-member-config-update'),
('menu-member-config-pm-delete', '1', 'menu-member-config-delete')
ON CONFLICT DO NOTHING;
