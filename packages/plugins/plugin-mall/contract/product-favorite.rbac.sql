-- ============================================================
-- Auto-generated RBAC & Menu Migration for 商品收藏 (ProductFavorite)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-product-favorite',
  'mall-dir',
  '商品收藏管理',
  '/admin/mall/product-favorite',
  'mall/product-favorite/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:product_favorite:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-product-favorite-query',  'menu-product-favorite', '查询商品收藏', 'BUTTON', 'ACTIVE', 'mall:product_favorite:query',  1, NOW(), NOW()),
('menu-product-favorite-create', 'menu-product-favorite', '新增商品收藏', 'BUTTON', 'ACTIVE', 'mall:product_favorite:create', 2, NOW(), NOW()),
('menu-product-favorite-update', 'menu-product-favorite', '修改商品收藏', 'BUTTON', 'ACTIVE', 'mall:product_favorite:update', 3, NOW(), NOW()),
('menu-product-favorite-delete', 'menu-product-favorite', '删除商品收藏', 'BUTTON', 'ACTIVE', 'mall:product_favorite:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-product-favorite'),
('1', 'menu-product-favorite-query'),
('1', 'menu-product-favorite-create'),
('1', 'menu-product-favorite-update'),
('1', 'menu-product-favorite-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-product-favorite'),
('1', 'menu-product-favorite-query'),
('1', 'menu-product-favorite-create'),
('1', 'menu-product-favorite-update'),
('1', 'menu-product-favorite-delete')
ON CONFLICT DO NOTHING;
