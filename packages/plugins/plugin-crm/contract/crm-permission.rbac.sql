-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmPermission（源框架导入） (CrmPermission)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-permission',
  'crm-dir',
  'CrmPermission（源框架导入）管理',
  '/admin/crm/crm-permission',
  'crm/crm-permission/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_permission:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-permission-query',  'menu-crm-permission', '查询CrmPermission（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_permission:query',  1, NOW(), NOW()),
('menu-crm-permission-create', 'menu-crm-permission', '新增CrmPermission（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_permission:create', 2, NOW(), NOW()),
('menu-crm-permission-update', 'menu-crm-permission', '修改CrmPermission（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_permission:update', 3, NOW(), NOW()),
('menu-crm-permission-delete', 'menu-crm-permission', '删除CrmPermission（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_permission:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-permission'),
('1', 'menu-crm-permission-query'),
('1', 'menu-crm-permission-create'),
('1', 'menu-crm-permission-update'),
('1', 'menu-crm-permission-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-permission'),
('1', 'menu-crm-permission-query'),
('1', 'menu-crm-permission-create'),
('1', 'menu-crm-permission-update'),
('1', 'menu-crm-permission-delete')
ON CONFLICT DO NOTHING;
