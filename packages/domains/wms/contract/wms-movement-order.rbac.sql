-- ============================================================
-- Auto-generated RBAC & Menu Migration for 移库单 (WmsMovementOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-movement-order',
  'wms-dir',
  '移库单管理',
  '/admin/wms/wms-movement-order',
  'wms/wms-movement-order/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'wms:movement:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-wms-movement-order-query',  'menu-wms-movement-order', '查询移库单', 'BUTTON', 'ACTIVE', 'wms:movement:query',  1, NOW(), NOW()),
('menu-wms-movement-order-create', 'menu-wms-movement-order', '新增移库单', 'BUTTON', 'ACTIVE', 'wms:movement:create', 2, NOW(), NOW()),
('menu-wms-movement-order-update', 'menu-wms-movement-order', '修改移库单', 'BUTTON', 'ACTIVE', 'wms:movement:update', 3, NOW(), NOW()),
('menu-wms-movement-order-delete', 'menu-wms-movement-order', '删除移库单', 'BUTTON', 'ACTIVE', 'wms:movement:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-movement-order'),
('1', 'menu-wms-movement-order-query'),
('1', 'menu-wms-movement-order-create'),
('1', 'menu-wms-movement-order-update'),
('1', 'menu-wms-movement-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-movement-order'),
('1', 'menu-wms-movement-order-query'),
('1', 'menu-wms-movement-order-create'),
('1', 'menu-wms-movement-order-update'),
('1', 'menu-wms-movement-order-delete')
ON CONFLICT DO NOTHING;
