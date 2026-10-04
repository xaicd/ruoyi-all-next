-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 采购入库明细 (MesWmItemReceiptDetail)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-item-receipt-detail',
  'mes-dir',
  'MES 采购入库明细管理',
  '/admin/mes/mes-wm-item-receipt-detail',
  'mes/mes-wm-item-receipt-detail/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_item_receipt_detail:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-item-receipt-detail-query',  'menu-mes-wm-item-receipt-detail', '查询MES 采购入库明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt_detail:query',  1, NOW(), NOW()),
('menu-mes-wm-item-receipt-detail-create', 'menu-mes-wm-item-receipt-detail', '新增MES 采购入库明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt_detail:create', 2, NOW(), NOW()),
('menu-mes-wm-item-receipt-detail-update', 'menu-mes-wm-item-receipt-detail', '修改MES 采购入库明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt_detail:update', 3, NOW(), NOW()),
('menu-mes-wm-item-receipt-detail-delete', 'menu-mes-wm-item-receipt-detail', '删除MES 采购入库明细', 'BUTTON', 'ACTIVE', 'mes:mes_wm_item_receipt_detail:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-item-receipt-detail-rm',        '1', 'menu-mes-wm-item-receipt-detail'),
('menu-mes-wm-item-receipt-detail-rm-query',  '1', 'menu-mes-wm-item-receipt-detail-query'),
('menu-mes-wm-item-receipt-detail-rm-create', '1', 'menu-mes-wm-item-receipt-detail-create'),
('menu-mes-wm-item-receipt-detail-rm-update', '1', 'menu-mes-wm-item-receipt-detail-update'),
('menu-mes-wm-item-receipt-detail-rm-delete', '1', 'menu-mes-wm-item-receipt-detail-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-item-receipt-detail-pm',        '1', 'menu-mes-wm-item-receipt-detail'),
('menu-mes-wm-item-receipt-detail-pm-query',  '1', 'menu-mes-wm-item-receipt-detail-query'),
('menu-mes-wm-item-receipt-detail-pm-create', '1', 'menu-mes-wm-item-receipt-detail-create'),
('menu-mes-wm-item-receipt-detail-pm-update', '1', 'menu-mes-wm-item-receipt-detail-update'),
('menu-mes-wm-item-receipt-detail-pm-delete', '1', 'menu-mes-wm-item-receipt-detail-delete')
ON CONFLICT DO NOTHING;
