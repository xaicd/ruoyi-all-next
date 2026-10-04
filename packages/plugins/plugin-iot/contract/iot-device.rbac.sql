-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT 设备 (IotDevice)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-iot-device',
  'iot-dir',
  'IoT 设备管理',
  '/admin/iot/iot-device',
  'iot/iot-device/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_device:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-iot-device-query',  'menu-iot-device', '查询IoT 设备', 'BUTTON', 'ACTIVE', 'iot:iot_device:query',  1, NOW(), NOW()),
('menu-iot-device-create', 'menu-iot-device', '新增IoT 设备', 'BUTTON', 'ACTIVE', 'iot:iot_device:create', 2, NOW(), NOW()),
('menu-iot-device-update', 'menu-iot-device', '修改IoT 设备', 'BUTTON', 'ACTIVE', 'iot:iot_device:update', 3, NOW(), NOW()),
('menu-iot-device-delete', 'menu-iot-device', '删除IoT 设备', 'BUTTON', 'ACTIVE', 'iot:iot_device:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-iot-device-rm',        '1', 'menu-iot-device'),
('menu-iot-device-rm-query',  '1', 'menu-iot-device-query'),
('menu-iot-device-rm-create', '1', 'menu-iot-device-create'),
('menu-iot-device-rm-update', '1', 'menu-iot-device-update'),
('menu-iot-device-rm-delete', '1', 'menu-iot-device-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-iot-device-pm',        '1', 'menu-iot-device'),
('menu-iot-device-pm-query',  '1', 'menu-iot-device-query'),
('menu-iot-device-pm-create', '1', 'menu-iot-device-create'),
('menu-iot-device-pm-update', '1', 'menu-iot-device-update'),
('menu-iot-device-pm-delete', '1', 'menu-iot-device-delete')
ON CONFLICT DO NOTHING;
