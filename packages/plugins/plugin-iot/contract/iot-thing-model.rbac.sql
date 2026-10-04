-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT 产品物模型功能 DO每个 和 是“一对多”的关系，它的每个属性、事件、服 (IotThingModel)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-iot-thing-model',
  'iot-dir',
  'IoT 产品物模型功能 DO每个 和 是“一对多”的关系，它的每个属性、事件、服管理',
  '/admin/iot/iot-thing-model',
  'iot/iot-thing-model/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_thing_model:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-iot-thing-model-query',  'menu-iot-thing-model', '查询IoT 产品物模型功能 DO每个 和 是“一对多”的关系，它的每个属性、事件、服', 'BUTTON', 'ACTIVE', 'iot:iot_thing_model:query',  1, NOW(), NOW()),
('menu-iot-thing-model-create', 'menu-iot-thing-model', '新增IoT 产品物模型功能 DO每个 和 是“一对多”的关系，它的每个属性、事件、服', 'BUTTON', 'ACTIVE', 'iot:iot_thing_model:create', 2, NOW(), NOW()),
('menu-iot-thing-model-update', 'menu-iot-thing-model', '修改IoT 产品物模型功能 DO每个 和 是“一对多”的关系，它的每个属性、事件、服', 'BUTTON', 'ACTIVE', 'iot:iot_thing_model:update', 3, NOW(), NOW()),
('menu-iot-thing-model-delete', 'menu-iot-thing-model', '删除IoT 产品物模型功能 DO每个 和 是“一对多”的关系，它的每个属性、事件、服', 'BUTTON', 'ACTIVE', 'iot:iot_thing_model:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-iot-thing-model-rm',        '1', 'menu-iot-thing-model'),
('menu-iot-thing-model-rm-query',  '1', 'menu-iot-thing-model-query'),
('menu-iot-thing-model-rm-create', '1', 'menu-iot-thing-model-create'),
('menu-iot-thing-model-rm-update', '1', 'menu-iot-thing-model-update'),
('menu-iot-thing-model-rm-delete', '1', 'menu-iot-thing-model-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-iot-thing-model-pm',        '1', 'menu-iot-thing-model'),
('menu-iot-thing-model-pm-query',  '1', 'menu-iot-thing-model-query'),
('menu-iot-thing-model-pm-create', '1', 'menu-iot-thing-model-create'),
('menu-iot-thing-model-pm-update', '1', 'menu-iot-thing-model-update'),
('menu-iot-thing-model-pm-delete', '1', 'menu-iot-thing-model-delete')
ON CONFLICT DO NOTHING;
