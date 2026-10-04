-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT OTA 升级任务 (IotOtaTask)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-iot-ota-task',
  'iot-dir',
  'IoT OTA 升级任务管理',
  '/admin/iot/iot-ota-task',
  'iot/iot-ota-task/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_ota_task:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-iot-ota-task-query',  'menu-iot-ota-task', '查询IoT OTA 升级任务', 'BUTTON', 'ACTIVE', 'iot:iot_ota_task:query',  1, NOW(), NOW()),
('menu-iot-ota-task-create', 'menu-iot-ota-task', '新增IoT OTA 升级任务', 'BUTTON', 'ACTIVE', 'iot:iot_ota_task:create', 2, NOW(), NOW()),
('menu-iot-ota-task-update', 'menu-iot-ota-task', '修改IoT OTA 升级任务', 'BUTTON', 'ACTIVE', 'iot:iot_ota_task:update', 3, NOW(), NOW()),
('menu-iot-ota-task-delete', 'menu-iot-ota-task', '删除IoT OTA 升级任务', 'BUTTON', 'ACTIVE', 'iot:iot_ota_task:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-iot-ota-task-rm',        '1', 'menu-iot-ota-task'),
('menu-iot-ota-task-rm-query',  '1', 'menu-iot-ota-task-query'),
('menu-iot-ota-task-rm-create', '1', 'menu-iot-ota-task-create'),
('menu-iot-ota-task-rm-update', '1', 'menu-iot-ota-task-update'),
('menu-iot-ota-task-rm-delete', '1', 'menu-iot-ota-task-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-iot-ota-task-pm',        '1', 'menu-iot-ota-task'),
('menu-iot-ota-task-pm-query',  '1', 'menu-iot-ota-task-query'),
('menu-iot-ota-task-pm-create', '1', 'menu-iot-ota-task-create'),
('menu-iot-ota-task-pm-update', '1', 'menu-iot-ota-task-update'),
('menu-iot-ota-task-pm-delete', '1', 'menu-iot-ota-task-delete')
ON CONFLICT DO NOTHING;
