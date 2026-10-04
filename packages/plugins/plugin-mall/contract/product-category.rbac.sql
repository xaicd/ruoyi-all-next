-- ============================================================
-- Auto-generated RBAC & Menu Migration for 商品分类 (ProductCategory)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-product-category',
  'mall-dir',
  '商品分类管理',
  '/admin/mall/product-category',
  'mall/product-category/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:product_category:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-product-category-query',  'menu-product-category', '查询商品分类', 'BUTTON', 'ACTIVE', 'mall:product_category:query',  1, NOW(), NOW()),
('menu-product-category-create', 'menu-product-category', '新增商品分类', 'BUTTON', 'ACTIVE', 'mall:product_category:create', 2, NOW(), NOW()),
('menu-product-category-update', 'menu-product-category', '修改商品分类', 'BUTTON', 'ACTIVE', 'mall:product_category:update', 3, NOW(), NOW()),
('menu-product-category-delete', 'menu-product-category', '删除商品分类', 'BUTTON', 'ACTIVE', 'mall:product_category:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-product-category-rm',        '1', 'menu-product-category'),
('menu-product-category-rm-query',  '1', 'menu-product-category-query'),
('menu-product-category-rm-create', '1', 'menu-product-category-create'),
('menu-product-category-rm-update', '1', 'menu-product-category-update'),
('menu-product-category-rm-delete', '1', 'menu-product-category-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-product-category-pm',        '1', 'menu-product-category'),
('menu-product-category-pm-query',  '1', 'menu-product-category-query'),
('menu-product-category-pm-create', '1', 'menu-product-category-create'),
('menu-product-category-pm-update', '1', 'menu-product-category-update'),
('menu-product-category-pm-delete', '1', 'menu-product-category-delete')
ON CONFLICT DO NOTHING;
