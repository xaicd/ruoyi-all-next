-- ============================================================
-- Auto-generated RBAC & Menu Migration for DeliveryExpressTemplate（源框架导入） (DeliveryExpressTemplate)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-delivery-express-template',
  'mall-dir',
  'DeliveryExpressTemplate（源框架导入）管理',
  '/admin/mall/delivery-express-template',
  'mall/delivery-express-template/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:delivery_express_template:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-delivery-express-template-query',  'menu-delivery-express-template', '查询DeliveryExpressTemplate（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template:query',  1, NOW(), NOW()),
('menu-delivery-express-template-create', 'menu-delivery-express-template', '新增DeliveryExpressTemplate（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template:create', 2, NOW(), NOW()),
('menu-delivery-express-template-update', 'menu-delivery-express-template', '修改DeliveryExpressTemplate（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template:update', 3, NOW(), NOW()),
('menu-delivery-express-template-delete', 'menu-delivery-express-template', '删除DeliveryExpressTemplate（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-delivery-express-template'),
('1', 'menu-delivery-express-template-query'),
('1', 'menu-delivery-express-template-create'),
('1', 'menu-delivery-express-template-update'),
('1', 'menu-delivery-express-template-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-delivery-express-template'),
('1', 'menu-delivery-express-template-query'),
('1', 'menu-delivery-express-template-create'),
('1', 'menu-delivery-express-template-update'),
('1', 'menu-delivery-express-template-delete')
ON CONFLICT DO NOTHING;
