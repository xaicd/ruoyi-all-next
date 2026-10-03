-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmMiscIssue（源框架导入） (MesWmMiscIssue)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-misc-issue',
  'mes-dir',
  'MesWmMiscIssue（源框架导入）管理',
  '/admin/mes/mes-wm-misc-issue',
  'mes/mes-wm-misc-issue/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_misc_issue:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-misc-issue-query',  'menu-mes-wm-misc-issue', '查询MesWmMiscIssue（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_issue:query',  1, NOW(), NOW()),
('menu-mes-wm-misc-issue-create', 'menu-mes-wm-misc-issue', '新增MesWmMiscIssue（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_issue:create', 2, NOW(), NOW()),
('menu-mes-wm-misc-issue-update', 'menu-mes-wm-misc-issue', '修改MesWmMiscIssue（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_issue:update', 3, NOW(), NOW()),
('menu-mes-wm-misc-issue-delete', 'menu-mes-wm-misc-issue', '删除MesWmMiscIssue（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_issue:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-misc-issue'),
('1', 'menu-mes-wm-misc-issue-query'),
('1', 'menu-mes-wm-misc-issue-create'),
('1', 'menu-mes-wm-misc-issue-update'),
('1', 'menu-mes-wm-misc-issue-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-misc-issue'),
('1', 'menu-mes-wm-misc-issue-query'),
('1', 'menu-mes-wm-misc-issue-create'),
('1', 'menu-mes-wm-misc-issue-update'),
('1', 'menu-mes-wm-misc-issue-delete')
ON CONFLICT DO NOTHING;
