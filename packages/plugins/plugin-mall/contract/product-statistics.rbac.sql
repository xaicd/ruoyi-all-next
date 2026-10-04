-- ============================================================
-- Auto-generated RBAC & Menu Migration for 商品统计 (ProductStatistics)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-product-statistics',
  'mall-dir',
  '商品统计管理',
  '/admin/mall/product-statistics',
  'mall/product-statistics/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:product_statistics:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-product-statistics-query',  'menu-product-statistics', '查询商品统计', 'BUTTON', 'ACTIVE', 'mall:product_statistics:query',  1, NOW(), NOW()),
('menu-product-statistics-create', 'menu-product-statistics', '新增商品统计', 'BUTTON', 'ACTIVE', 'mall:product_statistics:create', 2, NOW(), NOW()),
('menu-product-statistics-update', 'menu-product-statistics', '修改商品统计', 'BUTTON', 'ACTIVE', 'mall:product_statistics:update', 3, NOW(), NOW()),
('menu-product-statistics-delete', 'menu-product-statistics', '删除商品统计', 'BUTTON', 'ACTIVE', 'mall:product_statistics:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-product-statistics'),
('1', 'menu-product-statistics-query'),
('1', 'menu-product-statistics-create'),
('1', 'menu-product-statistics-update'),
('1', 'menu-product-statistics-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-product-statistics'),
('1', 'menu-product-statistics-query'),
('1', 'menu-product-statistics-create'),
('1', 'menu-product-statistics-update'),
('1', 'menu-product-statistics-delete')
ON CONFLICT DO NOTHING;
