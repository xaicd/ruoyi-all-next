-- ============================================================
-- Auto-generated RBAC & Menu Migration for 物料主数据 (WmsItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-item',
  'wms-dir',
  '物料主数据管理',
  '/admin/wms/wms-item',
  'wms/wms-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'wms:item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-wms-item-query',  'menu-wms-item', '查询物料主数据', 'BUTTON', 'ACTIVE', 'wms:item:query',  1, NOW(), NOW()),
('menu-wms-item-create', 'menu-wms-item', '新增物料主数据', 'BUTTON', 'ACTIVE', 'wms:item:create', 2, NOW(), NOW()),
('menu-wms-item-update', 'menu-wms-item', '修改物料主数据', 'BUTTON', 'ACTIVE', 'wms:item:update', 3, NOW(), NOW()),
('menu-wms-item-delete', 'menu-wms-item', '删除物料主数据', 'BUTTON', 'ACTIVE', 'wms:item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-item'),
('1', 'menu-wms-item-query'),
('1', 'menu-wms-item-create'),
('1', 'menu-wms-item-update'),
('1', 'menu-wms-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-item'),
('1', 'menu-wms-item-query'),
('1', 'menu-wms-item-create'),
('1', 'menu-wms-item-update'),
('1', 'menu-wms-item-delete')
ON CONFLICT DO NOTHING;
