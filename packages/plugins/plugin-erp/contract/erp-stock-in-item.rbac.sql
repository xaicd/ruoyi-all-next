-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 其它入库单项 (ErpStockInItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-stock-in-item',
  'erp-dir',
  'ERP 其它入库单项管理',
  '/admin/erp/erp-stock-in-item',
  'erp/erp-stock-in-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_stock_in_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-stock-in-item-query',  'menu-erp-stock-in-item', '查询ERP 其它入库单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_in_item:query',  1, NOW(), NOW()),
('menu-erp-stock-in-item-create', 'menu-erp-stock-in-item', '新增ERP 其它入库单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_in_item:create', 2, NOW(), NOW()),
('menu-erp-stock-in-item-update', 'menu-erp-stock-in-item', '修改ERP 其它入库单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_in_item:update', 3, NOW(), NOW()),
('menu-erp-stock-in-item-delete', 'menu-erp-stock-in-item', '删除ERP 其它入库单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_in_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-stock-in-item-rm',        '1', 'menu-erp-stock-in-item'),
('menu-erp-stock-in-item-rm-query',  '1', 'menu-erp-stock-in-item-query'),
('menu-erp-stock-in-item-rm-create', '1', 'menu-erp-stock-in-item-create'),
('menu-erp-stock-in-item-rm-update', '1', 'menu-erp-stock-in-item-update'),
('menu-erp-stock-in-item-rm-delete', '1', 'menu-erp-stock-in-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-stock-in-item-pm',        '1', 'menu-erp-stock-in-item'),
('menu-erp-stock-in-item-pm-query',  '1', 'menu-erp-stock-in-item-query'),
('menu-erp-stock-in-item-pm-create', '1', 'menu-erp-stock-in-item-create'),
('menu-erp-stock-in-item-pm-update', '1', 'menu-erp-stock-in-item-update'),
('menu-erp-stock-in-item-pm-delete', '1', 'menu-erp-stock-in-item-delete')
ON CONFLICT DO NOTHING;
