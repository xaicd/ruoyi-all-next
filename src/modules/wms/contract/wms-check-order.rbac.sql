-- ============================================================
-- Auto-generated RBAC & Menu Migration for 盘点单 (WmsCheckOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-check-order',
  'wms-dir',
  '盘点单管理',
  '/admin/wms/wms-check-order',
  'wms/wms-check-order/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'wms:check:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-wms-check-order-query',  'menu-wms-check-order', '查询盘点单', 'BUTTON', 'ACTIVE', 'wms:check:query',  1, NOW(), NOW()),
('menu-wms-check-order-create', 'menu-wms-check-order', '新增盘点单', 'BUTTON', 'ACTIVE', 'wms:check:create', 2, NOW(), NOW()),
('menu-wms-check-order-update', 'menu-wms-check-order', '修改盘点单', 'BUTTON', 'ACTIVE', 'wms:check:update', 3, NOW(), NOW()),
('menu-wms-check-order-delete', 'menu-wms-check-order', '删除盘点单', 'BUTTON', 'ACTIVE', 'wms:check:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-check-order'),
('1', 'menu-wms-check-order-query'),
('1', 'menu-wms-check-order-create'),
('1', 'menu-wms-check-order-update'),
('1', 'menu-wms-check-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-check-order'),
('1', 'menu-wms-check-order-query'),
('1', 'menu-wms-check-order-create'),
('1', 'menu-wms-check-order-update'),
('1', 'menu-wms-check-order-delete')
ON CONFLICT DO NOTHING;
