-- ============================================================
-- Auto-generated RBAC & Menu Migration for banner (Banner)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-banner',
  'mall-dir',
  'banner管理',
  '/admin/mall/banner',
  'mall/banner/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:banner:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-banner-query',  'menu-banner', '查询banner', 'BUTTON', 'ACTIVE', 'mall:banner:query',  1, NOW(), NOW()),
('menu-banner-create', 'menu-banner', '新增banner', 'BUTTON', 'ACTIVE', 'mall:banner:create', 2, NOW(), NOW()),
('menu-banner-update', 'menu-banner', '修改banner', 'BUTTON', 'ACTIVE', 'mall:banner:update', 3, NOW(), NOW()),
('menu-banner-delete', 'menu-banner', '删除banner', 'BUTTON', 'ACTIVE', 'mall:banner:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-banner-rm',        '1', 'menu-banner'),
('menu-banner-rm-query',  '1', 'menu-banner-query'),
('menu-banner-rm-create', '1', 'menu-banner-create'),
('menu-banner-rm-update', '1', 'menu-banner-update'),
('menu-banner-rm-delete', '1', 'menu-banner-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-banner-pm',        '1', 'menu-banner'),
('menu-banner-pm-query',  '1', 'menu-banner-query'),
('menu-banner-pm-create', '1', 'menu-banner-create'),
('menu-banner-pm-update', '1', 'menu-banner-update'),
('menu-banner-pm-delete', '1', 'menu-banner-delete')
ON CONFLICT DO NOTHING;
