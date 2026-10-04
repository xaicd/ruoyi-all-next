-- ============================================================
-- Auto-generated RBAC & Menu Migration for MES 设备保养记录 (MesDvMaintenRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-mes-dv-mainten-record',
  'mes-dir',
  'MES 设备保养记录管理',
  '/admin/mes/mes-dv-mainten-record',
  'mes/mes-dv-mainten-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mes:mes_dv_mainten_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-mes-dv-mainten-record-query',  'menu-mes-dv-mainten-record', '查询MES 设备保养记录', 'BUTTON', 'ACTIVE', 'mes:mes_dv_mainten_record:query',  1, NOW(), NOW()),
('menu-mes-dv-mainten-record-create', 'menu-mes-dv-mainten-record', '新增MES 设备保养记录', 'BUTTON', 'ACTIVE', 'mes:mes_dv_mainten_record:create', 2, NOW(), NOW()),
('menu-mes-dv-mainten-record-update', 'menu-mes-dv-mainten-record', '修改MES 设备保养记录', 'BUTTON', 'ACTIVE', 'mes:mes_dv_mainten_record:update', 3, NOW(), NOW()),
('menu-mes-dv-mainten-record-delete', 'menu-mes-dv-mainten-record', '删除MES 设备保养记录', 'BUTTON', 'ACTIVE', 'mes:mes_dv_mainten_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-mes-dv-mainten-record'),
('1', 'menu-mes-dv-mainten-record-query'),
('1', 'menu-mes-dv-mainten-record-create'),
('1', 'menu-mes-dv-mainten-record-update'),
('1', 'menu-mes-dv-mainten-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-mes-dv-mainten-record'),
('1', 'menu-mes-dv-mainten-record-query'),
('1', 'menu-mes-dv-mainten-record-create'),
('1', 'menu-mes-dv-mainten-record-update'),
('1', 'menu-mes-dv-mainten-record-delete')
ON CONFLICT DO NOTHING;
