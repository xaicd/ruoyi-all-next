-- ============================================================
-- Auto-generated RBAC & Menu Migration for ErpStockIn（源框架导入） (ErpStockIn)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-stock-in',
  'erp-dir',
  'ErpStockIn（源框架导入）管理',
  '/admin/erp/erp-stock-in',
  'erp/erp-stock-in/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_stock_in:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-stock-in-query',  'menu-erp-stock-in', '查询ErpStockIn（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_in:query',  1, NOW(), NOW()),
('menu-erp-stock-in-create', 'menu-erp-stock-in', '新增ErpStockIn（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_in:create', 2, NOW(), NOW()),
('menu-erp-stock-in-update', 'menu-erp-stock-in', '修改ErpStockIn（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_in:update', 3, NOW(), NOW()),
('menu-erp-stock-in-delete', 'menu-erp-stock-in', '删除ErpStockIn（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_in:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-stock-in'),
('1', 'menu-erp-stock-in-query'),
('1', 'menu-erp-stock-in-create'),
('1', 'menu-erp-stock-in-update'),
('1', 'menu-erp-stock-in-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-stock-in'),
('1', 'menu-erp-stock-in-query'),
('1', 'menu-erp-stock-in-create'),
('1', 'menu-erp-stock-in-update'),
('1', 'menu-erp-stock-in-delete')
ON CONFLICT DO NOTHING;
