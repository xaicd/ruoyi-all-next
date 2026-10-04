-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT 设备 Modbus 点位配置 (IotDeviceModbusPoint)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-iot-device-modbus-point',
  'iot-dir',
  'IoT 设备 Modbus 点位配置管理',
  '/admin/iot/iot-device-modbus-point',
  'iot/iot-device-modbus-point/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_device_modbus_point:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-iot-device-modbus-point-query',  'menu-iot-device-modbus-point', '查询IoT 设备 Modbus 点位配置', 'BUTTON', 'ACTIVE', 'iot:iot_device_modbus_point:query',  1, NOW(), NOW()),
('menu-iot-device-modbus-point-create', 'menu-iot-device-modbus-point', '新增IoT 设备 Modbus 点位配置', 'BUTTON', 'ACTIVE', 'iot:iot_device_modbus_point:create', 2, NOW(), NOW()),
('menu-iot-device-modbus-point-update', 'menu-iot-device-modbus-point', '修改IoT 设备 Modbus 点位配置', 'BUTTON', 'ACTIVE', 'iot:iot_device_modbus_point:update', 3, NOW(), NOW()),
('menu-iot-device-modbus-point-delete', 'menu-iot-device-modbus-point', '删除IoT 设备 Modbus 点位配置', 'BUTTON', 'ACTIVE', 'iot:iot_device_modbus_point:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-iot-device-modbus-point'),
('1', 'menu-iot-device-modbus-point-query'),
('1', 'menu-iot-device-modbus-point-create'),
('1', 'menu-iot-device-modbus-point-update'),
('1', 'menu-iot-device-modbus-point-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-iot-device-modbus-point'),
('1', 'menu-iot-device-modbus-point-query'),
('1', 'menu-iot-device-modbus-point-create'),
('1', 'menu-iot-device-modbus-point-update'),
('1', 'menu-iot-device-modbus-point-delete')
ON CONFLICT DO NOTHING;
