-- ============================================================
-- Auto-generated RBAC & Menu Migration for ErpStockMove（源框架导入） (ErpStockMove)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-stock-move',
  'erp-dir',
  'ErpStockMove（源框架导入）管理',
  '/admin/erp/erp-stock-move',
  'erp/erp-stock-move/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_stock_move:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-stock-move-query',  'menu-erp-stock-move', '查询ErpStockMove（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_move:query',  1, NOW(), NOW()),
('menu-erp-stock-move-create', 'menu-erp-stock-move', '新增ErpStockMove（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_move:create', 2, NOW(), NOW()),
('menu-erp-stock-move-update', 'menu-erp-stock-move', '修改ErpStockMove（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_move:update', 3, NOW(), NOW()),
('menu-erp-stock-move-delete', 'menu-erp-stock-move', '删除ErpStockMove（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_stock_move:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-stock-move'),
('1', 'menu-erp-stock-move-query'),
('1', 'menu-erp-stock-move-create'),
('1', 'menu-erp-stock-move-update'),
('1', 'menu-erp-stock-move-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-stock-move'),
('1', 'menu-erp-stock-move-query'),
('1', 'menu-erp-stock-move-create'),
('1', 'menu-erp-stock-move-update'),
('1', 'menu-erp-stock-move-delete')
ON CONFLICT DO NOTHING;
