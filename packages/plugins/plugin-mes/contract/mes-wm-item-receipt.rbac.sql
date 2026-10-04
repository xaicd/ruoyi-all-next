-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 采购入库单 (MesWmItemReceipt)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-item-receipt',
  'mes-dir',
  'MES 采购入库单管理',
  '/admin/mes/mes-wm-item-receipt',
  'mes/mes-wm-item-receipt/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_item_receipt:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-item-receipt-query',  'menu-mes-wm-item-receipt', '查询MES 采购入库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt:query',  1, NOW(), NOW()),
('menu-mes-wm-item-receipt-create', 'menu-mes-wm-item-receipt', '新增MES 采购入库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt:create', 2, NOW(), NOW()),
('menu-mes-wm-item-receipt-update', 'menu-mes-wm-item-receipt', '修改MES 采购入库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt:update', 3, NOW(), NOW()),
('menu-mes-wm-item-receipt-delete', 'menu-mes-wm-item-receipt', '删除MES 采购入库单', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-item-receipt-rm',        '1', 'menu-mes-wm-item-receipt'),
('menu-mes-wm-item-receipt-rm-query',  '1', 'menu-mes-wm-item-receipt-query'),
('menu-mes-wm-item-receipt-rm-create', '1', 'menu-mes-wm-item-receipt-create'),
('menu-mes-wm-item-receipt-rm-update', '1', 'menu-mes-wm-item-receipt-update'),
('menu-mes-wm-item-receipt-rm-delete', '1', 'menu-mes-wm-item-receipt-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-item-receipt-pm',        '1', 'menu-mes-wm-item-receipt'),
('menu-mes-wm-item-receipt-pm-query',  '1', 'menu-mes-wm-item-receipt-query'),
('menu-mes-wm-item-receipt-pm-create', '1', 'menu-mes-wm-item-receipt-create'),
('menu-mes-wm-item-receipt-pm-update', '1', 'menu-mes-wm-item-receipt-update'),
('menu-mes-wm-item-receipt-pm-delete', '1', 'menu-mes-wm-item-receipt-delete')
ON CONFLICT DO NOTHING;
