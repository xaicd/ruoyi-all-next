-- ============================================================
-- Auto-generated RBAC & Menu Migration for 实时库存 (WmsInventory)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-inventory',
  'wms-dir',
  '实时库存管理',
  '/admin/wms/wms-inventory',
  'wms/wms-inventory/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'wms:inventory:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-wms-inventory-query',  'menu-wms-inventory', '查询实时库存', 'BUTTON', 'ACTIVE', 'wms:inventory:query',  1, NOW(), NOW()),
('menu-wms-inventory-create', 'menu-wms-inventory', '新增实时库存', 'BUTTON', 'ACTIVE', 'wms:inventory:create', 2, NOW(), NOW()),
('menu-wms-inventory-update', 'menu-wms-inventory', '修改实时库存', 'BUTTON', 'ACTIVE', 'wms:inventory:update', 3, NOW(), NOW()),
('menu-wms-inventory-delete', 'menu-wms-inventory', '删除实时库存', 'BUTTON', 'ACTIVE', 'wms:inventory:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-inventory'),
('1', 'menu-wms-inventory-query'),
('1', 'menu-wms-inventory-create'),
('1', 'menu-wms-inventory-update'),
('1', 'menu-wms-inventory-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-inventory'),
('1', 'menu-wms-inventory-query'),
('1', 'menu-wms-inventory-create'),
('1', 'menu-wms-inventory-update'),
('1', 'menu-wms-inventory-delete')
ON CONFLICT DO NOTHING;
