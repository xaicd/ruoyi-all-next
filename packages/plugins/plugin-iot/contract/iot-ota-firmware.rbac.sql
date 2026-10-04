-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT OTA 固件 (IotOtaFirmware)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-iot-ota-firmware',
  'iot-dir',
  'IoT OTA 固件管理',
  '/admin/iot/iot-ota-firmware',
  'iot/iot-ota-firmware/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_ota_firmware:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-iot-ota-firmware-query',  'menu-iot-ota-firmware', '查询IoT OTA 固件', 'BUTTON', 'ACTIVE', 'iot:iot_ota_firmware:query',  1, NOW(), NOW()),
('menu-iot-ota-firmware-create', 'menu-iot-ota-firmware', '新增IoT OTA 固件', 'BUTTON', 'ACTIVE', 'iot:iot_ota_firmware:create', 2, NOW(), NOW()),
('menu-iot-ota-firmware-update', 'menu-iot-ota-firmware', '修改IoT OTA 固件', 'BUTTON', 'ACTIVE', 'iot:iot_ota_firmware:update', 3, NOW(), NOW()),
('menu-iot-ota-firmware-delete', 'menu-iot-ota-firmware', '删除IoT OTA 固件', 'BUTTON', 'ACTIVE', 'iot:iot_ota_firmware:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-iot-ota-firmware'),
('1', 'menu-iot-ota-firmware-query'),
('1', 'menu-iot-ota-firmware-create'),
('1', 'menu-iot-ota-firmware-update'),
('1', 'menu-iot-ota-firmware-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-iot-ota-firmware'),
('1', 'menu-iot-ota-firmware-query'),
('1', 'menu-iot-ota-firmware-create'),
('1', 'menu-iot-ota-firmware-update'),
('1', 'menu-iot-ota-firmware-delete')
ON CONFLICT DO NOTHING;
