-- ============================================================
-- Auto-generated RBAC & Menu Migration for ProductProperty（源框架导入） (ProductProperty)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-product-property',
  'mall-dir',
  'ProductProperty（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-product-property-query',  'menu-product-property', '查询ProductProperty（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_property:query',  1, NOW(), NOW()),
('menu-product-property-create', 'menu-product-property', '新增ProductProperty（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_property:create', 2, NOW(), NOW()),
('menu-product-property-update', 'menu-product-property', '修改ProductProperty（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_property:update', 3, NOW(), NOW()),
('menu-product-property-delete', 'menu-product-property', '删除ProductProperty（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_property:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-product-property'),
('1', 'menu-product-property-query'),
('1', 'menu-product-property-create'),
('1', 'menu-product-property-update'),
('1', 'menu-product-property-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-product-property'),
('1', 'menu-product-property-query'),
('1', 'menu-product-property-create'),
('1', 'menu-product-property-update'),
('1', 'menu-product-property-delete')
ON CONFLICT DO NOTHING;
