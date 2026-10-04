-- ============================================================
-- Auto-generated RBAC & Menu Migration for IoT 产品分类 (IotProductCategory)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-iot-product-category',
  'iot-dir',
  'IoT 产品分类管理',
  '/admin/iot/iot-product-category',
  'iot/iot-product-category/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'iot:iot_product_category:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-iot-product-category-query',  'menu-iot-product-category', '查询IoT 产品分类', 'BUTTON', 'ACTIVE', 'iot:iot_product_category:query',  1, NOW(), NOW()),
('menu-iot-product-category-create', 'menu-iot-product-category', '新增IoT 产品分类', 'BUTTON', 'ACTIVE', 'iot:iot_product_category:create', 2, NOW(), NOW()),
('menu-iot-product-category-update', 'menu-iot-product-category', '修改IoT 产品分类', 'BUTTON', 'ACTIVE', 'iot:iot_product_category:update', 3, NOW(), NOW()),
('menu-iot-product-category-delete', 'menu-iot-product-category', '删除IoT 产品分类', 'BUTTON', 'ACTIVE', 'iot:iot_product_category:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-iot-product-category'),
('1', 'menu-iot-product-category-query'),
('1', 'menu-iot-product-category-create'),
('1', 'menu-iot-product-category-update'),
('1', 'menu-iot-product-category-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-iot-product-category'),
('1', 'menu-iot-product-category-query'),
('1', 'menu-iot-product-category-create'),
('1', 'menu-iot-product-category-update'),
('1', 'menu-iot-product-category-delete')
ON CONFLICT DO NOTHING;
