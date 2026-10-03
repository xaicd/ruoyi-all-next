-- ============================================================
-- Auto-generated RBAC & Menu Migration for DiyPage（源框架导入） (DiyPage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-diy-page',
  'mall-dir',
  'DiyPage（源框架导入）管理',
  '/admin/mall/diy-page',
  'mall/diy-page/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:diy_page:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-diy-page-query',  'menu-diy-page', '查询DiyPage（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:diy_page:query',  1, NOW(), NOW()),
('menu-diy-page-create', 'menu-diy-page', '新增DiyPage（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:diy_page:create', 2, NOW(), NOW()),
('menu-diy-page-update', 'menu-diy-page', '修改DiyPage（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:diy_page:update', 3, NOW(), NOW()),
('menu-diy-page-delete', 'menu-diy-page', '删除DiyPage（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:diy_page:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-diy-page'),
('1', 'menu-diy-page-query'),
('1', 'menu-diy-page-create'),
('1', 'menu-diy-page-update'),
('1', 'menu-diy-page-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-diy-page'),
('1', 'menu-diy-page-query'),
('1', 'menu-diy-page-create'),
('1', 'menu-diy-page-update'),
('1', 'menu-diy-page-delete')
ON CONFLICT DO NOTHING;
