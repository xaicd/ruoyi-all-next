-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmContractConfig（源框架导入） (CrmContractConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-contract-config',
  'crm-dir',
  'CrmContractConfig（源框架导入）管理',
  '/admin/crm/crm-contract-config',
  'crm/crm-contract-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_contract_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-contract-config-query',  'menu-crm-contract-config', '查询CrmContractConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract_config:query',  1, NOW(), NOW()),
('menu-crm-contract-config-create', 'menu-crm-contract-config', '新增CrmContractConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract_config:create', 2, NOW(), NOW()),
('menu-crm-contract-config-update', 'menu-crm-contract-config', '修改CrmContractConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract_config:update', 3, NOW(), NOW()),
('menu-crm-contract-config-delete', 'menu-crm-contract-config', '删除CrmContractConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-contract-config'),
('1', 'menu-crm-contract-config-query'),
('1', 'menu-crm-contract-config-create'),
('1', 'menu-crm-contract-config-update'),
('1', 'menu-crm-contract-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-contract-config'),
('1', 'menu-crm-contract-config-query'),
('1', 'menu-crm-contract-config-create'),
('1', 'menu-crm-contract-config-update'),
('1', 'menu-crm-contract-config-delete')
ON CONFLICT DO NOTHING;
