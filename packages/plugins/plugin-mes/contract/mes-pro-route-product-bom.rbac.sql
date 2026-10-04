-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 工艺路线产品 BOM (MesProRouteProductBom)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-pro-route-product-bom',
  'mes-dir',
  'MES 工艺路线产品 BOM管理',
  '/admin/mes/mes-pro-route-product-bom',
  'mes/mes-pro-route-product-bom/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_route_product_bom:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-pro-route-product-bom-query',  'menu-mes-pro-route-product-bom', '查询MES 工艺路线产品 BOM', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_product_bom:query',  1, NOW(), NOW()),
('menu-mes-pro-route-product-bom-create', 'menu-mes-pro-route-product-bom', '新增MES 工艺路线产品 BOM', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_product_bom:create', 2, NOW(), NOW()),
('menu-mes-pro-route-product-bom-update', 'menu-mes-pro-route-product-bom', '修改MES 工艺路线产品 BOM', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_product_bom:update', 3, NOW(), NOW()),
('menu-mes-pro-route-product-bom-delete', 'menu-mes-pro-route-product-bom', '删除MES 工艺路线产品 BOM', 'BUTTON', 'ACTIVE', 'mes:mes_pro_route_product_bom:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-pro-route-product-bom-rm',        '1', 'menu-mes-pro-route-product-bom'),
('menu-mes-pro-route-product-bom-rm-query',  '1', 'menu-mes-pro-route-product-bom-query'),
('menu-mes-pro-route-product-bom-rm-create', '1', 'menu-mes-pro-route-product-bom-create'),
('menu-mes-pro-route-product-bom-rm-update', '1', 'menu-mes-pro-route-product-bom-update'),
('menu-mes-pro-route-product-bom-rm-delete', '1', 'menu-mes-pro-route-product-bom-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-pro-route-product-bom-pm',        '1', 'menu-mes-pro-route-product-bom'),
('menu-mes-pro-route-product-bom-pm-query',  '1', 'menu-mes-pro-route-product-bom-query'),
('menu-mes-pro-route-product-bom-pm-create', '1', 'menu-mes-pro-route-product-bom-create'),
('menu-mes-pro-route-product-bom-pm-update', '1', 'menu-mes-pro-route-product-bom-update'),
('menu-mes-pro-route-product-bom-pm-delete', '1', 'menu-mes-pro-route-product-bom-delete')
ON CONFLICT DO NOTHING;
