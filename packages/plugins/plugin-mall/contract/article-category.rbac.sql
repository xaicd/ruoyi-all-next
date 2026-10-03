-- ============================================================
-- Auto-generated RBAC & Menu Migration for ArticleCategory（源框架导入） (ArticleCategory)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-article-category',
  'mall-dir',
  'ArticleCategory（源框架导入）管理',
  '/admin/mall/article-category',
  'mall/article-category/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:article_category:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-article-category-query',  'menu-article-category', '查询ArticleCategory（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:article_category:query',  1, NOW(), NOW()),
('menu-article-category-create', 'menu-article-category', '新增ArticleCategory（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:article_category:create', 2, NOW(), NOW()),
('menu-article-category-update', 'menu-article-category', '修改ArticleCategory（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:article_category:update', 3, NOW(), NOW()),
('menu-article-category-delete', 'menu-article-category', '删除ArticleCategory（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:article_category:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-article-category'),
('1', 'menu-article-category-query'),
('1', 'menu-article-category-create'),
('1', 'menu-article-category-update'),
('1', 'menu-article-category-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-article-category'),
('1', 'menu-article-category-query'),
('1', 'menu-article-category-create'),
('1', 'menu-article-category-update'),
('1', 'menu-article-category-delete')
ON CONFLICT DO NOTHING;
