-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 排班计划 (MesCalPlan)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-cal-plan',
  'mes-dir',
  'MES 排班计划管理',
  '/admin/mes/mes-cal-plan',
  'mes/mes-cal-plan/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_cal_plan:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-cal-plan-query',  'menu-mes-cal-plan', '查询MES 排班计划', 'BUTTON', 'ACTIVE', 'mes:mes_cal_plan:query',  1, NOW(), NOW()),
('menu-mes-cal-plan-create', 'menu-mes-cal-plan', '新增MES 排班计划', 'BUTTON', 'ACTIVE', 'mes:mes_cal_plan:create', 2, NOW(), NOW()),
('menu-mes-cal-plan-update', 'menu-mes-cal-plan', '修改MES 排班计划', 'BUTTON', 'ACTIVE', 'mes:mes_cal_plan:update', 3, NOW(), NOW()),
('menu-mes-cal-plan-delete', 'menu-mes-cal-plan', '删除MES 排班计划', 'BUTTON', 'ACTIVE', 'mes:mes_cal_plan:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-cal-plan-rm',        '1', 'menu-mes-cal-plan'),
('menu-mes-cal-plan-rm-query',  '1', 'menu-mes-cal-plan-query'),
('menu-mes-cal-plan-rm-create', '1', 'menu-mes-cal-plan-create'),
('menu-mes-cal-plan-rm-update', '1', 'menu-mes-cal-plan-update'),
('menu-mes-cal-plan-rm-delete', '1', 'menu-mes-cal-plan-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-cal-plan-pm',        '1', 'menu-mes-cal-plan'),
('menu-mes-cal-plan-pm-query',  '1', 'menu-mes-cal-plan-query'),
('menu-mes-cal-plan-pm-create', '1', 'menu-mes-cal-plan-create'),
('menu-mes-cal-plan-pm-update', '1', 'menu-mes-cal-plan-update'),
('menu-mes-cal-plan-pm-delete', '1', 'menu-mes-cal-plan-delete')
ON CONFLICT DO NOTHING;
