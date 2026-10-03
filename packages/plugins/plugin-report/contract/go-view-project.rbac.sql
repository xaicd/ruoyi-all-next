-- ============================================================
-- Auto-generated RBAC & Menu Migration for GoViewProject（源框架导入） (GoViewProject)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-go-view-project',
  'report-dir',
  'GoViewProject（源框架导入）管理',
  '/admin/report/go-view-project',
  'report/go-view-project/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'report:go_view_project:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-go-view-project-query',  'menu-go-view-project', '查询GoViewProject（源框架导入）', 'BUTTON', 'ACTIVE', 'report:go_view_project:query',  1, NOW(), NOW()),
('menu-go-view-project-create', 'menu-go-view-project', '新增GoViewProject（源框架导入）', 'BUTTON', 'ACTIVE', 'report:go_view_project:create', 2, NOW(), NOW()),
('menu-go-view-project-update', 'menu-go-view-project', '修改GoViewProject（源框架导入）', 'BUTTON', 'ACTIVE', 'report:go_view_project:update', 3, NOW(), NOW()),
('menu-go-view-project-delete', 'menu-go-view-project', '删除GoViewProject（源框架导入）', 'BUTTON', 'ACTIVE', 'report:go_view_project:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-go-view-project'),
('1', 'menu-go-view-project-query'),
('1', 'menu-go-view-project-create'),
('1', 'menu-go-view-project-update'),
('1', 'menu-go-view-project-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-go-view-project'),
('1', 'menu-go-view-project-query'),
('1', 'menu-go-view-project-create'),
('1', 'menu-go-view-project-update'),
('1', 'menu-go-view-project-delete')
ON CONFLICT DO NOTHING;
