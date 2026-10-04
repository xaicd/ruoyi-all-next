-- ============================================================
-- Auto-generated RBAC & Menu Migration for 商品属性值 (ProductPropertyValue)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-product-property-value',
  'mall-dir',
  '商品属性值管理',
  '/admin/mall/product-property-value',
  'mall/product-property-value/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:product_property_value:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-product-property-value-query',  'menu-product-property-value', '查询商品属性值', 'BUTTON', 'ACTIVE', 'mall:product_property_value:query',  1, NOW(), NOW()),
('menu-product-property-value-create', 'menu-product-property-value', '新增商品属性值', 'BUTTON', 'ACTIVE', 'mall:product_property_value:create', 2, NOW(), NOW()),
('menu-product-property-value-update', 'menu-product-property-value', '修改商品属性值', 'BUTTON', 'ACTIVE', 'mall:product_property_value:update', 3, NOW(), NOW()),
('menu-product-property-value-delete', 'menu-product-property-value', '删除商品属性值', 'BUTTON', 'ACTIVE', 'mall:product_property_value:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-product-property-value-rm',        '1', 'menu-product-property-value'),
('menu-product-property-value-rm-query',  '1', 'menu-product-property-value-query'),
('menu-product-property-value-rm-create', '1', 'menu-product-property-value-create'),
('menu-product-property-value-rm-update', '1', 'menu-product-property-value-update'),
('menu-product-property-value-rm-delete', '1', 'menu-product-property-value-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-product-property-value-pm',        '1', 'menu-product-property-value'),
('menu-product-property-value-pm-query',  '1', 'menu-product-property-value-query'),
('menu-product-property-value-pm-create', '1', 'menu-product-property-value-create'),
('menu-product-property-value-pm-update', '1', 'menu-product-property-value-update'),
('menu-product-property-value-pm-delete', '1', 'menu-product-property-value-delete')
ON CONFLICT DO NOTHING;
