-- ============================================================
-- Auto-generated RBAC & Menu Migration for DeliveryExpressTemplateCharge（源框架导入） (DeliveryExpressTemplateCharge)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-delivery-express-template-charge',
  'mall-dir',
  'DeliveryExpressTemplateCharge（源框架导入）管理',
  '/admin/mall/delivery-express-template-charge',
  'mall/delivery-express-template-charge/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:delivery_express_template_charge:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-delivery-express-template-charge-query',  'menu-delivery-express-template-charge', '查询DeliveryExpressTemplateCharge（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template_charge:query',  1, NOW(), NOW()),
('menu-delivery-express-template-charge-create', 'menu-delivery-express-template-charge', '新增DeliveryExpressTemplateCharge（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template_charge:create', 2, NOW(), NOW()),
('menu-delivery-express-template-charge-update', 'menu-delivery-express-template-charge', '修改DeliveryExpressTemplateCharge（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template_charge:update', 3, NOW(), NOW()),
('menu-delivery-express-template-charge-delete', 'menu-delivery-express-template-charge', '删除DeliveryExpressTemplateCharge（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template_charge:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-delivery-express-template-charge'),
('1', 'menu-delivery-express-template-charge-query'),
('1', 'menu-delivery-express-template-charge-create'),
('1', 'menu-delivery-express-template-charge-update'),
('1', 'menu-delivery-express-template-charge-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-delivery-express-template-charge'),
('1', 'menu-delivery-express-template-charge-query'),
('1', 'menu-delivery-express-template-charge-create'),
('1', 'menu-delivery-express-template-charge-update'),
('1', 'menu-delivery-express-template-charge-delete')
ON CONFLICT DO NOTHING;
