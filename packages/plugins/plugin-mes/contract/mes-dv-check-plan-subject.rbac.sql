-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 点检保养方案项目 (MesDvCheckPlanSubject)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-dv-check-plan-subject',
  'mes-dir',
  'MES 点检保养方案项目管理',
  '/admin/mes/mes-dv-check-plan-subject',
  'mes/mes-dv-check-plan-subject/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_check_plan_subject:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-dv-check-plan-subject-query',  'menu-mes-dv-check-plan-subject', '查询MES 点检保养方案项目', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan_subject:query',  1, NOW(), NOW()),
('menu-mes-dv-check-plan-subject-create', 'menu-mes-dv-check-plan-subject', '新增MES 点检保养方案项目', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan_subject:create', 2, NOW(), NOW()),
('menu-mes-dv-check-plan-subject-update', 'menu-mes-dv-check-plan-subject', '修改MES 点检保养方案项目', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan_subject:update', 3, NOW(), NOW()),
('menu-mes-dv-check-plan-subject-delete', 'menu-mes-dv-check-plan-subject', '删除MES 点检保养方案项目', 'BUTTON', 'ACTIVE', 'mes:mes_dv_check_plan_subject:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-dv-check-plan-subject-rm',        '1', 'menu-mes-dv-check-plan-subject'),
('menu-mes-dv-check-plan-subject-rm-query',  '1', 'menu-mes-dv-check-plan-subject-query'),
('menu-mes-dv-check-plan-subject-rm-create', '1', 'menu-mes-dv-check-plan-subject-create'),
('menu-mes-dv-check-plan-subject-rm-update', '1', 'menu-mes-dv-check-plan-subject-update'),
('menu-mes-dv-check-plan-subject-rm-delete', '1', 'menu-mes-dv-check-plan-subject-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-dv-check-plan-subject-pm',        '1', 'menu-mes-dv-check-plan-subject'),
('menu-mes-dv-check-plan-subject-pm-query',  '1', 'menu-mes-dv-check-plan-subject-query'),
('menu-mes-dv-check-plan-subject-pm-create', '1', 'menu-mes-dv-check-plan-subject-create'),
('menu-mes-dv-check-plan-subject-pm-update', '1', 'menu-mes-dv-check-plan-subject-update'),
('menu-mes-dv-check-plan-subject-pm-delete', '1', 'menu-mes-dv-check-plan-subject-delete')
ON CONFLICT DO NOTHING;
