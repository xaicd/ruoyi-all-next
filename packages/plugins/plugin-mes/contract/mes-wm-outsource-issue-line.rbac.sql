-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmOutsourceIssueLine（源框架导入） (MesWmOutsourceIssueLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-outsource-issue-line',
  'mes-dir',
  'MesWmOutsourceIssueLine（源框架导入）管理',
  '/admin/mes/mes-wm-outsource-issue-line',
  'mes/mes-wm-outsource-issue-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_outsource_issue_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-outsource-issue-line-query',  'menu-mes-wm-outsource-issue-line', '查询MesWmOutsourceIssueLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_outsource_issue_line:query',  1, NOW(), NOW()),
('menu-mes-wm-outsource-issue-line-create', 'menu-mes-wm-outsource-issue-line', '新增MesWmOutsourceIssueLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_outsource_issue_line:create', 2, NOW(), NOW()),
('menu-mes-wm-outsource-issue-line-update', 'menu-mes-wm-outsource-issue-line', '修改MesWmOutsourceIssueLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_outsource_issue_line:update', 3, NOW(), NOW()),
('menu-mes-wm-outsource-issue-line-delete', 'menu-mes-wm-outsource-issue-line', '删除MesWmOutsourceIssueLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_outsource_issue_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-outsource-issue-line'),
('1', 'menu-mes-wm-outsource-issue-line-query'),
('1', 'menu-mes-wm-outsource-issue-line-create'),
('1', 'menu-mes-wm-outsource-issue-line-update'),
('1', 'menu-mes-wm-outsource-issue-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-outsource-issue-line'),
('1', 'menu-mes-wm-outsource-issue-line-query'),
('1', 'menu-mes-wm-outsource-issue-line-create'),
('1', 'menu-mes-wm-outsource-issue-line-update'),
('1', 'menu-mes-wm-outsource-issue-line-delete')
ON CONFLICT DO NOTHING;
