-- ============================================================
-- Auto-generated RBAC & Menu Migration for CRM 客户 (CrmCustomer)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-crm-customer',
  'crm-dir',
  'CRM 客户管理',
  '/admin/crm/crm-customer',
  'crm/crm-customer/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_customer:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-crm-customer-query',  'menu-crm-customer', '查询CRM 客户', 'BUTTON', 'ACTIVE', 'crm:crm_customer:query',  1, NOW(), NOW()),
('menu-crm-customer-create', 'menu-crm-customer', '新增CRM 客户', 'BUTTON', 'ACTIVE', 'crm:crm_customer:create', 2, NOW(), NOW()),
('menu-crm-customer-update', 'menu-crm-customer', '修改CRM 客户', 'BUTTON', 'ACTIVE', 'crm:crm_customer:update', 3, NOW(), NOW()),
('menu-crm-customer-delete', 'menu-crm-customer', '删除CRM 客户', 'BUTTON', 'ACTIVE', 'crm:crm_customer:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-crm-customer-rm',        '1', 'menu-crm-customer'),
('menu-crm-customer-rm-query',  '1', 'menu-crm-customer-query'),
('menu-crm-customer-rm-create', '1', 'menu-crm-customer-create'),
('menu-crm-customer-rm-update', '1', 'menu-crm-customer-update'),
('menu-crm-customer-rm-delete', '1', 'menu-crm-customer-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-crm-customer-pm',        '1', 'menu-crm-customer'),
('menu-crm-customer-pm-query',  '1', 'menu-crm-customer-query'),
('menu-crm-customer-pm-create', '1', 'menu-crm-customer-create'),
('menu-crm-customer-pm-update', '1', 'menu-crm-customer-update'),
('menu-crm-customer-pm-delete', '1', 'menu-crm-customer-delete')
ON CONFLICT DO NOTHING;
