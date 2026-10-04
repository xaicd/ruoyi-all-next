-- ============================================================
-- Auto-generated RBAC & Menu Migration for 商品评论 (ProductComment)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-product-comment',
  'mall-dir',
  '商品评论管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-product-comment-query',  'menu-product-comment', '查询商品评论', 'BUTTON', 'ACTIVE', 'mall:product_comment:query',  1, NOW(), NOW()),
('menu-product-comment-create', 'menu-product-comment', '新增商品评论', 'BUTTON', 'ACTIVE', 'mall:product_comment:create', 2, NOW(), NOW()),
('menu-product-comment-update', 'menu-product-comment', '修改商品评论', 'BUTTON', 'ACTIVE', 'mall:product_comment:update', 3, NOW(), NOW()),
('menu-product-comment-delete', 'menu-product-comment', '删除商品评论', 'BUTTON', 'ACTIVE', 'mall:product_comment:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-product-comment-rm',        '1', 'menu-product-comment'),
('menu-product-comment-rm-query',  '1', 'menu-product-comment-query'),
('menu-product-comment-rm-create', '1', 'menu-product-comment-create'),
('menu-product-comment-rm-update', '1', 'menu-product-comment-update'),
('menu-product-comment-rm-delete', '1', 'menu-product-comment-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-product-comment-pm',        '1', 'menu-product-comment'),
('menu-product-comment-pm-query',  '1', 'menu-product-comment-query'),
('menu-product-comment-pm-create', '1', 'menu-product-comment-create'),
('menu-product-comment-pm-update', '1', 'menu-product-comment-update'),
('menu-product-comment-pm-delete', '1', 'menu-product-comment-delete')
ON CONFLICT DO NOTHING;
