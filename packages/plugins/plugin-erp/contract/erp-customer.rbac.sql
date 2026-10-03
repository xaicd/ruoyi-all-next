-- ============================================================
-- Auto-generated RBAC & Menu Migration for ErpCustomer（源框架导入） (ErpCustomer)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-customer',
  'erp-dir',
  'ErpCustomer（源框架导入）管理',
  '/admin/erp/erp-customer',
  'erp/erp-customer/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_customer:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-customer-query',  'menu-erp-customer', '查询ErpCustomer（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_customer:query',  1, NOW(), NOW()),
('menu-erp-customer-create', 'menu-erp-customer', '新增ErpCustomer（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_customer:create', 2, NOW(), NOW()),
('menu-erp-customer-update', 'menu-erp-customer', '修改ErpCustomer（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_customer:update', 3, NOW(), NOW()),
('menu-erp-customer-delete', 'menu-erp-customer', '删除ErpCustomer（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_customer:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-customer'),
('1', 'menu-erp-customer-query'),
('1', 'menu-erp-customer-create'),
('1', 'menu-erp-customer-update'),
('1', 'menu-erp-customer-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-customer'),
('1', 'menu-erp-customer-query'),
('1', 'menu-erp-customer-create'),
('1', 'menu-erp-customer-update'),
('1', 'menu-erp-customer-delete')
ON CONFLICT DO NOTHING;
