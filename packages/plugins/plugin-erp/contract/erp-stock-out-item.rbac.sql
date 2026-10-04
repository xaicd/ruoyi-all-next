-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 其它出库单项 (ErpStockOutItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-stock-out-item',
  'erp-dir',
  'ERP 其它出库单项管理',
  '/admin/erp/erp-stock-out-item',
  'erp/erp-stock-out-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_stock_out_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-stock-out-item-query',  'menu-erp-stock-out-item', '查询ERP 其它出库单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_out_item:query',  1, NOW(), NOW()),
('menu-erp-stock-out-item-create', 'menu-erp-stock-out-item', '新增ERP 其它出库单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_out_item:create', 2, NOW(), NOW()),
('menu-erp-stock-out-item-update', 'menu-erp-stock-out-item', '修改ERP 其它出库单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_out_item:update', 3, NOW(), NOW()),
('menu-erp-stock-out-item-delete', 'menu-erp-stock-out-item', '删除ERP 其它出库单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_out_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-stock-out-item'),
('1', 'menu-erp-stock-out-item-query'),
('1', 'menu-erp-stock-out-item-create'),
('1', 'menu-erp-stock-out-item-update'),
('1', 'menu-erp-stock-out-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-stock-out-item'),
('1', 'menu-erp-stock-out-item-query'),
('1', 'menu-erp-stock-out-item-create'),
('1', 'menu-erp-stock-out-item-update'),
('1', 'menu-erp-stock-out-item-delete')
ON CONFLICT DO NOTHING;
