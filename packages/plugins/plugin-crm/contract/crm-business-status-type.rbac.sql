-- ============================================================
-- Auto-generated RBAC & Menu Migration for CRM 商机状态组 DO注意，它是个配置表 (CrmBusinessStatusType)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-crm-business-status-type',
  'crm-dir',
  'CRM 商机状态组 DO注意，它是个配置表管理',
  '/admin/crm/crm-business-status-type',
  'crm/crm-business-status-type/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_business_status_type:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-crm-business-status-type-query',  'menu-crm-business-status-type', '查询CRM 商机状态组 DO注意，它是个配置表', 'BUTTON', 'ACTIVE', 'crm:crm_business_status_type:query',  1, NOW(), NOW()),
('menu-crm-business-status-type-create', 'menu-crm-business-status-type', '新增CRM 商机状态组 DO注意，它是个配置表', 'BUTTON', 'ACTIVE', 'crm:crm_business_status_type:create', 2, NOW(), NOW()),
('menu-crm-business-status-type-update', 'menu-crm-business-status-type', '修改CRM 商机状态组 DO注意，它是个配置表', 'BUTTON', 'ACTIVE', 'crm:crm_business_status_type:update', 3, NOW(), NOW()),
('menu-crm-business-status-type-delete', 'menu-crm-business-status-type', '删除CRM 商机状态组 DO注意，它是个配置表', 'BUTTON', 'ACTIVE', 'crm:crm_business_status_type:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-crm-business-status-type-rm',        '1', 'menu-crm-business-status-type'),
('menu-crm-business-status-type-rm-query',  '1', 'menu-crm-business-status-type-query'),
('menu-crm-business-status-type-rm-create', '1', 'menu-crm-business-status-type-create'),
('menu-crm-business-status-type-rm-update', '1', 'menu-crm-business-status-type-update'),
('menu-crm-business-status-type-rm-delete', '1', 'menu-crm-business-status-type-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-crm-business-status-type-pm',        '1', 'menu-crm-business-status-type'),
('menu-crm-business-status-type-pm-query',  '1', 'menu-crm-business-status-type-query'),
('menu-crm-business-status-type-pm-create', '1', 'menu-crm-business-status-type-create'),
('menu-crm-business-status-type-pm-update', '1', 'menu-crm-business-status-type-update'),
('menu-crm-business-status-type-pm-delete', '1', 'menu-crm-business-status-type-delete')
ON CONFLICT DO NOTHING;
