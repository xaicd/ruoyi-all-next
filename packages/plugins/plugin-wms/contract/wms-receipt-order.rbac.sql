-- ============================================================
-- Auto-generated RBAC & Menu Migration for 入库单 (WmsReceiptOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-receipt-order',
  'wms-dir',
  '入库单管理',
  '/admin/wms/wms-receipt-order',
  'wms/wms-receipt-order/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'wms:receipt:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-wms-receipt-order-query',  'menu-wms-receipt-order', '查询入库单', 'BUTTON', 'ACTIVE', 'wms:receipt:query',  1, NOW(), NOW()),
('menu-wms-receipt-order-create', 'menu-wms-receipt-order', '新增入库单', 'BUTTON', 'ACTIVE', 'wms:receipt:create', 2, NOW(), NOW()),
('menu-wms-receipt-order-update', 'menu-wms-receipt-order', '修改入库单', 'BUTTON', 'ACTIVE', 'wms:receipt:update', 3, NOW(), NOW()),
('menu-wms-receipt-order-delete', 'menu-wms-receipt-order', '删除入库单', 'BUTTON', 'ACTIVE', 'wms:receipt:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-receipt-order'),
('1', 'menu-wms-receipt-order-query'),
('1', 'menu-wms-receipt-order-create'),
('1', 'menu-wms-receipt-order-update'),
('1', 'menu-wms-receipt-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-receipt-order'),
('1', 'menu-wms-receipt-order-query'),
('1', 'menu-wms-receipt-order-create'),
('1', 'menu-wms-receipt-order-update'),
('1', 'menu-wms-receipt-order-delete')
ON CONFLICT DO NOTHING;
