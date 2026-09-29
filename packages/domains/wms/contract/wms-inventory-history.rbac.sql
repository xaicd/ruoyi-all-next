-- ============================================================
-- Auto-generated RBAC & Menu Migration for 库存流水 (WmsInventoryHistory)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-inventory-history',
  'wms-dir',
  '库存流水管理',
  '/admin/wms/wms-inventory-history',
  'wms/wms-inventory-history/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'wms:inventory-history:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-wms-inventory-history-query',  'menu-wms-inventory-history', '查询库存流水', 'BUTTON', 'ACTIVE', 'wms:inventory-history:query',  1, NOW(), NOW()),
('menu-wms-inventory-history-create', 'menu-wms-inventory-history', '新增库存流水', 'BUTTON', 'ACTIVE', 'wms:inventory-history:create', 2, NOW(), NOW()),
('menu-wms-inventory-history-update', 'menu-wms-inventory-history', '修改库存流水', 'BUTTON', 'ACTIVE', 'wms:inventory-history:update', 3, NOW(), NOW()),
('menu-wms-inventory-history-delete', 'menu-wms-inventory-history', '删除库存流水', 'BUTTON', 'ACTIVE', 'wms:inventory-history:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-inventory-history'),
('1', 'menu-wms-inventory-history-query'),
('1', 'menu-wms-inventory-history-create'),
('1', 'menu-wms-inventory-history-update'),
('1', 'menu-wms-inventory-history-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-inventory-history'),
('1', 'menu-wms-inventory-history-query'),
('1', 'menu-wms-inventory-history-create'),
('1', 'menu-wms-inventory-history-update'),
('1', 'menu-wms-inventory-history-delete')
ON CONFLICT DO NOTHING;
