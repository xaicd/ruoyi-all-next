-- ============================================================
-- Auto-generated RBAC & Menu Migration for 快递公司 (DeliveryExpress)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-delivery-express',
  'mall-dir',
  '快递公司管理',
  '/admin/mall/delivery-express',
  'mall/delivery-express/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:delivery_express:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-delivery-express-query',  'menu-delivery-express', '查询快递公司', 'BUTTON', 'ACTIVE', 'mall:delivery_express:query',  1, NOW(), NOW()),
('menu-delivery-express-create', 'menu-delivery-express', '新增快递公司', 'BUTTON', 'ACTIVE', 'mall:delivery_express:create', 2, NOW(), NOW()),
('menu-delivery-express-update', 'menu-delivery-express', '修改快递公司', 'BUTTON', 'ACTIVE', 'mall:delivery_express:update', 3, NOW(), NOW()),
('menu-delivery-express-delete', 'menu-delivery-express', '删除快递公司', 'BUTTON', 'ACTIVE', 'mall:delivery_express:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-delivery-express-rm',        '1', 'menu-delivery-express'),
('menu-delivery-express-rm-query',  '1', 'menu-delivery-express-query'),
('menu-delivery-express-rm-create', '1', 'menu-delivery-express-create'),
('menu-delivery-express-rm-update', '1', 'menu-delivery-express-update'),
('menu-delivery-express-rm-delete', '1', 'menu-delivery-express-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-delivery-express-pm',        '1', 'menu-delivery-express'),
('menu-delivery-express-pm-query',  '1', 'menu-delivery-express-query'),
('menu-delivery-express-pm-create', '1', 'menu-delivery-express-create'),
('menu-delivery-express-pm-update', '1', 'menu-delivery-express-update'),
('menu-delivery-express-pm-delete', '1', 'menu-delivery-express-delete')
ON CONFLICT DO NOTHING;
