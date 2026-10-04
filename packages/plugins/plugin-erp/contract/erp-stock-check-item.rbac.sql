-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 库存盘点单项 (ErpStockCheckItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-stock-check-item',
  'erp-dir',
  'ERP 库存盘点单项管理',
  '/admin/erp/erp-stock-check-item',
  'erp/erp-stock-check-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_stock_check_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-stock-check-item-query',  'menu-erp-stock-check-item', '查询ERP 库存盘点单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_check_item:query',  1, NOW(), NOW()),
('menu-erp-stock-check-item-create', 'menu-erp-stock-check-item', '新增ERP 库存盘点单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_check_item:create', 2, NOW(), NOW()),
('menu-erp-stock-check-item-update', 'menu-erp-stock-check-item', '修改ERP 库存盘点单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_check_item:update', 3, NOW(), NOW()),
('menu-erp-stock-check-item-delete', 'menu-erp-stock-check-item', '删除ERP 库存盘点单项', 'BUTTON', 'ACTIVE', 'erp:erp_stock_check_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-stock-check-item-rm',        '1', 'menu-erp-stock-check-item'),
('menu-erp-stock-check-item-rm-query',  '1', 'menu-erp-stock-check-item-query'),
('menu-erp-stock-check-item-rm-create', '1', 'menu-erp-stock-check-item-create'),
('menu-erp-stock-check-item-rm-update', '1', 'menu-erp-stock-check-item-update'),
('menu-erp-stock-check-item-rm-delete', '1', 'menu-erp-stock-check-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-stock-check-item-pm',        '1', 'menu-erp-stock-check-item'),
('menu-erp-stock-check-item-pm-query',  '1', 'menu-erp-stock-check-item-query'),
('menu-erp-stock-check-item-pm-create', '1', 'menu-erp-stock-check-item-create'),
('menu-erp-stock-check-item-pm-update', '1', 'menu-erp-stock-check-item-update'),
('menu-erp-stock-check-item-pm-delete', '1', 'menu-erp-stock-check-item-delete')
ON CONFLICT DO NOTHING;
