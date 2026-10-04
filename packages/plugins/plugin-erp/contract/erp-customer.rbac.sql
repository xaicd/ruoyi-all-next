-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 客户 (ErpCustomer)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-customer',
  'erp-dir',
  'ERP 客户管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-customer-query',  'menu-erp-customer', '查询ERP 客户', 'BUTTON', 'ACTIVE', 'erp:erp_customer:query',  1, NOW(), NOW()),
('menu-erp-customer-create', 'menu-erp-customer', '新增ERP 客户', 'BUTTON', 'ACTIVE', 'erp:erp_customer:create', 2, NOW(), NOW()),
('menu-erp-customer-update', 'menu-erp-customer', '修改ERP 客户', 'BUTTON', 'ACTIVE', 'erp:erp_customer:update', 3, NOW(), NOW()),
('menu-erp-customer-delete', 'menu-erp-customer', '删除ERP 客户', 'BUTTON', 'ACTIVE', 'erp:erp_customer:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-customer-rm',        '1', 'menu-erp-customer'),
('menu-erp-customer-rm-query',  '1', 'menu-erp-customer-query'),
('menu-erp-customer-rm-create', '1', 'menu-erp-customer-create'),
('menu-erp-customer-rm-update', '1', 'menu-erp-customer-update'),
('menu-erp-customer-rm-delete', '1', 'menu-erp-customer-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-customer-pm',        '1', 'menu-erp-customer'),
('menu-erp-customer-pm-query',  '1', 'menu-erp-customer-query'),
('menu-erp-customer-pm-create', '1', 'menu-erp-customer-create'),
('menu-erp-customer-pm-update', '1', 'menu-erp-customer-update'),
('menu-erp-customer-pm-delete', '1', 'menu-erp-customer-delete')
ON CONFLICT DO NOTHING;
