-- ============================================================
-- Auto-generated RBAC & Menu Migration for 签到规则 (MemberSignInConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-member-sign-in-config',
  'member-dir',
  '签到规则管理',
  '/admin/member/member-sign-in-config',
  'member/member-sign-in-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'member:member_sign_in_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-member-sign-in-config-query',  'menu-member-sign-in-config', '查询签到规则', 'BUTTON', 'ACTIVE', 'member:member_sign_in_config:query',  1, NOW(), NOW()),
('menu-member-sign-in-config-create', 'menu-member-sign-in-config', '新增签到规则', 'BUTTON', 'ACTIVE', 'member:member_sign_in_config:create', 2, NOW(), NOW()),
('menu-member-sign-in-config-update', 'menu-member-sign-in-config', '修改签到规则', 'BUTTON', 'ACTIVE', 'member:member_sign_in_config:update', 3, NOW(), NOW()),
('menu-member-sign-in-config-delete', 'menu-member-sign-in-config', '删除签到规则', 'BUTTON', 'ACTIVE', 'member:member_sign_in_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-member-sign-in-config'),
('1', 'menu-member-sign-in-config-query'),
('1', 'menu-member-sign-in-config-create'),
('1', 'menu-member-sign-in-config-update'),
('1', 'menu-member-sign-in-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-member-sign-in-config'),
('1', 'menu-member-sign-in-config-query'),
('1', 'menu-member-sign-in-config-create'),
('1', 'menu-member-sign-in-config-update'),
('1', 'menu-member-sign-in-config-delete')
ON CONFLICT DO NOTHING;
