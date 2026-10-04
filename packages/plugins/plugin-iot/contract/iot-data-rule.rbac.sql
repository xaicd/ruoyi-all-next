-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT 数据流转规则 DO监听 数据源，转发到 数据目的 (IotDataRule)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-iot-data-rule',
  'iot-dir',
  'IoT 数据流转规则 DO监听 数据源，转发到 数据目的管理',
  '/admin/iot/iot-data-rule',
  'iot/iot-data-rule/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_data_rule:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-iot-data-rule-query',  'menu-iot-data-rule', '查询IoT 数据流转规则 DO监听 数据源，转发到 数据目的', 'BUTTON', 'ACTIVE', 'iot:iot_data_rule:query',  1, NOW(), NOW()),
('menu-iot-data-rule-create', 'menu-iot-data-rule', '新增IoT 数据流转规则 DO监听 数据源，转发到 数据目的', 'BUTTON', 'ACTIVE', 'iot:iot_data_rule:create', 2, NOW(), NOW()),
('menu-iot-data-rule-update', 'menu-iot-data-rule', '修改IoT 数据流转规则 DO监听 数据源，转发到 数据目的', 'BUTTON', 'ACTIVE', 'iot:iot_data_rule:update', 3, NOW(), NOW()),
('menu-iot-data-rule-delete', 'menu-iot-data-rule', '删除IoT 数据流转规则 DO监听 数据源，转发到 数据目的', 'BUTTON', 'ACTIVE', 'iot:iot_data_rule:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-iot-data-rule-rm',        '1', 'menu-iot-data-rule'),
('menu-iot-data-rule-rm-query',  '1', 'menu-iot-data-rule-query'),
('menu-iot-data-rule-rm-create', '1', 'menu-iot-data-rule-create'),
('menu-iot-data-rule-rm-update', '1', 'menu-iot-data-rule-update'),
('menu-iot-data-rule-rm-delete', '1', 'menu-iot-data-rule-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-iot-data-rule-pm',        '1', 'menu-iot-data-rule'),
('menu-iot-data-rule-pm-query',  '1', 'menu-iot-data-rule-query'),
('menu-iot-data-rule-pm-create', '1', 'menu-iot-data-rule-create'),
('menu-iot-data-rule-pm-update', '1', 'menu-iot-data-rule-update'),
('menu-iot-data-rule-pm-delete', '1', 'menu-iot-data-rule-delete')
ON CONFLICT DO NOTHING;
