-- ============================================================
-- Auto-generated RBAC & Menu Migration for Article（源框架导入） (Article)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-article',
  'mall-dir',
  'Article（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-article-query',  'menu-article', '查询Article（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:article:query',  1, NOW(), NOW()),
('menu-article-create', 'menu-article', '新增Article（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:article:create', 2, NOW(), NOW()),
('menu-article-update', 'menu-article', '修改Article（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:article:update', 3, NOW(), NOW()),
('menu-article-delete', 'menu-article', '删除Article（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:article:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-article'),
('1', 'menu-article-query'),
('1', 'menu-article-create'),
('1', 'menu-article-update'),
('1', 'menu-article-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-article'),
('1', 'menu-article-query'),
('1', 'menu-article-create'),
('1', 'menu-article-update'),
('1', 'menu-article-delete')
ON CONFLICT DO NOTHING;
