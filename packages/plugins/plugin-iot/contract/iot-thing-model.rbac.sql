-- ============================================================
-- Auto-generated RBAC & Menu Migration for IotThingModel（源框架导入） (IotThingModel)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-iot-thing-model',
  'iot-dir',
  'IotThingModel（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-iot-thing-model-query',  'menu-iot-thing-model', '查询IotThingModel（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_thing_model:query',  1, NOW(), NOW()),
('menu-iot-thing-model-create', 'menu-iot-thing-model', '新增IotThingModel（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_thing_model:create', 2, NOW(), NOW()),
('menu-iot-thing-model-update', 'menu-iot-thing-model', '修改IotThingModel（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_thing_model:update', 3, NOW(), NOW()),
('menu-iot-thing-model-delete', 'menu-iot-thing-model', '删除IotThingModel（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_thing_model:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-iot-thing-model'),
('1', 'menu-iot-thing-model-query'),
('1', 'menu-iot-thing-model-create'),
('1', 'menu-iot-thing-model-update'),
('1', 'menu-iot-thing-model-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-iot-thing-model'),
('1', 'menu-iot-thing-model-query'),
('1', 'menu-iot-thing-model-create'),
('1', 'menu-iot-thing-model-update'),
('1', 'menu-iot-thing-model-delete')
ON CONFLICT DO NOTHING;
