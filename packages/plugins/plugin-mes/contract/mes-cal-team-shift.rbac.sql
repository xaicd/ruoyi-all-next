-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 班组排班 (MesCalTeamShift)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-cal-team-shift',
  'mes-dir',
  'MES 班组排班管理',
  '/admin/mes/mes-cal-team-shift',
  'mes/mes-cal-team-shift/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_cal_team_shift:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-cal-team-shift-query',  'menu-mes-cal-team-shift', '查询MES 班组排班', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_shift:query',  1, NOW(), NOW()),
('menu-mes-cal-team-shift-create', 'menu-mes-cal-team-shift', '新增MES 班组排班', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_shift:create', 2, NOW(), NOW()),
('menu-mes-cal-team-shift-update', 'menu-mes-cal-team-shift', '修改MES 班组排班', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_shift:update', 3, NOW(), NOW()),
('menu-mes-cal-team-shift-delete', 'menu-mes-cal-team-shift', '删除MES 班组排班', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_shift:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-cal-team-shift-rm',        '1', 'menu-mes-cal-team-shift'),
('menu-mes-cal-team-shift-rm-query',  '1', 'menu-mes-cal-team-shift-query'),
('menu-mes-cal-team-shift-rm-create', '1', 'menu-mes-cal-team-shift-create'),
('menu-mes-cal-team-shift-rm-update', '1', 'menu-mes-cal-team-shift-update'),
('menu-mes-cal-team-shift-rm-delete', '1', 'menu-mes-cal-team-shift-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-cal-team-shift-pm',        '1', 'menu-mes-cal-team-shift'),
('menu-mes-cal-team-shift-pm-query',  '1', 'menu-mes-cal-team-shift-query'),
('menu-mes-cal-team-shift-pm-create', '1', 'menu-mes-cal-team-shift-create'),
('menu-mes-cal-team-shift-pm-update', '1', 'menu-mes-cal-team-shift-update'),
('menu-mes-cal-team-shift-pm-delete', '1', 'menu-mes-cal-team-shift-delete')
ON CONFLICT DO NOTHING;
