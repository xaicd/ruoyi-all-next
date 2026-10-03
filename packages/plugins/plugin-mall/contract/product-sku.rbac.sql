-- ============================================================
-- Auto-generated RBAC & Menu Migration for ProductSku（源框架导入） (ProductSku)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-product-sku',
  'mall-dir',
  'ProductSku（源框架导入）管理',
  '/admin/mall/product-sku',
  'mall/product-sku/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:product_sku:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-product-sku-query',  'menu-product-sku', '查询ProductSku（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_sku:query',  1, NOW(), NOW()),
('menu-product-sku-create', 'menu-product-sku', '新增ProductSku（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_sku:create', 2, NOW(), NOW()),
('menu-product-sku-update', 'menu-product-sku', '修改ProductSku（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_sku:update', 3, NOW(), NOW()),
('menu-product-sku-delete', 'menu-product-sku', '删除ProductSku（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_sku:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-product-sku'),
('1', 'menu-product-sku-query'),
('1', 'menu-product-sku-create'),
('1', 'menu-product-sku-update'),
('1', 'menu-product-sku-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-product-sku'),
('1', 'menu-product-sku-query'),
('1', 'menu-product-sku-create'),
('1', 'menu-product-sku-update'),
('1', 'menu-product-sku-delete')
ON CONFLICT DO NOTHING;
