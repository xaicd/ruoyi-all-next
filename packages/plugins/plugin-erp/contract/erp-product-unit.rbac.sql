-- ============================================================
-- Auto-generated RBAC & Menu Migration for ERP 产品单位 (ErpProductUnit)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-erp-product-unit',
  'erp-dir',
  'ERP 产品单位管理',
  '/admin/erp/erp-product-unit',
  'erp/erp-product-unit/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'erp:erp_product_unit:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-erp-product-unit-query',  'menu-erp-product-unit', '查询ERP 产品单位', 'BUTTON', 'ACTIVE', 'erp:erp_product_unit:query',  1, NOW(), NOW()),
('menu-erp-product-unit-create', 'menu-erp-product-unit', '新增ERP 产品单位', 'BUTTON', 'ACTIVE', 'erp:erp_product_unit:create', 2, NOW(), NOW()),
('menu-erp-product-unit-update', 'menu-erp-product-unit', '修改ERP 产品单位', 'BUTTON', 'ACTIVE', 'erp:erp_product_unit:update', 3, NOW(), NOW()),
('menu-erp-product-unit-delete', 'menu-erp-product-unit', '删除ERP 产品单位', 'BUTTON', 'ACTIVE', 'erp:erp_product_unit:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-erp-product-unit-rm',        '1', 'menu-erp-product-unit'),
('menu-erp-product-unit-rm-query',  '1', 'menu-erp-product-unit-query'),
('menu-erp-product-unit-rm-create', '1', 'menu-erp-product-unit-create'),
('menu-erp-product-unit-rm-update', '1', 'menu-erp-product-unit-update'),
('menu-erp-product-unit-rm-delete', '1', 'menu-erp-product-unit-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-erp-product-unit-pm',        '1', 'menu-erp-product-unit'),
('menu-erp-product-unit-pm-query',  '1', 'menu-erp-product-unit-query'),
('menu-erp-product-unit-pm-create', '1', 'menu-erp-product-unit-create'),
('menu-erp-product-unit-pm-update', '1', 'menu-erp-product-unit-update'),
('menu-erp-product-unit-pm-delete', '1', 'menu-erp-product-unit-delete')
ON CONFLICT DO NOTHING;
