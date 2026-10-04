-- ============================================================
-- Auto-generated RBAC & Menu Migration for 限时折扣商品 (DiscountProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-discount-product',
  'mall-dir',
  '限时折扣商品管理',
  '/admin/mall/discount-product',
  'mall/discount-product/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:discount_product:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-discount-product-query',  'menu-discount-product', '查询限时折扣商品', 'BUTTON', 'ACTIVE', 'mall:discount_product:query',  1, NOW(), NOW()),
('menu-discount-product-create', 'menu-discount-product', '新增限时折扣商品', 'BUTTON', 'ACTIVE', 'mall:discount_product:create', 2, NOW(), NOW()),
('menu-discount-product-update', 'menu-discount-product', '修改限时折扣商品', 'BUTTON', 'ACTIVE', 'mall:discount_product:update', 3, NOW(), NOW()),
('menu-discount-product-delete', 'menu-discount-product', '删除限时折扣商品', 'BUTTON', 'ACTIVE', 'mall:discount_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-discount-product-rm',        '1', 'menu-discount-product'),
('menu-discount-product-rm-query',  '1', 'menu-discount-product-query'),
('menu-discount-product-rm-create', '1', 'menu-discount-product-create'),
('menu-discount-product-rm-update', '1', 'menu-discount-product-update'),
('menu-discount-product-rm-delete', '1', 'menu-discount-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-discount-product-pm',        '1', 'menu-discount-product'),
('menu-discount-product-pm-query',  '1', 'menu-discount-product-query'),
('menu-discount-product-pm-create', '1', 'menu-discount-product-create'),
('menu-discount-product-pm-update', '1', 'menu-discount-product-update'),
('menu-discount-product-pm-delete', '1', 'menu-discount-product-delete')
ON CONFLICT DO NOTHING;
