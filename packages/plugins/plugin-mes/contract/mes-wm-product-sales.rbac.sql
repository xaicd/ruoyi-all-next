-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 销售出库单 (MesWmProductSales)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-product-sales',
  'mes-dir',
  'MES 销售出库单管理',
  '/admin/mes/mes-wm-product-sales',
  'mes/mes-wm-product-sales/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_product_sales:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-product-sales-query',  'menu-mes-wm-product-sales', '查询MES 销售出库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_sales:query',  1, NOW(), NOW()),
('menu-mes-wm-product-sales-create', 'menu-mes-wm-product-sales', '新增MES 销售出库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_sales:create', 2, NOW(), NOW()),
('menu-mes-wm-product-sales-update', 'menu-mes-wm-product-sales', '修改MES 销售出库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_sales:update', 3, NOW(), NOW()),
('menu-mes-wm-product-sales-delete', 'menu-mes-wm-product-sales', '删除MES 销售出库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_sales:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-product-sales-rm',        '1', 'menu-mes-wm-product-sales'),
('menu-mes-wm-product-sales-rm-query',  '1', 'menu-mes-wm-product-sales-query'),
('menu-mes-wm-product-sales-rm-create', '1', 'menu-mes-wm-product-sales-create'),
('menu-mes-wm-product-sales-rm-update', '1', 'menu-mes-wm-product-sales-update'),
('menu-mes-wm-product-sales-rm-delete', '1', 'menu-mes-wm-product-sales-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-product-sales-pm',        '1', 'menu-mes-wm-product-sales'),
('menu-mes-wm-product-sales-pm-query',  '1', 'menu-mes-wm-product-sales-query'),
('menu-mes-wm-product-sales-pm-create', '1', 'menu-mes-wm-product-sales-create'),
('menu-mes-wm-product-sales-pm-update', '1', 'menu-mes-wm-product-sales-update'),
('menu-mes-wm-product-sales-pm-delete', '1', 'menu-mes-wm-product-sales-delete')
ON CONFLICT DO NOTHING;
