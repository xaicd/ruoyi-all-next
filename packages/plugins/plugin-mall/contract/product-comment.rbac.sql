-- ============================================================
-- Auto-generated RBAC & Menu Migration for ProductComment（源框架导入） (ProductComment)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-product-comment',
  'mall-dir',
  'ProductComment（源框架导入）管理',
  '/admin/mall/product-comment',
  'mall/product-comment/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:product_comment:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-product-comment-query',  'menu-product-comment', '查询ProductComment（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_comment:query',  1, NOW(), NOW()),
('menu-product-comment-create', 'menu-product-comment', '新增ProductComment（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_comment:create', 2, NOW(), NOW()),
('menu-product-comment-update', 'menu-product-comment', '修改ProductComment（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_comment:update', 3, NOW(), NOW()),
('menu-product-comment-delete', 'menu-product-comment', '删除ProductComment（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:product_comment:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-product-comment'),
('1', 'menu-product-comment-query'),
('1', 'menu-product-comment-create'),
('1', 'menu-product-comment-update'),
('1', 'menu-product-comment-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-product-comment'),
('1', 'menu-product-comment-query'),
('1', 'menu-product-comment-create'),
('1', 'menu-product-comment-update'),
('1', 'menu-product-comment-delete')
ON CONFLICT DO NOTHING;
