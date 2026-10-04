-- ============================================================
-- Auto-generated RBAC & Menu Migration for 拼团商品 (CombinationProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-combination-product',
  'mall-dir',
  '拼团商品管理',
  '/admin/mall/combination-product',
  'mall/combination-product/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:combination_product:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-combination-product-query',  'menu-combination-product', '查询拼团商品', 'BUTTON', 'ACTIVE', 'mall:combination_product:query',  1, NOW(), NOW()),
('menu-combination-product-create', 'menu-combination-product', '新增拼团商品', 'BUTTON', 'ACTIVE', 'mall:combination_product:create', 2, NOW(), NOW()),
('menu-combination-product-update', 'menu-combination-product', '修改拼团商品', 'BUTTON', 'ACTIVE', 'mall:combination_product:update', 3, NOW(), NOW()),
('menu-combination-product-delete', 'menu-combination-product', '删除拼团商品', 'BUTTON', 'ACTIVE', 'mall:combination_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-combination-product-rm',        '1', 'menu-combination-product'),
('menu-combination-product-rm-query',  '1', 'menu-combination-product-query'),
('menu-combination-product-rm-create', '1', 'menu-combination-product-create'),
('menu-combination-product-rm-update', '1', 'menu-combination-product-update'),
('menu-combination-product-rm-delete', '1', 'menu-combination-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-combination-product-pm',        '1', 'menu-combination-product'),
('menu-combination-product-pm-query',  '1', 'menu-combination-product-query'),
('menu-combination-product-pm-create', '1', 'menu-combination-product-create'),
('menu-combination-product-pm-update', '1', 'menu-combination-product-update'),
('menu-combination-product-pm-delete', '1', 'menu-combination-product-delete')
ON CONFLICT DO NOTHING;
