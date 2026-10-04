-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 其它出库单 (ErpStockOut)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-stock-out',
  'erp-dir',
  'ERP 其它出库单管理',
  '/admin/erp/erp-stock-out',
  'erp/erp-stock-out/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_stock_out:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-stock-out-query',  'menu-erp-stock-out', '查询ERP 其它出库单', 'BUTTON', 'ACTIVE', 'erp:erp_stock_out:query',  1, NOW(), NOW()),
('menu-erp-stock-out-create', 'menu-erp-stock-out', '新增ERP 其它出库单', 'BUTTON', 'ACTIVE', 'erp:erp_stock_out:create', 2, NOW(), NOW()),
('menu-erp-stock-out-update', 'menu-erp-stock-out', '修改ERP 其它出库单', 'BUTTON', 'ACTIVE', 'erp:erp_stock_out:update', 3, NOW(), NOW()),
('menu-erp-stock-out-delete', 'menu-erp-stock-out', '删除ERP 其它出库单', 'BUTTON', 'ACTIVE', 'erp:erp_stock_out:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-stock-out'),
('1', 'menu-erp-stock-out-query'),
('1', 'menu-erp-stock-out-create'),
('1', 'menu-erp-stock-out-update'),
('1', 'menu-erp-stock-out-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-stock-out'),
('1', 'menu-erp-stock-out-query'),
('1', 'menu-erp-stock-out-create'),
('1', 'menu-erp-stock-out-update'),
('1', 'menu-erp-stock-out-delete')
ON CONFLICT DO NOTHING;
