-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 产品收货（入库）单 (MesWmProductReceipt)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-product-receipt',
  'mes-dir',
  'MES 产品收货（入库）单管理',
  '/admin/mes/mes-wm-product-receipt',
  'mes/mes-wm-product-receipt/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_product_receipt:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-product-receipt-query',  'menu-mes-wm-product-receipt', '查询MES 产品收货（入库）单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_receipt:query',  1, NOW(), NOW()),
('menu-mes-wm-product-receipt-create', 'menu-mes-wm-product-receipt', '新增MES 产品收货（入库）单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_receipt:create', 2, NOW(), NOW()),
('menu-mes-wm-product-receipt-update', 'menu-mes-wm-product-receipt', '修改MES 产品收货（入库）单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_receipt:update', 3, NOW(), NOW()),
('menu-mes-wm-product-receipt-delete', 'menu-mes-wm-product-receipt', '删除MES 产品收货（入库）单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_receipt:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-product-receipt-rm',        '1', 'menu-mes-wm-product-receipt'),
('menu-mes-wm-product-receipt-rm-query',  '1', 'menu-mes-wm-product-receipt-query'),
('menu-mes-wm-product-receipt-rm-create', '1', 'menu-mes-wm-product-receipt-create'),
('menu-mes-wm-product-receipt-rm-update', '1', 'menu-mes-wm-product-receipt-update'),
('menu-mes-wm-product-receipt-rm-delete', '1', 'menu-mes-wm-product-receipt-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-product-receipt-pm',        '1', 'menu-mes-wm-product-receipt'),
('menu-mes-wm-product-receipt-pm-query',  '1', 'menu-mes-wm-product-receipt-query'),
('menu-mes-wm-product-receipt-pm-create', '1', 'menu-mes-wm-product-receipt-create'),
('menu-mes-wm-product-receipt-pm-update', '1', 'menu-mes-wm-product-receipt-update'),
('menu-mes-wm-product-receipt-pm-delete', '1', 'menu-mes-wm-product-receipt-delete')
ON CONFLICT DO NOTHING;
