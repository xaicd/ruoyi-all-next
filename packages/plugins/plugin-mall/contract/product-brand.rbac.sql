-- ============================================================
-- Auto-generated RBAC & Menu Migration for 商品品牌 (ProductBrand)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-product-brand',
  'mall-dir',
  '商品品牌管理',
  '/admin/mall/product-brand',
  'mall/product-brand/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:product_brand:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-product-brand-query',  'menu-product-brand', '查询商品品牌', 'BUTTON', 'ACTIVE', 'mall:product_brand:query',  1, NOW(), NOW()),
('menu-product-brand-create', 'menu-product-brand', '新增商品品牌', 'BUTTON', 'ACTIVE', 'mall:product_brand:create', 2, NOW(), NOW()),
('menu-product-brand-update', 'menu-product-brand', '修改商品品牌', 'BUTTON', 'ACTIVE', 'mall:product_brand:update', 3, NOW(), NOW()),
('menu-product-brand-delete', 'menu-product-brand', '删除商品品牌', 'BUTTON', 'ACTIVE', 'mall:product_brand:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-product-brand-rm',        '1', 'menu-product-brand'),
('menu-product-brand-rm-query',  '1', 'menu-product-brand-query'),
('menu-product-brand-rm-create', '1', 'menu-product-brand-create'),
('menu-product-brand-rm-update', '1', 'menu-product-brand-update'),
('menu-product-brand-rm-delete', '1', 'menu-product-brand-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-product-brand-pm',        '1', 'menu-product-brand'),
('menu-product-brand-pm-query',  '1', 'menu-product-brand-query'),
('menu-product-brand-pm-create', '1', 'menu-product-brand-create'),
('menu-product-brand-pm-update', '1', 'menu-product-brand-update'),
('menu-product-brand-pm-delete', '1', 'menu-product-brand-delete')
ON CONFLICT DO NOTHING;
