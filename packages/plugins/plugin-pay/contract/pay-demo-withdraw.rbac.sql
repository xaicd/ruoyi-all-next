-- ============================================================
-- Auto-generated RBAC & Menu Migration for 示例提现订单演示业务系统的转账业务 (PayDemoWithdraw)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-pay-demo-withdraw',
  'pay-dir',
  '示例提现订单演示业务系统的转账业务管理',
  '/admin/pay/pay-demo-withdraw',
  'pay/pay-demo-withdraw/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_demo_withdraw:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-pay-demo-withdraw-query',  'menu-pay-demo-withdraw', '查询示例提现订单演示业务系统的转账业务', 'BUTTON', 'ACTIVE', 'pay:pay_demo_withdraw:query',  1, NOW(), NOW()),
('menu-pay-demo-withdraw-create', 'menu-pay-demo-withdraw', '新增示例提现订单演示业务系统的转账业务', 'BUTTON', 'ACTIVE', 'pay:pay_demo_withdraw:create', 2, NOW(), NOW()),
('menu-pay-demo-withdraw-update', 'menu-pay-demo-withdraw', '修改示例提现订单演示业务系统的转账业务', 'BUTTON', 'ACTIVE', 'pay:pay_demo_withdraw:update', 3, NOW(), NOW()),
('menu-pay-demo-withdraw-delete', 'menu-pay-demo-withdraw', '删除示例提现订单演示业务系统的转账业务', 'BUTTON', 'ACTIVE', 'pay:pay_demo_withdraw:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-pay-demo-withdraw-rm',        '1', 'menu-pay-demo-withdraw'),
('menu-pay-demo-withdraw-rm-query',  '1', 'menu-pay-demo-withdraw-query'),
('menu-pay-demo-withdraw-rm-create', '1', 'menu-pay-demo-withdraw-create'),
('menu-pay-demo-withdraw-rm-update', '1', 'menu-pay-demo-withdraw-update'),
('menu-pay-demo-withdraw-rm-delete', '1', 'menu-pay-demo-withdraw-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-pay-demo-withdraw-pm',        '1', 'menu-pay-demo-withdraw'),
('menu-pay-demo-withdraw-pm-query',  '1', 'menu-pay-demo-withdraw-query'),
('menu-pay-demo-withdraw-pm-create', '1', 'menu-pay-demo-withdraw-create'),
('menu-pay-demo-withdraw-pm-update', '1', 'menu-pay-demo-withdraw-update'),
('menu-pay-demo-withdraw-pm-delete', '1', 'menu-pay-demo-withdraw-delete')
ON CONFLICT DO NOTHING;
