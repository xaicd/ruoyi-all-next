-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT 产品 (IotProduct)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-iot-product',
  'iot-dir',
  'IoT 产品管理',
  '/admin/iot/iot-product',
  'iot/iot-product/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_product:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-iot-product-query',  'menu-iot-product', '查询IoT 产品', 'BUTTON', 'ACTIVE', 'iot:iot_product:query',  1, NOW(), NOW()),
('menu-iot-product-create', 'menu-iot-product', '新增IoT 产品', 'BUTTON', 'ACTIVE', 'iot:iot_product:create', 2, NOW(), NOW()),
('menu-iot-product-update', 'menu-iot-product', '修改IoT 产品', 'BUTTON', 'ACTIVE', 'iot:iot_product:update', 3, NOW(), NOW()),
('menu-iot-product-delete', 'menu-iot-product', '删除IoT 产品', 'BUTTON', 'ACTIVE', 'iot:iot_product:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-iot-product-rm',        '1', 'menu-iot-product'),
('menu-iot-product-rm-query',  '1', 'menu-iot-product-query'),
('menu-iot-product-rm-create', '1', 'menu-iot-product-create'),
('menu-iot-product-rm-update', '1', 'menu-iot-product-update'),
('menu-iot-product-rm-delete', '1', 'menu-iot-product-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-iot-product-pm',        '1', 'menu-iot-product'),
('menu-iot-product-pm-query',  '1', 'menu-iot-product-query'),
('menu-iot-product-pm-create', '1', 'menu-iot-product-create'),
('menu-iot-product-pm-update', '1', 'menu-iot-product-update'),
('menu-iot-product-pm-delete', '1', 'menu-iot-product-delete')
ON CONFLICT DO NOTHING;
