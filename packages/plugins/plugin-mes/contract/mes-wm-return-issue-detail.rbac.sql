-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmReturnIssueDetail（源框架导入） (MesWmReturnIssueDetail)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-return-issue-detail',
  'mes-dir',
  'MesWmReturnIssueDetail（源框架导入）管理',
  '/admin/mes/mes-wm-return-issue-detail',
  'mes/mes-wm-return-issue-detail/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_return_issue_detail:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-return-issue-detail-query',  'menu-mes-wm-return-issue-detail', '查询MesWmReturnIssueDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_issue_detail:query',  1, NOW(), NOW()),
('menu-mes-wm-return-issue-detail-create', 'menu-mes-wm-return-issue-detail', '新增MesWmReturnIssueDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_issue_detail:create', 2, NOW(), NOW()),
('menu-mes-wm-return-issue-detail-update', 'menu-mes-wm-return-issue-detail', '修改MesWmReturnIssueDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_issue_detail:update', 3, NOW(), NOW()),
('menu-mes-wm-return-issue-detail-delete', 'menu-mes-wm-return-issue-detail', '删除MesWmReturnIssueDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_return_issue_detail:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-return-issue-detail'),
('1', 'menu-mes-wm-return-issue-detail-query'),
('1', 'menu-mes-wm-return-issue-detail-create'),
('1', 'menu-mes-wm-return-issue-detail-update'),
('1', 'menu-mes-wm-return-issue-detail-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-return-issue-detail'),
('1', 'menu-mes-wm-return-issue-detail-query'),
('1', 'menu-mes-wm-return-issue-detail-create'),
('1', 'menu-mes-wm-return-issue-detail-update'),
('1', 'menu-mes-wm-return-issue-detail-delete')
ON CONFLICT DO NOTHING;
