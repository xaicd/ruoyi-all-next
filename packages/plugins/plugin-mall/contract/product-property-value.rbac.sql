-- ============================================================
-- Auto-generated RBAC & Menu Migration for ProductPropertyValue（源框架导入） (ProductPropertyValue)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-product-property-value',
  'mall-dir',
  'ProductPropertyValue（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-product-property-value-query',  'menu-product-property-value', '查询ProductPropertyValue（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_property_value:query',  1, NOW(), NOW()),
('menu-product-property-value-create', 'menu-product-property-value', '新增ProductPropertyValue（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_property_value:create', 2, NOW(), NOW()),
('menu-product-property-value-update', 'menu-product-property-value', '修改ProductPropertyValue（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_property_value:update', 3, NOW(), NOW()),
('menu-product-property-value-delete', 'menu-product-property-value', '删除ProductPropertyValue（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_property_value:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-product-property-value'),
('1', 'menu-product-property-value-query'),
('1', 'menu-product-property-value-create'),
('1', 'menu-product-property-value-update'),
('1', 'menu-product-property-value-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-product-property-value'),
('1', 'menu-product-property-value-query'),
('1', 'menu-product-property-value-create'),
('1', 'menu-product-property-value-update'),
('1', 'menu-product-property-value-delete')
ON CONFLICT DO NOTHING;
