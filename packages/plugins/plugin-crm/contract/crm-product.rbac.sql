-- ============================================================
-- Auto-generated RBAC & Menu Migration for CRM 产品 (CrmProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-product',
  'crm-dir',
  'CRM 产品管理',
  '/admin/crm/crm-product',
  'crm/crm-product/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_product:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-product-query',  'menu-crm-product', '查询CRM 产品', 'BUTTON', 'ACTIVE', 'crm:crm_product:query',  1, NOW(), NOW()),
('menu-crm-product-create', 'menu-crm-product', '新增CRM 产品', 'BUTTON', 'ACTIVE', 'crm:crm_product:create', 2, NOW(), NOW()),
('menu-crm-product-update', 'menu-crm-product', '修改CRM 产品', 'BUTTON', 'ACTIVE', 'crm:crm_product:update', 3, NOW(), NOW()),
('menu-crm-product-delete', 'menu-crm-product', '删除CRM 产品', 'BUTTON', 'ACTIVE', 'crm:crm_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-product'),
('1', 'menu-crm-product-query'),
('1', 'menu-crm-product-create'),
('1', 'menu-crm-product-update'),
('1', 'menu-crm-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-product'),
('1', 'menu-crm-product-query'),
('1', 'menu-crm-product-create'),
('1', 'menu-crm-product-update'),
('1', 'menu-crm-product-delete')
ON CONFLICT DO NOTHING;
