-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmBusinessStatusType（源框架导入） (CrmBusinessStatusType)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-business-status-type',
  'crm-dir',
  'CrmBusinessStatusType（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-business-status-type-query',  'menu-crm-business-status-type', '查询CrmBusinessStatusType（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business_status_type:query',  1, NOW(), NOW()),
('menu-crm-business-status-type-create', 'menu-crm-business-status-type', '新增CrmBusinessStatusType（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business_status_type:create', 2, NOW(), NOW()),
('menu-crm-business-status-type-update', 'menu-crm-business-status-type', '修改CrmBusinessStatusType（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business_status_type:update', 3, NOW(), NOW()),
('menu-crm-business-status-type-delete', 'menu-crm-business-status-type', '删除CrmBusinessStatusType（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business_status_type:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-business-status-type'),
('1', 'menu-crm-business-status-type-query'),
('1', 'menu-crm-business-status-type-create'),
('1', 'menu-crm-business-status-type-update'),
('1', 'menu-crm-business-status-type-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-business-status-type'),
('1', 'menu-crm-business-status-type-query'),
('1', 'menu-crm-business-status-type-create'),
('1', 'menu-crm-business-status-type-update'),
('1', 'menu-crm-business-status-type-delete')
ON CONFLICT DO NOTHING;
