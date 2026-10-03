-- ============================================================
-- Auto-generated RBAC & Menu Migration for ErpProductUnit（源框架导入） (ErpProductUnit)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-erp-product-unit',
  'erp-dir',
  'ErpProductUnit（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-erp-product-unit-query',  'menu-erp-product-unit', '查询ErpProductUnit（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_product_unit:query',  1, NOW(), NOW()),
('menu-erp-product-unit-create', 'menu-erp-product-unit', '新增ErpProductUnit（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_product_unit:create', 2, NOW(), NOW()),
('menu-erp-product-unit-update', 'menu-erp-product-unit', '修改ErpProductUnit（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_product_unit:update', 3, NOW(), NOW()),
('menu-erp-product-unit-delete', 'menu-erp-product-unit', '删除ErpProductUnit（源框架导入）', 'BUTTON', 'ACTIVE', 'erp:erp_product_unit:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-erp-product-unit'),
('1', 'menu-erp-product-unit-query'),
('1', 'menu-erp-product-unit-create'),
('1', 'menu-erp-product-unit-update'),
('1', 'menu-erp-product-unit-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-erp-product-unit'),
('1', 'menu-erp-product-unit-query'),
('1', 'menu-erp-product-unit-create'),
('1', 'menu-erp-product-unit-update'),
('1', 'menu-erp-product-unit-delete')
ON CONFLICT DO NOTHING;
