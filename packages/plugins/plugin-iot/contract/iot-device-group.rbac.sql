-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT 设备分组 (IotDeviceGroup)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-iot-device-group',
  'iot-dir',
  'IoT 设备分组管理',
  '/admin/iot/iot-device-group',
  'iot/iot-device-group/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_device_group:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-iot-device-group-query',  'menu-iot-device-group', '查询IoT 设备分组', 'BUTTON', 'ACTIVE', 'iot:iot_device_group:query',  1, NOW(), NOW()),
('menu-iot-device-group-create', 'menu-iot-device-group', '新增IoT 设备分组', 'BUTTON', 'ACTIVE', 'iot:iot_device_group:create', 2, NOW(), NOW()),
('menu-iot-device-group-update', 'menu-iot-device-group', '修改IoT 设备分组', 'BUTTON', 'ACTIVE', 'iot:iot_device_group:update', 3, NOW(), NOW()),
('menu-iot-device-group-delete', 'menu-iot-device-group', '删除IoT 设备分组', 'BUTTON', 'ACTIVE', 'iot:iot_device_group:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-iot-device-group'),
('1', 'menu-iot-device-group-query'),
('1', 'menu-iot-device-group-create'),
('1', 'menu-iot-device-group-update'),
('1', 'menu-iot-device-group-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-iot-device-group'),
('1', 'menu-iot-device-group-query'),
('1', 'menu-iot-device-group-create'),
('1', 'menu-iot-device-group-update'),
('1', 'menu-iot-device-group-delete')
ON CONFLICT DO NOTHING;
