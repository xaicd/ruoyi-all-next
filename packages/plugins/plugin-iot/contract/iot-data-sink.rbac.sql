-- ============================================================
-- Auto-generated RBAC & Menu Migration for IotDataSink（源框架导入） (IotDataSink)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-iot-data-sink',
  'iot-dir',
  'IotDataSink（源框架导入）管理',
  '/admin/iot/iot-data-sink',
  'iot/iot-data-sink/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_data_sink:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-iot-data-sink-query',  'menu-iot-data-sink', '查询IotDataSink（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_data_sink:query',  1, NOW(), NOW()),
('menu-iot-data-sink-create', 'menu-iot-data-sink', '新增IotDataSink（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_data_sink:create', 2, NOW(), NOW()),
('menu-iot-data-sink-update', 'menu-iot-data-sink', '修改IotDataSink（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_data_sink:update', 3, NOW(), NOW()),
('menu-iot-data-sink-delete', 'menu-iot-data-sink', '删除IotDataSink（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_data_sink:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-iot-data-sink'),
('1', 'menu-iot-data-sink-query'),
('1', 'menu-iot-data-sink-create'),
('1', 'menu-iot-data-sink-update'),
('1', 'menu-iot-data-sink-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-iot-data-sink'),
('1', 'menu-iot-data-sink-query'),
('1', 'menu-iot-data-sink-create'),
('1', 'menu-iot-data-sink-update'),
('1', 'menu-iot-data-sink-delete')
ON CONFLICT DO NOTHING;
