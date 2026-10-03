-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesProRouteProduct（源框架导入） (MesProRouteProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-pro-route-product',
  'mes-dir',
  'MesProRouteProduct（源框架导入）管理',
  '/admin/mes/mes-pro-route-product',
  'mes/mes-pro-route-product/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_route_product:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-pro-route-product-query',  'menu-mes-pro-route-product', '查询MesProRouteProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_product:query',  1, NOW(), NOW()),
('menu-mes-pro-route-product-create', 'menu-mes-pro-route-product', '新增MesProRouteProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_product:create', 2, NOW(), NOW()),
('menu-mes-pro-route-product-update', 'menu-mes-pro-route-product', '修改MesProRouteProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_product:update', 3, NOW(), NOW()),
('menu-mes-pro-route-product-delete', 'menu-mes-pro-route-product', '删除MesProRouteProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-pro-route-product'),
('1', 'menu-mes-pro-route-product-query'),
('1', 'menu-mes-pro-route-product-create'),
('1', 'menu-mes-pro-route-product-update'),
('1', 'menu-mes-pro-route-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-pro-route-product'),
('1', 'menu-mes-pro-route-product-query'),
('1', 'menu-mes-pro-route-product-create'),
('1', 'menu-mes-pro-route-product-update'),
('1', 'menu-mes-pro-route-product-delete')
ON CONFLICT DO NOTHING;
