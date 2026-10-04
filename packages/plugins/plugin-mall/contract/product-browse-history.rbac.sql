-- ============================================================
-- Auto-generated RBAC & Menu Migration for 商品浏览记录 (ProductBrowseHistory)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-product-browse-history',
  'mall-dir',
  '商品浏览记录管理',
  '/admin/mall/product-browse-history',
  'mall/product-browse-history/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:product_browse_history:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-product-browse-history-query',  'menu-product-browse-history', '查询商品浏览记录', 'BUTTON', 'ACTIVE', 'mall:product_browse_history:query',  1, NOW(), NOW()),
('menu-product-browse-history-create', 'menu-product-browse-history', '新增商品浏览记录', 'BUTTON', 'ACTIVE', 'mall:product_browse_history:create', 2, NOW(), NOW()),
('menu-product-browse-history-update', 'menu-product-browse-history', '修改商品浏览记录', 'BUTTON', 'ACTIVE', 'mall:product_browse_history:update', 3, NOW(), NOW()),
('menu-product-browse-history-delete', 'menu-product-browse-history', '删除商品浏览记录', 'BUTTON', 'ACTIVE', 'mall:product_browse_history:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-product-browse-history'),
('1', 'menu-product-browse-history-query'),
('1', 'menu-product-browse-history-create'),
('1', 'menu-product-browse-history-update'),
('1', 'menu-product-browse-history-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-product-browse-history'),
('1', 'menu-product-browse-history-query'),
('1', 'menu-product-browse-history-create'),
('1', 'menu-product-browse-history-update'),
('1', 'menu-product-browse-history-delete')
ON CONFLICT DO NOTHING;
