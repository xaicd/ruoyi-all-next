-- ============================================================
-- Auto-generated RBAC & Menu Migration for 积分商城商品 (PointProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-point-product',
  'mall-dir',
  '积分商城商品管理',
  '/admin/mall/point-product',
  'mall/point-product/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:point_product:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-point-product-query',  'menu-point-product', '查询积分商城商品', 'BUTTON', 'ACTIVE', 'mall:point_product:query',  1, NOW(), NOW()),
('menu-point-product-create', 'menu-point-product', '新增积分商城商品', 'BUTTON', 'ACTIVE', 'mall:point_product:create', 2, NOW(), NOW()),
('menu-point-product-update', 'menu-point-product', '修改积分商城商品', 'BUTTON', 'ACTIVE', 'mall:point_product:update', 3, NOW(), NOW()),
('menu-point-product-delete', 'menu-point-product', '删除积分商城商品', 'BUTTON', 'ACTIVE', 'mall:point_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-point-product-rm',        '1', 'menu-point-product'),
('menu-point-product-rm-query',  '1', 'menu-point-product-query'),
('menu-point-product-rm-create', '1', 'menu-point-product-create'),
('menu-point-product-rm-update', '1', 'menu-point-product-update'),
('menu-point-product-rm-delete', '1', 'menu-point-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-point-product-pm',        '1', 'menu-point-product'),
('menu-point-product-pm-query',  '1', 'menu-point-product-query'),
('menu-point-product-pm-create', '1', 'menu-point-product-create'),
('menu-point-product-pm-update', '1', 'menu-point-product-update'),
('menu-point-product-pm-delete', '1', 'menu-point-product-delete')
ON CONFLICT DO NOTHING;
