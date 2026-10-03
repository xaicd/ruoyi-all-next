-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesMdProductSop（源框架导入） (MesMdProductSop)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-product-sop',
  'mes-dir',
  'MesMdProductSop（源框架导入）管理',
  '/admin/mes/mes-md-product-sop',
  'mes/mes-md-product-sop/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_product_sop:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-product-sop-query',  'menu-mes-md-product-sop', '查询MesMdProductSop（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_sop:query',  1, NOW(), NOW()),
('menu-mes-md-product-sop-create', 'menu-mes-md-product-sop', '新增MesMdProductSop（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_sop:create', 2, NOW(), NOW()),
('menu-mes-md-product-sop-update', 'menu-mes-md-product-sop', '修改MesMdProductSop（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_sop:update', 3, NOW(), NOW()),
('menu-mes-md-product-sop-delete', 'menu-mes-md-product-sop', '删除MesMdProductSop（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_sop:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-product-sop'),
('1', 'menu-mes-md-product-sop-query'),
('1', 'menu-mes-md-product-sop-create'),
('1', 'menu-mes-md-product-sop-update'),
('1', 'menu-mes-md-product-sop-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-product-sop'),
('1', 'menu-mes-md-product-sop-query'),
('1', 'menu-mes-md-product-sop-create'),
('1', 'menu-mes-md-product-sop-update'),
('1', 'menu-mes-md-product-sop-delete')
ON CONFLICT DO NOTHING;
