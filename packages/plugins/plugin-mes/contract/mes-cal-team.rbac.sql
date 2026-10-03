-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesCalTeam（源框架导入） (MesCalTeam)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-cal-team',
  'mes-dir',
  'MesCalTeam（源框架导入）管理',
  '/admin/mes/mes-cal-team',
  'mes/mes-cal-team/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_cal_team:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-cal-team-query',  'menu-mes-cal-team', '查询MesCalTeam（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team:query',  1, NOW(), NOW()),
('menu-mes-cal-team-create', 'menu-mes-cal-team', '新增MesCalTeam（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team:create', 2, NOW(), NOW()),
('menu-mes-cal-team-update', 'menu-mes-cal-team', '修改MesCalTeam（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team:update', 3, NOW(), NOW()),
('menu-mes-cal-team-delete', 'menu-mes-cal-team', '删除MesCalTeam（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_cal_team:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-cal-team'),
('1', 'menu-mes-cal-team-query'),
('1', 'menu-mes-cal-team-create'),
('1', 'menu-mes-cal-team-update'),
('1', 'menu-mes-cal-team-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-cal-team'),
('1', 'menu-mes-cal-team-query'),
('1', 'menu-mes-cal-team-create'),
('1', 'menu-mes-cal-team-update'),
('1', 'menu-mes-cal-team-delete')
ON CONFLICT DO NOTHING;
