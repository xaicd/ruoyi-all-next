-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT 场景联动规则 (IotSceneRule)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-iot-scene-rule',
  'iot-dir',
  'IoT 场景联动规则管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-iot-scene-rule-query',  'menu-iot-scene-rule', '查询IoT 场景联动规则', 'BUTTON', 'ACTIVE', 'iot:iot_scene_rule:query',  1, NOW(), NOW()),
('menu-iot-scene-rule-create', 'menu-iot-scene-rule', '新增IoT 场景联动规则', 'BUTTON', 'ACTIVE', 'iot:iot_scene_rule:create', 2, NOW(), NOW()),
('menu-iot-scene-rule-update', 'menu-iot-scene-rule', '修改IoT 场景联动规则', 'BUTTON', 'ACTIVE', 'iot:iot_scene_rule:update', 3, NOW(), NOW()),
('menu-iot-scene-rule-delete', 'menu-iot-scene-rule', '删除IoT 场景联动规则', 'BUTTON', 'ACTIVE', 'iot:iot_scene_rule:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-iot-scene-rule-rm',        '1', 'menu-iot-scene-rule'),
('menu-iot-scene-rule-rm-query',  '1', 'menu-iot-scene-rule-query'),
('menu-iot-scene-rule-rm-create', '1', 'menu-iot-scene-rule-create'),
('menu-iot-scene-rule-rm-update', '1', 'menu-iot-scene-rule-update'),
('menu-iot-scene-rule-rm-delete', '1', 'menu-iot-scene-rule-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-iot-scene-rule-pm',        '1', 'menu-iot-scene-rule'),
('menu-iot-scene-rule-pm-query',  '1', 'menu-iot-scene-rule-query'),
('menu-iot-scene-rule-pm-create', '1', 'menu-iot-scene-rule-create'),
('menu-iot-scene-rule-pm-update', '1', 'menu-iot-scene-rule-update'),
('menu-iot-scene-rule-pm-delete', '1', 'menu-iot-scene-rule-delete')
ON CONFLICT DO NOTHING;
