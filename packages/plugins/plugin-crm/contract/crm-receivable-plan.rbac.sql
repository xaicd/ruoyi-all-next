-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmReceivablePlan（源框架导入） (CrmReceivablePlan)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-receivable-plan',
  'crm-dir',
  'CrmReceivablePlan（源框架导入）管理',
  '/admin/crm/crm-receivable-plan',
  'crm/crm-receivable-plan/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_receivable_plan:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-receivable-plan-query',  'menu-crm-receivable-plan', '查询CrmReceivablePlan（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_receivable_plan:query',  1, NOW(), NOW()),
('menu-crm-receivable-plan-create', 'menu-crm-receivable-plan', '新增CrmReceivablePlan（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_receivable_plan:create', 2, NOW(), NOW()),
('menu-crm-receivable-plan-update', 'menu-crm-receivable-plan', '修改CrmReceivablePlan（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_receivable_plan:update', 3, NOW(), NOW()),
('menu-crm-receivable-plan-delete', 'menu-crm-receivable-plan', '删除CrmReceivablePlan（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_receivable_plan:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-receivable-plan'),
('1', 'menu-crm-receivable-plan-query'),
('1', 'menu-crm-receivable-plan-create'),
('1', 'menu-crm-receivable-plan-update'),
('1', 'menu-crm-receivable-plan-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-receivable-plan'),
('1', 'menu-crm-receivable-plan-query'),
('1', 'menu-crm-receivable-plan-create'),
('1', 'menu-crm-receivable-plan-update'),
('1', 'menu-crm-receivable-plan-delete')
ON CONFLICT DO NOTHING;
