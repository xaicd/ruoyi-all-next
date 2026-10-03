-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmContract（源框架导入） (CrmContract)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-contract',
  'crm-dir',
  'CrmContract（源框架导入）管理',
  '/admin/crm/crm-contract',
  'crm/crm-contract/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_contract:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-contract-query',  'menu-crm-contract', '查询CrmContract（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract:query',  1, NOW(), NOW()),
('menu-crm-contract-create', 'menu-crm-contract', '新增CrmContract（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract:create', 2, NOW(), NOW()),
('menu-crm-contract-update', 'menu-crm-contract', '修改CrmContract（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract:update', 3, NOW(), NOW()),
('menu-crm-contract-delete', 'menu-crm-contract', '删除CrmContract（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-contract'),
('1', 'menu-crm-contract-query'),
('1', 'menu-crm-contract-create'),
('1', 'menu-crm-contract-update'),
('1', 'menu-crm-contract-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-contract'),
('1', 'menu-crm-contract-query'),
('1', 'menu-crm-contract-create'),
('1', 'menu-crm-contract-update'),
('1', 'menu-crm-contract-delete')
ON CONFLICT DO NOTHING;
