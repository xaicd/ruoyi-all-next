-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 点检保养方案设备 (MesDvCheckPlanMachinery)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-dv-check-plan-machinery',
  'mes-dir',
  'MES 点检保养方案设备管理',
  '/admin/mes/mes-dv-check-plan-machinery',
  'mes/mes-dv-check-plan-machinery/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_check_plan_machinery:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-dv-check-plan-machinery-query',  'menu-mes-dv-check-plan-machinery', '查询MES 点检保养方案设备', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan_machinery:query',  1, NOW(), NOW()),
('menu-mes-dv-check-plan-machinery-create', 'menu-mes-dv-check-plan-machinery', '新增MES 点检保养方案设备', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan_machinery:create', 2, NOW(), NOW()),
('menu-mes-dv-check-plan-machinery-update', 'menu-mes-dv-check-plan-machinery', '修改MES 点检保养方案设备', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan_machinery:update', 3, NOW(), NOW()),
('menu-mes-dv-check-plan-machinery-delete', 'menu-mes-dv-check-plan-machinery', '删除MES 点检保养方案设备', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan_machinery:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-dv-check-plan-machinery-rm',        '1', 'menu-mes-dv-check-plan-machinery'),
('menu-mes-dv-check-plan-machinery-rm-query',  '1', 'menu-mes-dv-check-plan-machinery-query'),
('menu-mes-dv-check-plan-machinery-rm-create', '1', 'menu-mes-dv-check-plan-machinery-create'),
('menu-mes-dv-check-plan-machinery-rm-update', '1', 'menu-mes-dv-check-plan-machinery-update'),
('menu-mes-dv-check-plan-machinery-rm-delete', '1', 'menu-mes-dv-check-plan-machinery-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-dv-check-plan-machinery-pm',        '1', 'menu-mes-dv-check-plan-machinery'),
('menu-mes-dv-check-plan-machinery-pm-query',  '1', 'menu-mes-dv-check-plan-machinery-query'),
('menu-mes-dv-check-plan-machinery-pm-create', '1', 'menu-mes-dv-check-plan-machinery-create'),
('menu-mes-dv-check-plan-machinery-pm-update', '1', 'menu-mes-dv-check-plan-machinery-update'),
('menu-mes-dv-check-plan-machinery-pm-delete', '1', 'menu-mes-dv-check-plan-machinery-delete')
ON CONFLICT DO NOTHING;
