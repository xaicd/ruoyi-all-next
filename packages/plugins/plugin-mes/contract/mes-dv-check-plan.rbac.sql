-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 点检保养方案 (MesDvCheckPlan)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-dv-check-plan',
  'mes-dir',
  'MES 点检保养方案管理',
  '/admin/mes/mes-dv-check-plan',
  'mes/mes-dv-check-plan/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_check_plan:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-dv-check-plan-query',  'menu-mes-dv-check-plan', '查询MES 点检保养方案', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan:query',  1, NOW(), NOW()),
('menu-mes-dv-check-plan-create', 'menu-mes-dv-check-plan', '新增MES 点检保养方案', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan:create', 2, NOW(), NOW()),
('menu-mes-dv-check-plan-update', 'menu-mes-dv-check-plan', '修改MES 点检保养方案', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan:update', 3, NOW(), NOW()),
('menu-mes-dv-check-plan-delete', 'menu-mes-dv-check-plan', '删除MES 点检保养方案', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-dv-check-plan-rm',        '1', 'menu-mes-dv-check-plan'),
('menu-mes-dv-check-plan-rm-query',  '1', 'menu-mes-dv-check-plan-query'),
('menu-mes-dv-check-plan-rm-create', '1', 'menu-mes-dv-check-plan-create'),
('menu-mes-dv-check-plan-rm-update', '1', 'menu-mes-dv-check-plan-update'),
('menu-mes-dv-check-plan-rm-delete', '1', 'menu-mes-dv-check-plan-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-dv-check-plan-pm',        '1', 'menu-mes-dv-check-plan'),
('menu-mes-dv-check-plan-pm-query',  '1', 'menu-mes-dv-check-plan-query'),
('menu-mes-dv-check-plan-pm-create', '1', 'menu-mes-dv-check-plan-create'),
('menu-mes-dv-check-plan-pm-update', '1', 'menu-mes-dv-check-plan-update'),
('menu-mes-dv-check-plan-pm-delete', '1', 'menu-mes-dv-check-plan-delete')
ON CONFLICT DO NOTHING;
