-- ============================================================
-- Auto-generated RBAC & Menu Migration for 出库明细 (WmsShipmentOrderDetail)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-shipment-order-detail',
  'wms-dir',
  '出库明细管理',
  '/admin/wms/wms-shipment-order-detail',
  'wms/wms-shipment-order-detail/index',
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
('menu-wms-shipment-order-detail-query',  'menu-wms-shipment-order-detail', '查询出库明细', 'BUTTON', 'ACTIVE', 'wms:shipment:query',  1, NOW(), NOW()),
('menu-wms-shipment-order-detail-create', 'menu-wms-shipment-order-detail', '新增出库明细', 'BUTTON', 'ACTIVE', 'wms:shipment:create', 2, NOW(), NOW()),
('menu-wms-shipment-order-detail-update', 'menu-wms-shipment-order-detail', '修改出库明细', 'BUTTON', 'ACTIVE', 'wms:shipment:update', 3, NOW(), NOW()),
('menu-wms-shipment-order-detail-delete', 'menu-wms-shipment-order-detail', '删除出库明细', 'BUTTON', 'ACTIVE', 'wms:shipment:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-shipment-order-detail'),
('1', 'menu-wms-shipment-order-detail-query'),
('1', 'menu-wms-shipment-order-detail-create'),
('1', 'menu-wms-shipment-order-detail-update'),
('1', 'menu-wms-shipment-order-detail-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-shipment-order-detail'),
('1', 'menu-wms-shipment-order-detail-query'),
('1', 'menu-wms-shipment-order-detail-create'),
('1', 'menu-wms-shipment-order-detail-update'),
('1', 'menu-wms-shipment-order-detail-delete')
ON CONFLICT DO NOTHING;
