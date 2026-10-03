-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesMdProductBom（源框架导入） (MesMdProductBom)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-product-bom',
  'mes-dir',
  'MesMdProductBom（源框架导入）管理',
  '/admin/mes/mes-md-product-bom',
  'mes/mes-md-product-bom/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_product_bom:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-product-bom-query',  'menu-mes-md-product-bom', '查询MesMdProductBom（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_bom:query',  1, NOW(), NOW()),
('menu-mes-md-product-bom-create', 'menu-mes-md-product-bom', '新增MesMdProductBom（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_bom:create', 2, NOW(), NOW()),
('menu-mes-md-product-bom-update', 'menu-mes-md-product-bom', '修改MesMdProductBom（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_bom:update', 3, NOW(), NOW()),
('menu-mes-md-product-bom-delete', 'menu-mes-md-product-bom', '删除MesMdProductBom（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_bom:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-product-bom'),
('1', 'menu-mes-md-product-bom-query'),
('1', 'menu-mes-md-product-bom-create'),
('1', 'menu-mes-md-product-bom-update'),
('1', 'menu-mes-md-product-bom-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-product-bom'),
('1', 'menu-mes-md-product-bom-query'),
('1', 'menu-mes-md-product-bom-create'),
('1', 'menu-mes-md-product-bom-update'),
('1', 'menu-mes-md-product-bom-delete')
ON CONFLICT DO NOTHING;
