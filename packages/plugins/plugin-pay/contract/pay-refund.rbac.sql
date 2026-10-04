-- ============================================================
-- Auto-generated RBAC & Menu Migration for 支付退款单 DO一个支付订单，可以拥有多个支付退款单即 PayOrderDO : (PayRefund)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-pay-refund',
  'pay-dir',
  '支付退款单 DO一个支付订单，可以拥有多个支付退款单即 PayOrderDO :管理',
  '/admin/pay/pay-refund',
  'pay/pay-refund/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_refund:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-pay-refund-query',  'menu-pay-refund', '查询支付退款单 DO一个支付订单，可以拥有多个支付退款单即 PayOrderDO :', 'BUTTON', 'ACTIVE', 'pay:pay_refund:query',  1, NOW(), NOW()),
('menu-pay-refund-create', 'menu-pay-refund', '新增支付退款单 DO一个支付订单，可以拥有多个支付退款单即 PayOrderDO :', 'BUTTON', 'ACTIVE', 'pay:pay_refund:create', 2, NOW(), NOW()),
('menu-pay-refund-update', 'menu-pay-refund', '修改支付退款单 DO一个支付订单，可以拥有多个支付退款单即 PayOrderDO :', 'BUTTON', 'ACTIVE', 'pay:pay_refund:update', 3, NOW(), NOW()),
('menu-pay-refund-delete', 'menu-pay-refund', '删除支付退款单 DO一个支付订单，可以拥有多个支付退款单即 PayOrderDO :', 'BUTTON', 'ACTIVE', 'pay:pay_refund:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-pay-refund-rm',        '1', 'menu-pay-refund'),
('menu-pay-refund-rm-query',  '1', 'menu-pay-refund-query'),
('menu-pay-refund-rm-create', '1', 'menu-pay-refund-create'),
('menu-pay-refund-rm-update', '1', 'menu-pay-refund-update'),
('menu-pay-refund-rm-delete', '1', 'menu-pay-refund-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-pay-refund-pm',        '1', 'menu-pay-refund'),
('menu-pay-refund-pm-query',  '1', 'menu-pay-refund-query'),
('menu-pay-refund-pm-create', '1', 'menu-pay-refund-create'),
('menu-pay-refund-pm-update', '1', 'menu-pay-refund-update'),
('menu-pay-refund-pm-delete', '1', 'menu-pay-refund-delete')
ON CONFLICT DO NOTHING;
