-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 结算账户 (ErpAccount)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-account',
  'erp-dir',
  'ERP 结算账户管理',
  '/admin/erp/erp-account',
  'erp/erp-account/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_account:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-account-query',  'menu-erp-account', '查询ERP 结算账户', 'BUTTON', 'ACTIVE', 'erp:erp_account:query',  1, NOW(), NOW()),
('menu-erp-account-create', 'menu-erp-account', '新增ERP 结算账户', 'BUTTON', 'ACTIVE', 'erp:erp_account:create', 2, NOW(), NOW()),
('menu-erp-account-update', 'menu-erp-account', '修改ERP 结算账户', 'BUTTON', 'ACTIVE', 'erp:erp_account:update', 3, NOW(), NOW()),
('menu-erp-account-delete', 'menu-erp-account', '删除ERP 结算账户', 'BUTTON', 'ACTIVE', 'erp:erp_account:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-account'),
('1', 'menu-erp-account-query'),
('1', 'menu-erp-account-create'),
('1', 'menu-erp-account-update'),
('1', 'menu-erp-account-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-account'),
('1', 'menu-erp-account-query'),
('1', 'menu-erp-account-create'),
('1', 'menu-erp-account-update'),
('1', 'menu-erp-account-delete')
ON CONFLICT DO NOTHING;
