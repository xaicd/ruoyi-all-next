-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesDvCheckPlan（源框架导入） (MesDvCheckPlan)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-dv-check-plan',
  'mes-dir',
  'MesDvCheckPlan（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-dv-check-plan-query',  'menu-mes-dv-check-plan', '查询MesDvCheckPlan（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan:query',  1, NOW(), NOW()),
('menu-mes-dv-check-plan-create', 'menu-mes-dv-check-plan', '新增MesDvCheckPlan（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan:create', 2, NOW(), NOW()),
('menu-mes-dv-check-plan-update', 'menu-mes-dv-check-plan', '修改MesDvCheckPlan（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan:update', 3, NOW(), NOW()),
('menu-mes-dv-check-plan-delete', 'menu-mes-dv-check-plan', '删除MesDvCheckPlan（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-dv-check-plan'),
('1', 'menu-mes-dv-check-plan-query'),
('1', 'menu-mes-dv-check-plan-create'),
('1', 'menu-mes-dv-check-plan-update'),
('1', 'menu-mes-dv-check-plan-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-dv-check-plan'),
('1', 'menu-mes-dv-check-plan-query'),
('1', 'menu-mes-dv-check-plan-create'),
('1', 'menu-mes-dv-check-plan-update'),
('1', 'menu-mes-dv-check-plan-delete')
ON CONFLICT DO NOTHING;
