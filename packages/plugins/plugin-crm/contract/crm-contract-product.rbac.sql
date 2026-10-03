-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmContractProduct（源框架导入） (CrmContractProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-contract-product',
  'crm-dir',
  'CrmContractProduct（源框架导入）管理',
  '/admin/crm/crm-contract-product',
  'crm/crm-contract-product/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_contract_product:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-contract-product-query',  'menu-crm-contract-product', '查询CrmContractProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract_product:query',  1, NOW(), NOW()),
('menu-crm-contract-product-create', 'menu-crm-contract-product', '新增CrmContractProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract_product:create', 2, NOW(), NOW()),
('menu-crm-contract-product-update', 'menu-crm-contract-product', '修改CrmContractProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract_product:update', 3, NOW(), NOW()),
('menu-crm-contract-product-delete', 'menu-crm-contract-product', '删除CrmContractProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_contract_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-contract-product'),
('1', 'menu-crm-contract-product-query'),
('1', 'menu-crm-contract-product-create'),
('1', 'menu-crm-contract-product-update'),
('1', 'menu-crm-contract-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-contract-product'),
('1', 'menu-crm-contract-product-query'),
('1', 'menu-crm-contract-product-create'),
('1', 'menu-crm-contract-product-update'),
('1', 'menu-crm-contract-product-delete')
ON CONFLICT DO NOTHING;
