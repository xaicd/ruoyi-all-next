-- ============================================================
-- Auto-generated RBAC & Menu Migration for 客户公海配置 (CrmCustomerPoolConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-crm-customer-pool-config',
  'crm-dir',
  '客户公海配置管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-crm-customer-pool-config-query',  'menu-crm-customer-pool-config', '查询客户公海配置', 'BUTTON', 'ACTIVE', 'crm:crm_customer_pool_config:query',  1, NOW(), NOW()),
('menu-crm-customer-pool-config-create', 'menu-crm-customer-pool-config', '新增客户公海配置', 'BUTTON', 'ACTIVE', 'crm:crm_customer_pool_config:create', 2, NOW(), NOW()),
('menu-crm-customer-pool-config-update', 'menu-crm-customer-pool-config', '修改客户公海配置', 'BUTTON', 'ACTIVE', 'crm:crm_customer_pool_config:update', 3, NOW(), NOW()),
('menu-crm-customer-pool-config-delete', 'menu-crm-customer-pool-config', '删除客户公海配置', 'BUTTON', 'ACTIVE', 'crm:crm_customer_pool_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-crm-customer-pool-config-rm',        '1', 'menu-crm-customer-pool-config'),
('menu-crm-customer-pool-config-rm-query',  '1', 'menu-crm-customer-pool-config-query'),
('menu-crm-customer-pool-config-rm-create', '1', 'menu-crm-customer-pool-config-create'),
('menu-crm-customer-pool-config-rm-update', '1', 'menu-crm-customer-pool-config-update'),
('menu-crm-customer-pool-config-rm-delete', '1', 'menu-crm-customer-pool-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-crm-customer-pool-config-pm',        '1', 'menu-crm-customer-pool-config'),
('menu-crm-customer-pool-config-pm-query',  '1', 'menu-crm-customer-pool-config-query'),
('menu-crm-customer-pool-config-pm-create', '1', 'menu-crm-customer-pool-config-create'),
('menu-crm-customer-pool-config-pm-update', '1', 'menu-crm-customer-pool-config-update'),
('menu-crm-customer-pool-config-pm-delete', '1', 'menu-crm-customer-pool-config-delete')
ON CONFLICT DO NOTHING;
