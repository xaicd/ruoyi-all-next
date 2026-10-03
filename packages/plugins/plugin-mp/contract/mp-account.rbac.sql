-- ============================================================
-- Auto-generated RBAC & Menu Migration for MpAccount（源框架导入） (MpAccount)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mp-account',
  'mp-dir',
  'MpAccount（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mp-account-query',  'menu-mp-account', '查询MpAccount（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_account:query',  1, NOW(), NOW()),
('menu-mp-account-create', 'menu-mp-account', '新增MpAccount（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_account:create', 2, NOW(), NOW()),
('menu-mp-account-update', 'menu-mp-account', '修改MpAccount（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_account:update', 3, NOW(), NOW()),
('menu-mp-account-delete', 'menu-mp-account', '删除MpAccount（源框架导入）', 'BUTTON', 'ACTIVE', 'mp:mp_account:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mp-account'),
('1', 'menu-mp-account-query'),
('1', 'menu-mp-account-create'),
('1', 'menu-mp-account-update'),
('1', 'menu-mp-account-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mp-account'),
('1', 'menu-mp-account-query'),
('1', 'menu-mp-account-create'),
('1', 'menu-mp-account-update'),
('1', 'menu-mp-account-delete')
ON CONFLICT DO NOTHING;
