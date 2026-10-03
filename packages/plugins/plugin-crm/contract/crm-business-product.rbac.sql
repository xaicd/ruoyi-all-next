-- ============================================================
-- Auto-generated RBAC & Menu Migration for CrmBusinessProduct（源框架导入） (CrmBusinessProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-crm-business-product',
  'crm-dir',
  'CrmBusinessProduct（源框架导入）管理',
  '/admin/crm/crm-business-product',
  'crm/crm-business-product/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'crm:crm_business_product:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-crm-business-product-query',  'menu-crm-business-product', '查询CrmBusinessProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business_product:query',  1, NOW(), NOW()),
('menu-crm-business-product-create', 'menu-crm-business-product', '新增CrmBusinessProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business_product:create', 2, NOW(), NOW()),
('menu-crm-business-product-update', 'menu-crm-business-product', '修改CrmBusinessProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business_product:update', 3, NOW(), NOW()),
('menu-crm-business-product-delete', 'menu-crm-business-product', '删除CrmBusinessProduct（源框架导入）', 'BUTTON', 'ACTIVE', 'crm:crm_business_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-crm-business-product'),
('1', 'menu-crm-business-product-query'),
('1', 'menu-crm-business-product-create'),
('1', 'menu-crm-business-product-update'),
('1', 'menu-crm-business-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-crm-business-product'),
('1', 'menu-crm-business-product-query'),
('1', 'menu-crm-business-product-create'),
('1', 'menu-crm-business-product-update'),
('1', 'menu-crm-business-product-delete')
ON CONFLICT DO NOTHING;
