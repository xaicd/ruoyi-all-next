-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmMiscReceiptDetail（源框架导入） (MesWmMiscReceiptDetail)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-misc-receipt-detail',
  'mes-dir',
  'MesWmMiscReceiptDetail（源框架导入）管理',
  '/admin/mes/mes-wm-misc-receipt-detail',
  'mes/mes-wm-misc-receipt-detail/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_misc_receipt_detail:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-misc-receipt-detail-query',  'menu-mes-wm-misc-receipt-detail', '查询MesWmMiscReceiptDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_receipt_detail:query',  1, NOW(), NOW()),
('menu-mes-wm-misc-receipt-detail-create', 'menu-mes-wm-misc-receipt-detail', '新增MesWmMiscReceiptDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_receipt_detail:create', 2, NOW(), NOW()),
('menu-mes-wm-misc-receipt-detail-update', 'menu-mes-wm-misc-receipt-detail', '修改MesWmMiscReceiptDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_receipt_detail:update', 3, NOW(), NOW()),
('menu-mes-wm-misc-receipt-detail-delete', 'menu-mes-wm-misc-receipt-detail', '删除MesWmMiscReceiptDetail（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_receipt_detail:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-misc-receipt-detail'),
('1', 'menu-mes-wm-misc-receipt-detail-query'),
('1', 'menu-mes-wm-misc-receipt-detail-create'),
('1', 'menu-mes-wm-misc-receipt-detail-update'),
('1', 'menu-mes-wm-misc-receipt-detail-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-misc-receipt-detail'),
('1', 'menu-mes-wm-misc-receipt-detail-query'),
('1', 'menu-mes-wm-misc-receipt-detail-create'),
('1', 'menu-mes-wm-misc-receipt-detail-update'),
('1', 'menu-mes-wm-misc-receipt-detail-delete')
ON CONFLICT DO NOTHING;
