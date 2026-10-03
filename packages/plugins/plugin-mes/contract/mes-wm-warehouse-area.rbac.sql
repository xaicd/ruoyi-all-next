-- ============================================================
-- Auto-generated RBAC & Menu Migration for MesWmWarehouseArea（源框架导入） (MesWmWarehouseArea)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-wm-warehouse-area',
  'mes-dir',
  'MesWmWarehouseArea（源框架导入）管理',
  '/admin/mes/mes-wm-warehouse-area',
  'mes/mes-wm-warehouse-area/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_warehouse_area:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-wm-warehouse-area-query',  'menu-mes-wm-warehouse-area', '查询MesWmWarehouseArea（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse_area:query',  1, NOW(), NOW()),
('menu-mes-wm-warehouse-area-create', 'menu-mes-wm-warehouse-area', '新增MesWmWarehouseArea（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse_area:create', 2, NOW(), NOW()),
('menu-mes-wm-warehouse-area-update', 'menu-mes-wm-warehouse-area', '修改MesWmWarehouseArea（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse_area:update', 3, NOW(), NOW()),
('menu-mes-wm-warehouse-area-delete', 'menu-mes-wm-warehouse-area', '删除MesWmWarehouseArea（源框架导入）', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse_area:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-wm-warehouse-area'),
('1', 'menu-mes-wm-warehouse-area-query'),
('1', 'menu-mes-wm-warehouse-area-create'),
('1', 'menu-mes-wm-warehouse-area-update'),
('1', 'menu-mes-wm-warehouse-area-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-wm-warehouse-area'),
('1', 'menu-mes-wm-warehouse-area-query'),
('1', 'menu-mes-wm-warehouse-area-create'),
('1', 'menu-mes-wm-warehouse-area-update'),
('1', 'menu-mes-wm-warehouse-area-delete')
ON CONFLICT DO NOTHING;
