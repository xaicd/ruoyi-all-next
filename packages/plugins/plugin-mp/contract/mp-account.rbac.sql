-- ============================================================
-- Auto-generated RBAC & Menu Migration for 公众号账号 (MpAccount)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mp-account',
  'mp-dir',
  '公众号账号管理',
  '/admin/mp/mp-account',
  'mp/mp-account/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mp:mp_account:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mp-account-query',  'menu-mp-account', '查询公众号账号', 'BUTTON', 'ACTIVE', 'mp:mp_account:query',  1, NOW(), NOW()),
('menu-mp-account-create', 'menu-mp-account', '新增公众号账号', 'BUTTON', 'ACTIVE', 'mp:mp_account:create', 2, NOW(), NOW()),
('menu-mp-account-update', 'menu-mp-account', '修改公众号账号', 'BUTTON', 'ACTIVE', 'mp:mp_account:update', 3, NOW(), NOW()),
('menu-mp-account-delete', 'menu-mp-account', '删除公众号账号', 'BUTTON', 'ACTIVE', 'mp:mp_account:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mp-account-rm',        '1', 'menu-mp-account'),
('menu-mp-account-rm-query',  '1', 'menu-mp-account-query'),
('menu-mp-account-rm-create', '1', 'menu-mp-account-create'),
('menu-mp-account-rm-update', '1', 'menu-mp-account-update'),
('menu-mp-account-rm-delete', '1', 'menu-mp-account-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mp-account-pm',        '1', 'menu-mp-account'),
('menu-mp-account-pm-query',  '1', 'menu-mp-account-query'),
('menu-mp-account-pm-create', '1', 'menu-mp-account-create'),
('menu-mp-account-pm-update', '1', 'menu-mp-account-update'),
('menu-mp-account-pm-delete', '1', 'menu-mp-account-delete')
ON CONFLICT DO NOTHING;
