-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmMiscReceipt（源框架导入） (MesWmMiscReceipt)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-misc-receipt',
  'mes-dir',
  'MesWmMiscReceipt（源框架导入）管理',
  '/admin/mes/mes-wm-misc-receipt',
  'mes/mes-wm-misc-receipt/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_misc_receipt:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-misc-receipt-query',  'menu-mes-wm-misc-receipt', '查询MesWmMiscReceipt（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_receipt:query',  1, NOW(), NOW()),
('menu-mes-wm-misc-receipt-create', 'menu-mes-wm-misc-receipt', '新增MesWmMiscReceipt（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_receipt:create', 2, NOW(), NOW()),
('menu-mes-wm-misc-receipt-update', 'menu-mes-wm-misc-receipt', '修改MesWmMiscReceipt（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_receipt:update', 3, NOW(), NOW()),
('menu-mes-wm-misc-receipt-delete', 'menu-mes-wm-misc-receipt', '删除MesWmMiscReceipt（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_misc_receipt:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-misc-receipt'),
('1', 'menu-mes-wm-misc-receipt-query'),
('1', 'menu-mes-wm-misc-receipt-create'),
('1', 'menu-mes-wm-misc-receipt-update'),
('1', 'menu-mes-wm-misc-receipt-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-misc-receipt'),
('1', 'menu-mes-wm-misc-receipt-query'),
('1', 'menu-mes-wm-misc-receipt-create'),
('1', 'menu-mes-wm-misc-receipt-update'),
('1', 'menu-mes-wm-misc-receipt-delete')
ON CONFLICT DO NOTHING;
