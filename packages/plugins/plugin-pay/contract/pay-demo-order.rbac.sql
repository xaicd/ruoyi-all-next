-- ============================================================
-- Auto-generated RBAC & Menu Migration for 示例订单演示业务系统的订单，如何接入 pay 系统的支付与退款 (PayDemoOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-pay-demo-order',
  'pay-dir',
  '示例订单演示业务系统的订单，如何接入 pay 系统的支付与退款管理',
  '/admin/pay/pay-demo-order',
  'pay/pay-demo-order/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_demo_order:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-pay-demo-order-query',  'menu-pay-demo-order', '查询示例订单演示业务系统的订单，如何接入 pay 系统的支付与退款', 'BUTTON', 'ACTIVE', 'pay:pay_demo_order:query',  1, NOW(), NOW()),
('menu-pay-demo-order-create', 'menu-pay-demo-order', '新增示例订单演示业务系统的订单，如何接入 pay 系统的支付与退款', 'BUTTON', 'ACTIVE', 'pay:pay_demo_order:create', 2, NOW(), NOW()),
('menu-pay-demo-order-update', 'menu-pay-demo-order', '修改示例订单演示业务系统的订单，如何接入 pay 系统的支付与退款', 'BUTTON', 'ACTIVE', 'pay:pay_demo_order:update', 3, NOW(), NOW()),
('menu-pay-demo-order-delete', 'menu-pay-demo-order', '删除示例订单演示业务系统的订单，如何接入 pay 系统的支付与退款', 'BUTTON', 'ACTIVE', 'pay:pay_demo_order:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-pay-demo-order'),
('1', 'menu-pay-demo-order-query'),
('1', 'menu-pay-demo-order-create'),
('1', 'menu-pay-demo-order-update'),
('1', 'menu-pay-demo-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-pay-demo-order'),
('1', 'menu-pay-demo-order-query'),
('1', 'menu-pay-demo-order-create'),
('1', 'menu-pay-demo-order-update'),
('1', 'menu-pay-demo-order-delete')
ON CONFLICT DO NOTHING;
