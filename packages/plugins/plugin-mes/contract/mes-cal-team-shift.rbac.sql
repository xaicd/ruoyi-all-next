-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesCalTeamShift（源框架导入） (MesCalTeamShift)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-cal-team-shift',
  'mes-dir',
  'MesCalTeamShift（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-cal-team-shift-query',  'menu-mes-cal-team-shift', '查询MesCalTeamShift（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_shift:query',  1, NOW(), NOW()),
('menu-mes-cal-team-shift-create', 'menu-mes-cal-team-shift', '新增MesCalTeamShift（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_shift:create', 2, NOW(), NOW()),
('menu-mes-cal-team-shift-update', 'menu-mes-cal-team-shift', '修改MesCalTeamShift（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_shift:update', 3, NOW(), NOW()),
('menu-mes-cal-team-shift-delete', 'menu-mes-cal-team-shift', '删除MesCalTeamShift（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team_shift:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-cal-team-shift'),
('1', 'menu-mes-cal-team-shift-query'),
('1', 'menu-mes-cal-team-shift-create'),
('1', 'menu-mes-cal-team-shift-update'),
('1', 'menu-mes-cal-team-shift-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-cal-team-shift'),
('1', 'menu-mes-cal-team-shift-query'),
('1', 'menu-mes-cal-team-shift-create'),
('1', 'menu-mes-cal-team-shift-update'),
('1', 'menu-mes-cal-team-shift-delete')
ON CONFLICT DO NOTHING;
