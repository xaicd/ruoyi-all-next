-- ============================================================
-- Auto-generated RBAC & Menu Migration for 智能仓库 (WmsWarehouse)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-wms-warehouse',
  'wms-dir',
  '智能仓库管理',
  '/admin/wms/wms-warehouse',
  'wms/wms-warehouse/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'wms:warehouse:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-wms-warehouse-query',  'menu-wms-warehouse', '查询智能仓库', 'BUTTON', 'ACTIVE', 'wms:warehouse:query',  1, NOW(), NOW()),
('menu-wms-warehouse-create', 'menu-wms-warehouse', '新增智能仓库', 'BUTTON', 'ACTIVE', 'wms:warehouse:create', 2, NOW(), NOW()),
('menu-wms-warehouse-update', 'menu-wms-warehouse', '修改智能仓库', 'BUTTON', 'ACTIVE', 'wms:warehouse:update', 3, NOW(), NOW()),
('menu-wms-warehouse-delete', 'menu-wms-warehouse', '删除智能仓库', 'BUTTON', 'ACTIVE', 'wms:warehouse:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-wms-warehouse'),
('1', 'menu-wms-warehouse-query'),
('1', 'menu-wms-warehouse-create'),
('1', 'menu-wms-warehouse-update'),
('1', 'menu-wms-warehouse-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-wms-warehouse'),
('1', 'menu-wms-warehouse-query'),
('1', 'menu-wms-warehouse-create'),
('1', 'menu-wms-warehouse-update'),
('1', 'menu-wms-warehouse-delete')
ON CONFLICT DO NOTHING;
