-- ============================================================
-- Auto-generated RBAC & Menu Migration for CRM 数据权限 (CrmPermission)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-crm-permission',
  'crm-dir',
  'CRM 数据权限管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-crm-permission-query',  'menu-crm-permission', '查询CRM 数据权限', 'BUTTON', 'ACTIVE', 'crm:crm_permission:query',  1, NOW(), NOW()),
('menu-crm-permission-create', 'menu-crm-permission', '新增CRM 数据权限', 'BUTTON', 'ACTIVE', 'crm:crm_permission:create', 2, NOW(), NOW()),
('menu-crm-permission-update', 'menu-crm-permission', '修改CRM 数据权限', 'BUTTON', 'ACTIVE', 'crm:crm_permission:update', 3, NOW(), NOW()),
('menu-crm-permission-delete', 'menu-crm-permission', '删除CRM 数据权限', 'BUTTON', 'ACTIVE', 'crm:crm_permission:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-crm-permission-rm',        '1', 'menu-crm-permission'),
('menu-crm-permission-rm-query',  '1', 'menu-crm-permission-query'),
('menu-crm-permission-rm-create', '1', 'menu-crm-permission-create'),
('menu-crm-permission-rm-update', '1', 'menu-crm-permission-update'),
('menu-crm-permission-rm-delete', '1', 'menu-crm-permission-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-crm-permission-pm',        '1', 'menu-crm-permission'),
('menu-crm-permission-pm-query',  '1', 'menu-crm-permission-query'),
('menu-crm-permission-pm-create', '1', 'menu-crm-permission-create'),
('menu-crm-permission-pm-update', '1', 'menu-crm-permission-update'),
('menu-crm-permission-pm-delete', '1', 'menu-crm-permission-delete')
ON CONFLICT DO NOTHING;
