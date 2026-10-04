-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 外协发料单 (MesWmOutsourceIssue)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-outsource-issue',
  'mes-dir',
  'MES 外协发料单管理',
  '/admin/mes/mes-wm-outsource-issue',
  'mes/mes-wm-outsource-issue/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_outsource_issue:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-outsource-issue-query',  'menu-mes-wm-outsource-issue', '查询MES 外协发料单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_outsource_issue:query',  1, NOW(), NOW()),
('menu-mes-wm-outsource-issue-create', 'menu-mes-wm-outsource-issue', '新增MES 外协发料单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_outsource_issue:create', 2, NOW(), NOW()),
('menu-mes-wm-outsource-issue-update', 'menu-mes-wm-outsource-issue', '修改MES 外协发料单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_outsource_issue:update', 3, NOW(), NOW()),
('menu-mes-wm-outsource-issue-delete', 'menu-mes-wm-outsource-issue', '删除MES 外协发料单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_outsource_issue:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-outsource-issue-rm',        '1', 'menu-mes-wm-outsource-issue'),
('menu-mes-wm-outsource-issue-rm-query',  '1', 'menu-mes-wm-outsource-issue-query'),
('menu-mes-wm-outsource-issue-rm-create', '1', 'menu-mes-wm-outsource-issue-create'),
('menu-mes-wm-outsource-issue-rm-update', '1', 'menu-mes-wm-outsource-issue-update'),
('menu-mes-wm-outsource-issue-rm-delete', '1', 'menu-mes-wm-outsource-issue-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-outsource-issue-pm',        '1', 'menu-mes-wm-outsource-issue'),
('menu-mes-wm-outsource-issue-pm-query',  '1', 'menu-mes-wm-outsource-issue-query'),
('menu-mes-wm-outsource-issue-pm-create', '1', 'menu-mes-wm-outsource-issue-create'),
('menu-mes-wm-outsource-issue-pm-update', '1', 'menu-mes-wm-outsource-issue-update'),
('menu-mes-wm-outsource-issue-pm-delete', '1', 'menu-mes-wm-outsource-issue-delete')
ON CONFLICT DO NOTHING;
