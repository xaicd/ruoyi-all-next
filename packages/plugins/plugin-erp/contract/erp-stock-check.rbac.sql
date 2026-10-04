-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 库存盘点单 (ErpStockCheck)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-stock-check',
  'erp-dir',
  'ERP 库存盘点单管理',
  '/admin/erp/erp-stock-check',
  'erp/erp-stock-check/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_stock_check:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-stock-check-query',  'menu-erp-stock-check', '查询ERP 库存盘点单', 'BUTTON', 'ACTIVE', 'erp:erp_stock_check:query',  1, NOW(), NOW()),
('menu-erp-stock-check-create', 'menu-erp-stock-check', '新增ERP 库存盘点单', 'BUTTON', 'ACTIVE', 'erp:erp_stock_check:create', 2, NOW(), NOW()),
('menu-erp-stock-check-update', 'menu-erp-stock-check', '修改ERP 库存盘点单', 'BUTTON', 'ACTIVE', 'erp:erp_stock_check:update', 3, NOW(), NOW()),
('menu-erp-stock-check-delete', 'menu-erp-stock-check', '删除ERP 库存盘点单', 'BUTTON', 'ACTIVE', 'erp:erp_stock_check:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-stock-check-rm',        '1', 'menu-erp-stock-check'),
('menu-erp-stock-check-rm-query',  '1', 'menu-erp-stock-check-query'),
('menu-erp-stock-check-rm-create', '1', 'menu-erp-stock-check-create'),
('menu-erp-stock-check-rm-update', '1', 'menu-erp-stock-check-update'),
('menu-erp-stock-check-rm-delete', '1', 'menu-erp-stock-check-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-stock-check-pm',        '1', 'menu-erp-stock-check'),
('menu-erp-stock-check-pm-query',  '1', 'menu-erp-stock-check-query'),
('menu-erp-stock-check-pm-create', '1', 'menu-erp-stock-check-create'),
('menu-erp-stock-check-pm-update', '1', 'menu-erp-stock-check-update'),
('menu-erp-stock-check-pm-delete', '1', 'menu-erp-stock-check-delete')
ON CONFLICT DO NOTHING;
