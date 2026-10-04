-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT 告警配置 (IotAlertConfig)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-iot-alert-config',
  'iot-dir',
  'IoT 告警配置管理',
  '/admin/iot/iot-alert-config',
  'iot/iot-alert-config/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_alert_config:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-iot-alert-config-query',  'menu-iot-alert-config', '查询IoT 告警配置', 'BUTTON', 'ACTIVE', 'iot:iot_alert_config:query',  1, NOW(), NOW()),
('menu-iot-alert-config-create', 'menu-iot-alert-config', '新增IoT 告警配置', 'BUTTON', 'ACTIVE', 'iot:iot_alert_config:create', 2, NOW(), NOW()),
('menu-iot-alert-config-update', 'menu-iot-alert-config', '修改IoT 告警配置', 'BUTTON', 'ACTIVE', 'iot:iot_alert_config:update', 3, NOW(), NOW()),
('menu-iot-alert-config-delete', 'menu-iot-alert-config', '删除IoT 告警配置', 'BUTTON', 'ACTIVE', 'iot:iot_alert_config:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-iot-alert-config'),
('1', 'menu-iot-alert-config-query'),
('1', 'menu-iot-alert-config-create'),
('1', 'menu-iot-alert-config-update'),
('1', 'menu-iot-alert-config-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-iot-alert-config'),
('1', 'menu-iot-alert-config-query'),
('1', 'menu-iot-alert-config-create'),
('1', 'menu-iot-alert-config-update'),
('1', 'menu-iot-alert-config-delete')
ON CONFLICT DO NOTHING;
