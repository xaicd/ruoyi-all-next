-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 生产任务投料 (MesProTaskIssue)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-pro-task-issue',
  'mes-dir',
  'MES 生产任务投料管理',
  '/admin/mes/mes-pro-task-issue',
  'mes/mes-pro-task-issue/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_pro_task_issue:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-pro-task-issue-query',  'menu-mes-pro-task-issue', '查询MES 生产任务投料', 'BUTTON', 'ACTIVE', 'mes:mes_pro_task_issue:query',  1, NOW(), NOW()),
('menu-mes-pro-task-issue-create', 'menu-mes-pro-task-issue', '新增MES 生产任务投料', 'BUTTON', 'ACTIVE', 'mes:mes_pro_task_issue:create', 2, NOW(), NOW()),
('menu-mes-pro-task-issue-update', 'menu-mes-pro-task-issue', '修改MES 生产任务投料', 'BUTTON', 'ACTIVE', 'mes:mes_pro_task_issue:update', 3, NOW(), NOW()),
('menu-mes-pro-task-issue-delete', 'menu-mes-pro-task-issue', '删除MES 生产任务投料', 'BUTTON', 'ACTIVE', 'mes:mes_pro_task_issue:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-pro-task-issue-rm',        '1', 'menu-mes-pro-task-issue'),
('menu-mes-pro-task-issue-rm-query',  '1', 'menu-mes-pro-task-issue-query'),
('menu-mes-pro-task-issue-rm-create', '1', 'menu-mes-pro-task-issue-create'),
('menu-mes-pro-task-issue-rm-update', '1', 'menu-mes-pro-task-issue-update'),
('menu-mes-pro-task-issue-rm-delete', '1', 'menu-mes-pro-task-issue-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-pro-task-issue-pm',        '1', 'menu-mes-pro-task-issue'),
('menu-mes-pro-task-issue-pm-query',  '1', 'menu-mes-pro-task-issue-query'),
('menu-mes-pro-task-issue-pm-create', '1', 'menu-mes-pro-task-issue-create'),
('menu-mes-pro-task-issue-pm-update', '1', 'menu-mes-pro-task-issue-update'),
('menu-mes-pro-task-issue-pm-delete', '1', 'menu-mes-pro-task-issue-delete')
ON CONFLICT DO NOTHING;
