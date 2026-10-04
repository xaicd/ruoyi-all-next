-- ============================================================
-- Auto-generated RBAC & Menu Migration for 支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家 (PayApp)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-pay-app',
  'pay-dir',
  '支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家管理',
  '/admin/pay/pay-app',
  'pay/pay-app/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_app:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-pay-app-query',  'menu-pay-app', '查询支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家', 'BUTTON', 'ACTIVE', 'pay:pay_app:query',  1, NOW(), NOW()),
('menu-pay-app-create', 'menu-pay-app', '新增支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家', 'BUTTON', 'ACTIVE', 'pay:pay_app:create', 2, NOW(), NOW()),
('menu-pay-app-update', 'menu-pay-app', '修改支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家', 'BUTTON', 'ACTIVE', 'pay:pay_app:update', 3, NOW(), NOW()),
('menu-pay-app-delete', 'menu-pay-app', '删除支付应用 DO一个商户下，可能会有多个支付应用。例如说，京东有京东商城、京东到家', 'BUTTON', 'ACTIVE', 'pay:pay_app:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-pay-app-rm',        '1', 'menu-pay-app'),
('menu-pay-app-rm-query',  '1', 'menu-pay-app-query'),
('menu-pay-app-rm-create', '1', 'menu-pay-app-create'),
('menu-pay-app-rm-update', '1', 'menu-pay-app-update'),
('menu-pay-app-rm-delete', '1', 'menu-pay-app-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-pay-app-pm',        '1', 'menu-pay-app'),
('menu-pay-app-pm-query',  '1', 'menu-pay-app-query'),
('menu-pay-app-pm-create', '1', 'menu-pay-app-create'),
('menu-pay-app-pm-update', '1', 'menu-pay-app-update'),
('menu-pay-app-pm-delete', '1', 'menu-pay-app-delete')
ON CONFLICT DO NOTHING;
