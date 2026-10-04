-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 计划班组关联 (MesCalPlanTeam)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-cal-plan-team',
  'mes-dir',
  'MES 计划班组关联管理',
  '/admin/mes/mes-cal-plan-team',
  'mes/mes-cal-plan-team/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_cal_plan_team:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-cal-plan-team-query',  'menu-mes-cal-plan-team', '查询MES 计划班组关联', 'BUTTON', 'ACTIVE', 'mes:mes_cal_plan_team:query',  1, NOW(), NOW()),
('menu-mes-cal-plan-team-create', 'menu-mes-cal-plan-team', '新增MES 计划班组关联', 'BUTTON', 'ACTIVE', 'mes:mes_cal_plan_team:create', 2, NOW(), NOW()),
('menu-mes-cal-plan-team-update', 'menu-mes-cal-plan-team', '修改MES 计划班组关联', 'BUTTON', 'ACTIVE', 'mes:mes_cal_plan_team:update', 3, NOW(), NOW()),
('menu-mes-cal-plan-team-delete', 'menu-mes-cal-plan-team', '删除MES 计划班组关联', 'BUTTON', 'ACTIVE', 'mes:mes_cal_plan_team:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-cal-plan-team-rm',        '1', 'menu-mes-cal-plan-team'),
('menu-mes-cal-plan-team-rm-query',  '1', 'menu-mes-cal-plan-team-query'),
('menu-mes-cal-plan-team-rm-create', '1', 'menu-mes-cal-plan-team-create'),
('menu-mes-cal-plan-team-rm-update', '1', 'menu-mes-cal-plan-team-update'),
('menu-mes-cal-plan-team-rm-delete', '1', 'menu-mes-cal-plan-team-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-cal-plan-team-pm',        '1', 'menu-mes-cal-plan-team'),
('menu-mes-cal-plan-team-pm-query',  '1', 'menu-mes-cal-plan-team-query'),
('menu-mes-cal-plan-team-pm-create', '1', 'menu-mes-cal-plan-team-create'),
('menu-mes-cal-plan-team-pm-update', '1', 'menu-mes-cal-plan-team-update'),
('menu-mes-cal-plan-team-pm-delete', '1', 'menu-mes-cal-plan-team-delete')
ON CONFLICT DO NOTHING;
