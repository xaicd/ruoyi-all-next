-- ============================================================
-- Auto-generated RBAC & Menu Migration for ErpStockMoveItem（源框架导入） (ErpStockMoveItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-stock-move-item',
  'erp-dir',
  'ErpStockMoveItem（源框架导入）管理',
  '/admin/erp/erp-stock-move-item',
  'erp/erp-stock-move-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_stock_move_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-stock-move-item-query',  'menu-erp-stock-move-item', '查询ErpStockMoveItem（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_move_item:query',  1, NOW(), NOW()),
('menu-erp-stock-move-item-create', 'menu-erp-stock-move-item', '新增ErpStockMoveItem（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_move_item:create', 2, NOW(), NOW()),
('menu-erp-stock-move-item-update', 'menu-erp-stock-move-item', '修改ErpStockMoveItem（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_move_item:update', 3, NOW(), NOW()),
('menu-erp-stock-move-item-delete', 'menu-erp-stock-move-item', '删除ErpStockMoveItem（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_move_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-stock-move-item'),
('1', 'menu-erp-stock-move-item-query'),
('1', 'menu-erp-stock-move-item-create'),
('1', 'menu-erp-stock-move-item-update'),
('1', 'menu-erp-stock-move-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-stock-move-item'),
('1', 'menu-erp-stock-move-item-query'),
('1', 'menu-erp-stock-move-item-create'),
('1', 'menu-erp-stock-move-item-update'),
('1', 'menu-erp-stock-move-item-delete')
ON CONFLICT DO NOTHING;
