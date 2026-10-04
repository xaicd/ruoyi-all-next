-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 付款单 (ErpFinancePayment)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-finance-payment',
  'erp-dir',
  'ERP 付款单管理',
  '/admin/erp/erp-finance-payment',
  'erp/erp-finance-payment/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_finance_payment:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-finance-payment-query',  'menu-erp-finance-payment', '查询ERP 付款单', 'BUTTON', 'ACTIVE', 'erp:erp_finance_payment:query',  1, NOW(), NOW()),
('menu-erp-finance-payment-create', 'menu-erp-finance-payment', '新增ERP 付款单', 'BUTTON', 'ACTIVE', 'erp:erp_finance_payment:create', 2, NOW(), NOW()),
('menu-erp-finance-payment-update', 'menu-erp-finance-payment', '修改ERP 付款单', 'BUTTON', 'ACTIVE', 'erp:erp_finance_payment:update', 3, NOW(), NOW()),
('menu-erp-finance-payment-delete', 'menu-erp-finance-payment', '删除ERP 付款单', 'BUTTON', 'ACTIVE', 'erp:erp_finance_payment:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-finance-payment'),
('1', 'menu-erp-finance-payment-query'),
('1', 'menu-erp-finance-payment-create'),
('1', 'menu-erp-finance-payment-update'),
('1', 'menu-erp-finance-payment-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-finance-payment'),
('1', 'menu-erp-finance-payment-query'),
('1', 'menu-erp-finance-payment-create'),
('1', 'menu-erp-finance-payment-update'),
('1', 'menu-erp-finance-payment-delete')
ON CONFLICT DO NOTHING;
