-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 生产入库单 (MesWmProductProduce)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-product-produce',
  'mes-dir',
  'MES 生产入库单管理',
  '/admin/mes/mes-wm-product-produce',
  'mes/mes-wm-product-produce/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_product_produce:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-product-produce-query',  'menu-mes-wm-product-produce', '查询MES 生产入库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_produce:query',  1, NOW(), NOW()),
('menu-mes-wm-product-produce-create', 'menu-mes-wm-product-produce', '新增MES 生产入库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_produce:create', 2, NOW(), NOW()),
('menu-mes-wm-product-produce-update', 'menu-mes-wm-product-produce', '修改MES 生产入库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_produce:update', 3, NOW(), NOW()),
('menu-mes-wm-product-produce-delete', 'menu-mes-wm-product-produce', '删除MES 生产入库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_produce:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-product-produce-rm',        '1', 'menu-mes-wm-product-produce'),
('menu-mes-wm-product-produce-rm-query',  '1', 'menu-mes-wm-product-produce-query'),
('menu-mes-wm-product-produce-rm-create', '1', 'menu-mes-wm-product-produce-create'),
('menu-mes-wm-product-produce-rm-update', '1', 'menu-mes-wm-product-produce-update'),
('menu-mes-wm-product-produce-rm-delete', '1', 'menu-mes-wm-product-produce-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-product-produce-pm',        '1', 'menu-mes-wm-product-produce'),
('menu-mes-wm-product-produce-pm-query',  '1', 'menu-mes-wm-product-produce-query'),
('menu-mes-wm-product-produce-pm-create', '1', 'menu-mes-wm-product-produce-create'),
('menu-mes-wm-product-produce-pm-update', '1', 'menu-mes-wm-product-produce-update'),
('menu-mes-wm-product-produce-pm-delete', '1', 'menu-mes-wm-product-produce-delete')
ON CONFLICT DO NOTHING;
