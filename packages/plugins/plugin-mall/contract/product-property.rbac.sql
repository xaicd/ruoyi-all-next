-- ============================================================
-- Auto-generated RBAC & Menu Migration for 商品属性项 (ProductProperty)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-product-property',
  'mall-dir',
  '商品属性项管理',
  '/admin/mall/product-property',
  'mall/product-property/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:product_property:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-product-property-query',  'menu-product-property', '查询商品属性项', 'BUTTON', 'ACTIVE', 'mall:product_property:query',  1, NOW(), NOW()),
('menu-product-property-create', 'menu-product-property', '新增商品属性项', 'BUTTON', 'ACTIVE', 'mall:product_property:create', 2, NOW(), NOW()),
('menu-product-property-update', 'menu-product-property', '修改商品属性项', 'BUTTON', 'ACTIVE', 'mall:product_property:update', 3, NOW(), NOW()),
('menu-product-property-delete', 'menu-product-property', '删除商品属性项', 'BUTTON', 'ACTIVE', 'mall:product_property:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-product-property-rm',        '1', 'menu-product-property'),
('menu-product-property-rm-query',  '1', 'menu-product-property-query'),
('menu-product-property-rm-create', '1', 'menu-product-property-create'),
('menu-product-property-rm-update', '1', 'menu-product-property-update'),
('menu-product-property-rm-delete', '1', 'menu-product-property-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-product-property-pm',        '1', 'menu-product-property'),
('menu-product-property-pm-query',  '1', 'menu-product-property-query'),
('menu-product-property-pm-create', '1', 'menu-product-property-create'),
('menu-product-property-pm-update', '1', 'menu-product-property-update'),
('menu-product-property-pm-delete', '1', 'menu-product-property-delete')
ON CONFLICT DO NOTHING;
