-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmBusiness（源框架导入） (CrmBusiness)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-business',
  'crm-dir',
  'CrmBusiness（源框架导入）管理',
  '/admin/crm/crm-business',
  'crm/crm-business/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_business:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-business-query',  'menu-crm-business', '查询CrmBusiness（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business:query',  1, NOW(), NOW()),
('menu-crm-business-create', 'menu-crm-business', '新增CrmBusiness（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business:create', 2, NOW(), NOW()),
('menu-crm-business-update', 'menu-crm-business', '修改CrmBusiness（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business:update', 3, NOW(), NOW()),
('menu-crm-business-delete', 'menu-crm-business', '删除CrmBusiness（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-business'),
('1', 'menu-crm-business-query'),
('1', 'menu-crm-business-create'),
('1', 'menu-crm-business-update'),
('1', 'menu-crm-business-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-business'),
('1', 'menu-crm-business-query'),
('1', 'menu-crm-business-create'),
('1', 'menu-crm-business-update'),
('1', 'menu-crm-business-delete')
ON CONFLICT DO NOTHING;
