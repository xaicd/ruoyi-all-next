-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 产品 (ErpProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-product',
  'erp-dir',
  'ERP 产品管理',
  '/admin/erp/erp-product',
  'erp/erp-product/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_product:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-product-query',  'menu-erp-product', '查询ERP 产品', 'BUTTON', 'ACTIVE', 'erp:erp_product:query',  1, NOW(), NOW()),
('menu-erp-product-create', 'menu-erp-product', '新增ERP 产品', 'BUTTON', 'ACTIVE', 'erp:erp_product:create', 2, NOW(), NOW()),
('menu-erp-product-update', 'menu-erp-product', '修改ERP 产品', 'BUTTON', 'ACTIVE', 'erp:erp_product:update', 3, NOW(), NOW()),
('menu-erp-product-delete', 'menu-erp-product', '删除ERP 产品', 'BUTTON', 'ACTIVE', 'erp:erp_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-product-rm',        '1', 'menu-erp-product'),
('menu-erp-product-rm-query',  '1', 'menu-erp-product-query'),
('menu-erp-product-rm-create', '1', 'menu-erp-product-create'),
('menu-erp-product-rm-update', '1', 'menu-erp-product-update'),
('menu-erp-product-rm-delete', '1', 'menu-erp-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-product-pm',        '1', 'menu-erp-product'),
('menu-erp-product-pm-query',  '1', 'menu-erp-product-query'),
('menu-erp-product-pm-create', '1', 'menu-erp-product-create'),
('menu-erp-product-pm-update', '1', 'menu-erp-product-update'),
('menu-erp-product-pm-delete', '1', 'menu-erp-product-delete')
ON CONFLICT DO NOTHING;
