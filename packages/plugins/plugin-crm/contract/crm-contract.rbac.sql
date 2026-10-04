-- ============================================================
-- Auto-generated RBAC & Menu Migration for CRM 合同 (CrmContract)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-crm-contract',
  'crm-dir',
  'CRM 合同管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-crm-contract-query',  'menu-crm-contract', '查询CRM 合同', 'BUTTON', 'ACTIVE', 'crm:crm_contract:query',  1, NOW(), NOW()),
('menu-crm-contract-create', 'menu-crm-contract', '新增CRM 合同', 'BUTTON', 'ACTIVE', 'crm:crm_contract:create', 2, NOW(), NOW()),
('menu-crm-contract-update', 'menu-crm-contract', '修改CRM 合同', 'BUTTON', 'ACTIVE', 'crm:crm_contract:update', 3, NOW(), NOW()),
('menu-crm-contract-delete', 'menu-crm-contract', '删除CRM 合同', 'BUTTON', 'ACTIVE', 'crm:crm_contract:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-crm-contract-rm',        '1', 'menu-crm-contract'),
('menu-crm-contract-rm-query',  '1', 'menu-crm-contract-query'),
('menu-crm-contract-rm-create', '1', 'menu-crm-contract-create'),
('menu-crm-contract-rm-update', '1', 'menu-crm-contract-update'),
('menu-crm-contract-rm-delete', '1', 'menu-crm-contract-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-crm-contract-pm',        '1', 'menu-crm-contract'),
('menu-crm-contract-pm-query',  '1', 'menu-crm-contract-query'),
('menu-crm-contract-pm-create', '1', 'menu-crm-contract-create'),
('menu-crm-contract-pm-update', '1', 'menu-crm-contract-update'),
('menu-crm-contract-pm-delete', '1', 'menu-crm-contract-delete')
ON CONFLICT DO NOTHING;
