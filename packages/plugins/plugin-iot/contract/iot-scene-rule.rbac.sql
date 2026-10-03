-- ============================================================
-- Auto-generated RBAC & Menu Migration for IotSceneRule（源框架导入） (IotSceneRule)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-iot-scene-rule',
  'iot-dir',
  'IotSceneRule（源框架导入）管理',
  '/admin/iot/iot-scene-rule',
  'iot/iot-scene-rule/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_scene_rule:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-iot-scene-rule-query',  'menu-iot-scene-rule', '查询IotSceneRule（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_scene_rule:query',  1, NOW(), NOW()),
('menu-iot-scene-rule-create', 'menu-iot-scene-rule', '新增IotSceneRule（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_scene_rule:create', 2, NOW(), NOW()),
('menu-iot-scene-rule-update', 'menu-iot-scene-rule', '修改IotSceneRule（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_scene_rule:update', 3, NOW(), NOW()),
('menu-iot-scene-rule-delete', 'menu-iot-scene-rule', '删除IotSceneRule（源框架导入）', 'BUTTON', 'ACTIVE', 'iot:iot_scene_rule:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-iot-scene-rule'),
('1', 'menu-iot-scene-rule-query'),
('1', 'menu-iot-scene-rule-create'),
('1', 'menu-iot-scene-rule-update'),
('1', 'menu-iot-scene-rule-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-iot-scene-rule'),
('1', 'menu-iot-scene-rule-query'),
('1', 'menu-iot-scene-rule-create'),
('1', 'menu-iot-scene-rule-update'),
('1', 'menu-iot-scene-rule-delete')
ON CONFLICT DO NOTHING;
