-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmItemReceiptLine（源框架导入） (MesWmItemReceiptLine)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-item-receipt-line',
  'mes-dir',
  'MesWmItemReceiptLine（源框架导入）管理',
  '/admin/mes/mes-wm-item-receipt-line',
  'mes/mes-wm-item-receipt-line/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_item_receipt_line:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-item-receipt-line-query',  'menu-mes-wm-item-receipt-line', '查询MesWmItemReceiptLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt_line:query',  1, NOW(), NOW()),
('menu-mes-wm-item-receipt-line-create', 'menu-mes-wm-item-receipt-line', '新增MesWmItemReceiptLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt_line:create', 2, NOW(), NOW()),
('menu-mes-wm-item-receipt-line-update', 'menu-mes-wm-item-receipt-line', '修改MesWmItemReceiptLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt_line:update', 3, NOW(), NOW()),
('menu-mes-wm-item-receipt-line-delete', 'menu-mes-wm-item-receipt-line', '删除MesWmItemReceiptLine（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt_line:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-item-receipt-line'),
('1', 'menu-mes-wm-item-receipt-line-query'),
('1', 'menu-mes-wm-item-receipt-line-create'),
('1', 'menu-mes-wm-item-receipt-line-update'),
('1', 'menu-mes-wm-item-receipt-line-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-item-receipt-line'),
('1', 'menu-mes-wm-item-receipt-line-query'),
('1', 'menu-mes-wm-item-receipt-line-create'),
('1', 'menu-mes-wm-item-receipt-line-update'),
('1', 'menu-mes-wm-item-receipt-line-delete')
ON CONFLICT DO NOTHING;
