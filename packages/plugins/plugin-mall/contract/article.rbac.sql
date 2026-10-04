-- ============================================================
-- Auto-generated RBAC & Menu Migration for 文章管理 (Article)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-article',
  'mall-dir',
  '文章管理管理',
  '/admin/mall/article',
  'mall/article/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:article:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-article-query',  'menu-article', '查询文章管理', 'BUTTON', 'ACTIVE', 'mall:article:query',  1, NOW(), NOW()),
('menu-article-create', 'menu-article', '新增文章管理', 'BUTTON', 'ACTIVE', 'mall:article:create', 2, NOW(), NOW()),
('menu-article-update', 'menu-article', '修改文章管理', 'BUTTON', 'ACTIVE', 'mall:article:update', 3, NOW(), NOW()),
('menu-article-delete', 'menu-article', '删除文章管理', 'BUTTON', 'ACTIVE', 'mall:article:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-article-rm',        '1', 'menu-article'),
('menu-article-rm-query',  '1', 'menu-article-query'),
('menu-article-rm-create', '1', 'menu-article-create'),
('menu-article-rm-update', '1', 'menu-article-update'),
('menu-article-rm-delete', '1', 'menu-article-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-article-pm',        '1', 'menu-article'),
('menu-article-pm-query',  '1', 'menu-article-query'),
('menu-article-pm-create', '1', 'menu-article-create'),
('menu-article-pm-update', '1', 'menu-article-update'),
('menu-article-pm-delete', '1', 'menu-article-delete')
ON CONFLICT DO NOTHING;
