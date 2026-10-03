-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmCustomerPoolConfig（源框架导入） (CrmCustomerPoolConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-customer-pool-config',
  'crm-dir',
  'CrmCustomerPoolConfig（源框架导入）管理',
  '/admin/crm/crm-customer-pool-config',
  'crm/crm-customer-pool-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_customer_pool_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-customer-pool-config-query',  'menu-crm-customer-pool-config', '查询CrmCustomerPoolConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_customer_pool_config:query',  1, NOW(), NOW()),
('menu-crm-customer-pool-config-create', 'menu-crm-customer-pool-config', '新增CrmCustomerPoolConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_customer_pool_config:create', 2, NOW(), NOW()),
('menu-crm-customer-pool-config-update', 'menu-crm-customer-pool-config', '修改CrmCustomerPoolConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_customer_pool_config:update', 3, NOW(), NOW()),
('menu-crm-customer-pool-config-delete', 'menu-crm-customer-pool-config', '删除CrmCustomerPoolConfig（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_customer_pool_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-customer-pool-config'),
('1', 'menu-crm-customer-pool-config-query'),
('1', 'menu-crm-customer-pool-config-create'),
('1', 'menu-crm-customer-pool-config-update'),
('1', 'menu-crm-customer-pool-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-customer-pool-config'),
('1', 'menu-crm-customer-pool-config-query'),
('1', 'menu-crm-customer-pool-config-create'),
('1', 'menu-crm-customer-pool-config-update'),
('1', 'menu-crm-customer-pool-config-delete')
ON CONFLICT DO NOTHING;
