-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT OTA 升级任务记录 (IotOtaTaskRecord)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-iot-ota-task-record',
  'iot-dir',
  'IoT OTA 升级任务记录管理',
  '/admin/iot/iot-ota-task-record',
  'iot/iot-ota-task-record/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_ota_task_record:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-iot-ota-task-record-query',  'menu-iot-ota-task-record', '查询IoT OTA 升级任务记录', 'BUTTON', 'ACTIVE', 'iot:iot_ota_task_record:query',  1, NOW(), NOW()),
('menu-iot-ota-task-record-create', 'menu-iot-ota-task-record', '新增IoT OTA 升级任务记录', 'BUTTON', 'ACTIVE', 'iot:iot_ota_task_record:create', 2, NOW(), NOW()),
('menu-iot-ota-task-record-update', 'menu-iot-ota-task-record', '修改IoT OTA 升级任务记录', 'BUTTON', 'ACTIVE', 'iot:iot_ota_task_record:update', 3, NOW(), NOW()),
('menu-iot-ota-task-record-delete', 'menu-iot-ota-task-record', '删除IoT OTA 升级任务记录', 'BUTTON', 'ACTIVE', 'iot:iot_ota_task_record:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-iot-ota-task-record-rm',        '1', 'menu-iot-ota-task-record'),
('menu-iot-ota-task-record-rm-query',  '1', 'menu-iot-ota-task-record-query'),
('menu-iot-ota-task-record-rm-create', '1', 'menu-iot-ota-task-record-create'),
('menu-iot-ota-task-record-rm-update', '1', 'menu-iot-ota-task-record-update'),
('menu-iot-ota-task-record-rm-delete', '1', 'menu-iot-ota-task-record-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-iot-ota-task-record-pm',        '1', 'menu-iot-ota-task-record'),
('menu-iot-ota-task-record-pm-query',  '1', 'menu-iot-ota-task-record-query'),
('menu-iot-ota-task-record-pm-create', '1', 'menu-iot-ota-task-record-create'),
('menu-iot-ota-task-record-pm-update', '1', 'menu-iot-ota-task-record-update'),
('menu-iot-ota-task-record-pm-delete', '1', 'menu-iot-ota-task-record-delete')
ON CONFLICT DO NOTHING;
