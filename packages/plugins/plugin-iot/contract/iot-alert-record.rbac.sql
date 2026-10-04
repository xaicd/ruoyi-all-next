-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT 告警记录 (IotAlertRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-iot-alert-record',
  'iot-dir',
  'IoT 告警记录管理',
  '/admin/iot/iot-alert-record',
  'iot/iot-alert-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_alert_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-iot-alert-record-query',  'menu-iot-alert-record', '查询IoT 告警记录', 'BUTTON', 'ACTIVE', 'iot:iot_alert_record:query',  1, NOW(), NOW()),
('menu-iot-alert-record-create', 'menu-iot-alert-record', '新增IoT 告警记录', 'BUTTON', 'ACTIVE', 'iot:iot_alert_record:create', 2, NOW(), NOW()),
('menu-iot-alert-record-update', 'menu-iot-alert-record', '修改IoT 告警记录', 'BUTTON', 'ACTIVE', 'iot:iot_alert_record:update', 3, NOW(), NOW()),
('menu-iot-alert-record-delete', 'menu-iot-alert-record', '删除IoT 告警记录', 'BUTTON', 'ACTIVE', 'iot:iot_alert_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-iot-alert-record'),
('1', 'menu-iot-alert-record-query'),
('1', 'menu-iot-alert-record-create'),
('1', 'menu-iot-alert-record-update'),
('1', 'menu-iot-alert-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-iot-alert-record'),
('1', 'menu-iot-alert-record-query'),
('1', 'menu-iot-alert-record-create'),
('1', 'menu-iot-alert-record-update'),
('1', 'menu-iot-alert-record-delete')
ON CONFLICT DO NOTHING;
