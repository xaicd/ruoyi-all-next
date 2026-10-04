-- ============================================================
-- Auto-generated RBAC & Menu Migration for CRM 商机状态 DO注意，它是个配置表 (CrmBusinessStatus)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-crm-business-status',
  'crm-dir',
  'CRM 商机状态 DO注意，它是个配置表管理',
  '/admin/crm/crm-business-status',
  'crm/crm-business-status/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_business_status:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-crm-business-status-query',  'menu-crm-business-status', '查询CRM 商机状态 DO注意，它是个配置表', 'BUTTON', 'ACTIVE', 'crm:crm_business_status:query',  1, NOW(), NOW()),
('menu-crm-business-status-create', 'menu-crm-business-status', '新增CRM 商机状态 DO注意，它是个配置表', 'BUTTON', 'ACTIVE', 'crm:crm_business_status:create', 2, NOW(), NOW()),
('menu-crm-business-status-update', 'menu-crm-business-status', '修改CRM 商机状态 DO注意，它是个配置表', 'BUTTON', 'ACTIVE', 'crm:crm_business_status:update', 3, NOW(), NOW()),
('menu-crm-business-status-delete', 'menu-crm-business-status', '删除CRM 商机状态 DO注意，它是个配置表', 'BUTTON', 'ACTIVE', 'crm:crm_business_status:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-crm-business-status-rm',        '1', 'menu-crm-business-status'),
('menu-crm-business-status-rm-query',  '1', 'menu-crm-business-status-query'),
('menu-crm-business-status-rm-create', '1', 'menu-crm-business-status-create'),
('menu-crm-business-status-rm-update', '1', 'menu-crm-business-status-update'),
('menu-crm-business-status-rm-delete', '1', 'menu-crm-business-status-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-crm-business-status-pm',        '1', 'menu-crm-business-status'),
('menu-crm-business-status-pm-query',  '1', 'menu-crm-business-status-query'),
('menu-crm-business-status-pm-create', '1', 'menu-crm-business-status-create'),
('menu-crm-business-status-pm-update', '1', 'menu-crm-business-status-update'),
('menu-crm-business-status-pm-delete', '1', 'menu-crm-business-status-delete')
ON CONFLICT DO NOTHING;
