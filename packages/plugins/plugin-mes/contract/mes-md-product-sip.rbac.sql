-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesMdProductSip（源框架导入） (MesMdProductSip)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-md-product-sip',
  'mes-dir',
  'MesMdProductSip（源框架导入）管理',
  '/admin/mes/mes-md-product-sip',
  'mes/mes-md-product-sip/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_md_product_sip:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-md-product-sip-query',  'menu-mes-md-product-sip', '查询MesMdProductSip（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_sip:query',  1, NOW(), NOW()),
('menu-mes-md-product-sip-create', 'menu-mes-md-product-sip', '新增MesMdProductSip（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_sip:create', 2, NOW(), NOW()),
('menu-mes-md-product-sip-update', 'menu-mes-md-product-sip', '修改MesMdProductSip（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_sip:update', 3, NOW(), NOW()),
('menu-mes-md-product-sip-delete', 'menu-mes-md-product-sip', '删除MesMdProductSip（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_md_product_sip:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-md-product-sip'),
('1', 'menu-mes-md-product-sip-query'),
('1', 'menu-mes-md-product-sip-create'),
('1', 'menu-mes-md-product-sip-update'),
('1', 'menu-mes-md-product-sip-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-md-product-sip'),
('1', 'menu-mes-md-product-sip-query'),
('1', 'menu-mes-md-product-sip-create'),
('1', 'menu-mes-md-product-sip-update'),
('1', 'menu-mes-md-product-sip-delete')
ON CONFLICT DO NOTHING;
