-- ============================================================
-- Auto-generated RBAC & Menu Migration for 支付渠道 DO一个应用下，会有多种支付渠道，例如说微信支付、支付宝支付等等即 P (PayChannel)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-pay-channel',
  'pay-dir',
  '支付渠道 DO一个应用下，会有多种支付渠道，例如说微信支付、支付宝支付等等即 P管理',
  '/admin/pay/pay-channel',
  'pay/pay-channel/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_channel:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-pay-channel-query',  'menu-pay-channel', '查询支付渠道 DO一个应用下，会有多种支付渠道，例如说微信支付、支付宝支付等等即 P', 'BUTTON', 'ACTIVE', 'pay:pay_channel:query',  1, NOW(), NOW()),
('menu-pay-channel-create', 'menu-pay-channel', '新增支付渠道 DO一个应用下，会有多种支付渠道，例如说微信支付、支付宝支付等等即 P', 'BUTTON', 'ACTIVE', 'pay:pay_channel:create', 2, NOW(), NOW()),
('menu-pay-channel-update', 'menu-pay-channel', '修改支付渠道 DO一个应用下，会有多种支付渠道，例如说微信支付、支付宝支付等等即 P', 'BUTTON', 'ACTIVE', 'pay:pay_channel:update', 3, NOW(), NOW()),
('menu-pay-channel-delete', 'menu-pay-channel', '删除支付渠道 DO一个应用下，会有多种支付渠道，例如说微信支付、支付宝支付等等即 P', 'BUTTON', 'ACTIVE', 'pay:pay_channel:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-pay-channel-rm',        '1', 'menu-pay-channel'),
('menu-pay-channel-rm-query',  '1', 'menu-pay-channel-query'),
('menu-pay-channel-rm-create', '1', 'menu-pay-channel-create'),
('menu-pay-channel-rm-update', '1', 'menu-pay-channel-update'),
('menu-pay-channel-rm-delete', '1', 'menu-pay-channel-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-pay-channel-pm',        '1', 'menu-pay-channel'),
('menu-pay-channel-pm-query',  '1', 'menu-pay-channel-query'),
('menu-pay-channel-pm-create', '1', 'menu-pay-channel-create'),
('menu-pay-channel-pm-update', '1', 'menu-pay-channel-update'),
('menu-pay-channel-pm-delete', '1', 'menu-pay-channel-delete')
ON CONFLICT DO NOTHING;
