-- ============================================================
-- Auto-generated RBAC & Menu Migration for 快递运费模板包邮配置 (DeliveryExpressTemplateFree)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-delivery-express-template-free',
  'mall-dir',
  '快递运费模板包邮配置管理',
  '/admin/mall/delivery-express-template-free',
  'mall/delivery-express-template-free/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:delivery_express_template_free:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-delivery-express-template-free-query',  'menu-delivery-express-template-free', '查询快递运费模板包邮配置', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template_free:query',  1, NOW(), NOW()),
('menu-delivery-express-template-free-create', 'menu-delivery-express-template-free', '新增快递运费模板包邮配置', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template_free:create', 2, NOW(), NOW()),
('menu-delivery-express-template-free-update', 'menu-delivery-express-template-free', '修改快递运费模板包邮配置', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template_free:update', 3, NOW(), NOW()),
('menu-delivery-express-template-free-delete', 'menu-delivery-express-template-free', '删除快递运费模板包邮配置', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template_free:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-delivery-express-template-free'),
('1', 'menu-delivery-express-template-free-query'),
('1', 'menu-delivery-express-template-free-create'),
('1', 'menu-delivery-express-template-free-update'),
('1', 'menu-delivery-express-template-free-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-delivery-express-template-free'),
('1', 'menu-delivery-express-template-free-query'),
('1', 'menu-delivery-express-template-free-create'),
('1', 'menu-delivery-express-template-free-update'),
('1', 'menu-delivery-express-template-free-delete')
ON CONFLICT DO NOTHING;
