-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmProductReceiptDetail（源框架导入） (MesWmProductReceiptDetail)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-product-receipt-detail',
  'mes-dir',
  'MesWmProductReceiptDetail（源框架导入）管理',
  '/admin/mes/mes-wm-product-receipt-detail',
  'mes/mes-wm-product-receipt-detail/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_product_receipt_detail:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-product-receipt-detail-query',  'menu-mes-wm-product-receipt-detail', '查询MesWmProductReceiptDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_receipt_detail:query',  1, NOW(), NOW()),
('menu-mes-wm-product-receipt-detail-create', 'menu-mes-wm-product-receipt-detail', '新增MesWmProductReceiptDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_receipt_detail:create', 2, NOW(), NOW()),
('menu-mes-wm-product-receipt-detail-update', 'menu-mes-wm-product-receipt-detail', '修改MesWmProductReceiptDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_receipt_detail:update', 3, NOW(), NOW()),
('menu-mes-wm-product-receipt-detail-delete', 'menu-mes-wm-product-receipt-detail', '删除MesWmProductReceiptDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_product_receipt_detail:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-product-receipt-detail'),
('1', 'menu-mes-wm-product-receipt-detail-query'),
('1', 'menu-mes-wm-product-receipt-detail-create'),
('1', 'menu-mes-wm-product-receipt-detail-update'),
('1', 'menu-mes-wm-product-receipt-detail-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-product-receipt-detail'),
('1', 'menu-mes-wm-product-receipt-detail-query'),
('1', 'menu-mes-wm-product-receipt-detail-create'),
('1', 'menu-mes-wm-product-receipt-detail-update'),
('1', 'menu-mes-wm-product-receipt-detail-delete')
ON CONFLICT DO NOTHING;
