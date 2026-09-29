-- ============================================================
-- Auto-generated RBAC & Menu Migration for 出库单 (WmsShipmentOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-shipment-order',
  'wms-dir',
  '出库单管理',
  '/admin/wms/wms-shipment-order',
  'wms/wms-shipment-order/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'wms:shipment:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-wms-shipment-order-query',  'menu-wms-shipment-order', '查询出库单', 'BUTTON', 'ACTIVE', 'wms:shipment:query',  1, NOW(), NOW()),
('menu-wms-shipment-order-create', 'menu-wms-shipment-order', '新增出库单', 'BUTTON', 'ACTIVE', 'wms:shipment:create', 2, NOW(), NOW()),
('menu-wms-shipment-order-update', 'menu-wms-shipment-order', '修改出库单', 'BUTTON', 'ACTIVE', 'wms:shipment:update', 3, NOW(), NOW()),
('menu-wms-shipment-order-delete', 'menu-wms-shipment-order', '删除出库单', 'BUTTON', 'ACTIVE', 'wms:shipment:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-shipment-order'),
('1', 'menu-wms-shipment-order-query'),
('1', 'menu-wms-shipment-order-create'),
('1', 'menu-wms-shipment-order-update'),
('1', 'menu-wms-shipment-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-shipment-order'),
('1', 'menu-wms-shipment-order-query'),
('1', 'menu-wms-shipment-order-create'),
('1', 'menu-wms-shipment-order-update'),
('1', 'menu-wms-shipment-order-delete')
ON CONFLICT DO NOTHING;
