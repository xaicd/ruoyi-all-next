-- ============================================================
-- Auto-generated RBAC & Menu Migration for 快递运费模板 (DeliveryExpressTemplate)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-delivery-express-template',
  'mall-dir',
  '快递运费模板管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-delivery-express-template-query',  'menu-delivery-express-template', '查询快递运费模板', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template:query',  1, NOW(), NOW()),
('menu-delivery-express-template-create', 'menu-delivery-express-template', '新增快递运费模板', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template:create', 2, NOW(), NOW()),
('menu-delivery-express-template-update', 'menu-delivery-express-template', '修改快递运费模板', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template:update', 3, NOW(), NOW()),
('menu-delivery-express-template-delete', 'menu-delivery-express-template', '删除快递运费模板', 'BUTTON', 'ACTIVE', 'mall:delivery_express_template:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-delivery-express-template-rm',        '1', 'menu-delivery-express-template'),
('menu-delivery-express-template-rm-query',  '1', 'menu-delivery-express-template-query'),
('menu-delivery-express-template-rm-create', '1', 'menu-delivery-express-template-create'),
('menu-delivery-express-template-rm-update', '1', 'menu-delivery-express-template-update'),
('menu-delivery-express-template-rm-delete', '1', 'menu-delivery-express-template-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-delivery-express-template-pm',        '1', 'menu-delivery-express-template'),
('menu-delivery-express-template-pm-query',  '1', 'menu-delivery-express-template-query'),
('menu-delivery-express-template-pm-create', '1', 'menu-delivery-express-template-create'),
('menu-delivery-express-template-pm-update', '1', 'menu-delivery-express-template-update'),
('menu-delivery-express-template-pm-delete', '1', 'menu-delivery-express-template-delete')
ON CONFLICT DO NOTHING;
