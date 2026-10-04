-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 杂项出库单行 (MesWmMiscIssueLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-misc-issue-line',
  'mes-dir',
  'MES 杂项出库单行管理',
  '/admin/mes/mes-wm-misc-issue-line',
  'mes/mes-wm-misc-issue-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_misc_issue_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-misc-issue-line-query',  'menu-mes-wm-misc-issue-line', '查询MES 杂项出库单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_issue_line:query',  1, NOW(), NOW()),
('menu-mes-wm-misc-issue-line-create', 'menu-mes-wm-misc-issue-line', '新增MES 杂项出库单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_issue_line:create', 2, NOW(), NOW()),
('menu-mes-wm-misc-issue-line-update', 'menu-mes-wm-misc-issue-line', '修改MES 杂项出库单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_issue_line:update', 3, NOW(), NOW()),
('menu-mes-wm-misc-issue-line-delete', 'menu-mes-wm-misc-issue-line', '删除MES 杂项出库单行', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_issue_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-misc-issue-line-rm',        '1', 'menu-mes-wm-misc-issue-line'),
('menu-mes-wm-misc-issue-line-rm-query',  '1', 'menu-mes-wm-misc-issue-line-query'),
('menu-mes-wm-misc-issue-line-rm-create', '1', 'menu-mes-wm-misc-issue-line-create'),
('menu-mes-wm-misc-issue-line-rm-update', '1', 'menu-mes-wm-misc-issue-line-update'),
('menu-mes-wm-misc-issue-line-rm-delete', '1', 'menu-mes-wm-misc-issue-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-misc-issue-line-pm',        '1', 'menu-mes-wm-misc-issue-line'),
('menu-mes-wm-misc-issue-line-pm-query',  '1', 'menu-mes-wm-misc-issue-line-query'),
('menu-mes-wm-misc-issue-line-pm-create', '1', 'menu-mes-wm-misc-issue-line-create'),
('menu-mes-wm-misc-issue-line-pm-update', '1', 'menu-mes-wm-misc-issue-line-update'),
('menu-mes-wm-misc-issue-line-pm-delete', '1', 'menu-mes-wm-misc-issue-line-delete')
ON CONFLICT DO NOTHING;
