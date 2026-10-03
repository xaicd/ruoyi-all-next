-- ============================================================
-- Auto-generated RBAC & Menu Migration for ErpFinanceReceipt（源框架导入） (ErpFinanceReceipt)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-finance-receipt',
  'erp-dir',
  'ErpFinanceReceipt（源框架导入）管理',
  '/admin/erp/erp-finance-receipt',
  'erp/erp-finance-receipt/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_finance_receipt:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-finance-receipt-query',  'menu-erp-finance-receipt', '查询ErpFinanceReceipt（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_finance_receipt:query',  1, NOW(), NOW()),
('menu-erp-finance-receipt-create', 'menu-erp-finance-receipt', '新增ErpFinanceReceipt（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_finance_receipt:create', 2, NOW(), NOW()),
('menu-erp-finance-receipt-update', 'menu-erp-finance-receipt', '修改ErpFinanceReceipt（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_finance_receipt:update', 3, NOW(), NOW()),
('menu-erp-finance-receipt-delete', 'menu-erp-finance-receipt', '删除ErpFinanceReceipt（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_finance_receipt:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-finance-receipt'),
('1', 'menu-erp-finance-receipt-query'),
('1', 'menu-erp-finance-receipt-create'),
('1', 'menu-erp-finance-receipt-update'),
('1', 'menu-erp-finance-receipt-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-finance-receipt'),
('1', 'menu-erp-finance-receipt-query'),
('1', 'menu-erp-finance-receipt-create'),
('1', 'menu-erp-finance-receipt-update'),
('1', 'menu-erp-finance-receipt-delete')
ON CONFLICT DO NOTHING;
