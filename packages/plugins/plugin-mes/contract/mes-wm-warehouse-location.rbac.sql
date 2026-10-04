-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 库区 (MesWmWarehouseLocation)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-mes-wm-warehouse-location',
  'mes-dir',
  'MES 库区管理',
  '/admin/mes/mes-wm-warehouse-location',
  'mes/mes-wm-warehouse-location/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_wm_warehouse_location:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-mes-wm-warehouse-location-query',  'menu-mes-wm-warehouse-location', '查询MES 库区', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse_location:query',  1, NOW(), NOW()),
('menu-mes-wm-warehouse-location-create', 'menu-mes-wm-warehouse-location', '新增MES 库区', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse_location:create', 2, NOW(), NOW()),
('menu-mes-wm-warehouse-location-update', 'menu-mes-wm-warehouse-location', '修改MES 库区', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse_location:update', 3, NOW(), NOW()),
('menu-mes-wm-warehouse-location-delete', 'menu-mes-wm-warehouse-location', '删除MES 库区', 'BUTTON', 'ACTIVE', 'mes:mes_wm_warehouse_location:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-mes-wm-warehouse-location-rm',        '1', 'menu-mes-wm-warehouse-location'),
('menu-mes-wm-warehouse-location-rm-query',  '1', 'menu-mes-wm-warehouse-location-query'),
('menu-mes-wm-warehouse-location-rm-create', '1', 'menu-mes-wm-warehouse-location-create'),
('menu-mes-wm-warehouse-location-rm-update', '1', 'menu-mes-wm-warehouse-location-update'),
('menu-mes-wm-warehouse-location-rm-delete', '1', 'menu-mes-wm-warehouse-location-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-mes-wm-warehouse-location-pm',        '1', 'menu-mes-wm-warehouse-location'),
('menu-mes-wm-warehouse-location-pm-query',  '1', 'menu-mes-wm-warehouse-location-query'),
('menu-mes-wm-warehouse-location-pm-create', '1', 'menu-mes-wm-warehouse-location-create'),
('menu-mes-wm-warehouse-location-pm-update', '1', 'menu-mes-wm-warehouse-location-update'),
('menu-mes-wm-warehouse-location-pm-delete', '1', 'menu-mes-wm-warehouse-location-delete')
ON CONFLICT DO NOTHING;
