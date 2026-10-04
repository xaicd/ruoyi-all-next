-- ============================================================
-- Auto-generated RBAC & Menu Migration for CRM 合同产品关联表 (CrmContractProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-crm-contract-product',
  'crm-dir',
  'CRM 合同产品关联表管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-crm-contract-product-query',  'menu-crm-contract-product', '查询CRM 合同产品关联表', 'BUTTON', 'ACTIVE', 'crm:crm_contract_product:query',  1, NOW(), NOW()),
('menu-crm-contract-product-create', 'menu-crm-contract-product', '新增CRM 合同产品关联表', 'BUTTON', 'ACTIVE', 'crm:crm_contract_product:create', 2, NOW(), NOW()),
('menu-crm-contract-product-update', 'menu-crm-contract-product', '修改CRM 合同产品关联表', 'BUTTON', 'ACTIVE', 'crm:crm_contract_product:update', 3, NOW(), NOW()),
('menu-crm-contract-product-delete', 'menu-crm-contract-product', '删除CRM 合同产品关联表', 'BUTTON', 'ACTIVE', 'crm:crm_contract_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-crm-contract-product-rm',        '1', 'menu-crm-contract-product'),
('menu-crm-contract-product-rm-query',  '1', 'menu-crm-contract-product-query'),
('menu-crm-contract-product-rm-create', '1', 'menu-crm-contract-product-create'),
('menu-crm-contract-product-rm-update', '1', 'menu-crm-contract-product-update'),
('menu-crm-contract-product-rm-delete', '1', 'menu-crm-contract-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-crm-contract-product-pm',        '1', 'menu-crm-contract-product'),
('menu-crm-contract-product-pm-query',  '1', 'menu-crm-contract-product-query'),
('menu-crm-contract-product-pm-create', '1', 'menu-crm-contract-product-create'),
('menu-crm-contract-product-pm-update', '1', 'menu-crm-contract-product-update'),
('menu-crm-contract-product-pm-delete', '1', 'menu-crm-contract-product-delete')
ON CONFLICT DO NOTHING;
