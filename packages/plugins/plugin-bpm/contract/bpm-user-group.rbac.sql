-- ============================================================
-- Auto-generated RBAC & Menu Migration for BpmUserGroup（源框架导入） (BpmUserGroup)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-bpm-user-group',
  'bpm-dir',
  'BpmUserGroup（源框架导入）管理',
  '/admin/bpm/bpm-user-group',
  'bpm/bpm-user-group/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'bpm:bpm_user_group:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-bpm-user-group-query',  'menu-bpm-user-group', '查询BpmUserGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_user_group:query',  1, NOW(), NOW()),
('menu-bpm-user-group-create', 'menu-bpm-user-group', '新增BpmUserGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_user_group:create', 2, NOW(), NOW()),
('menu-bpm-user-group-update', 'menu-bpm-user-group', '修改BpmUserGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_user_group:update', 3, NOW(), NOW()),
('menu-bpm-user-group-delete', 'menu-bpm-user-group', '删除BpmUserGroup（源框架导入）', 'BUTTON', 'ACTIVE', 'bpm:bpm_user_group:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-bpm-user-group'),
('1', 'menu-bpm-user-group-query'),
('1', 'menu-bpm-user-group-create'),
('1', 'menu-bpm-user-group-update'),
('1', 'menu-bpm-user-group-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-bpm-user-group'),
('1', 'menu-bpm-user-group-query'),
('1', 'menu-bpm-user-group-create'),
('1', 'menu-bpm-user-group-update'),
('1', 'menu-bpm-user-group-delete')
ON CONFLICT DO NOTHING;
