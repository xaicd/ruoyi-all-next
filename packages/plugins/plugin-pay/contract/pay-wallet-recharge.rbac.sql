-- ============================================================
-- Auto-generated RBAC & Menu Migration for 会员钱包充值 (PayWalletRecharge)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-pay-wallet-recharge',
  'pay-dir',
  '会员钱包充值管理',
  '/admin/pay/pay-wallet-recharge',
  'pay/pay-wallet-recharge/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_wallet_recharge:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-pay-wallet-recharge-query',  'menu-pay-wallet-recharge', '查询会员钱包充值', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_recharge:query',  1, NOW(), NOW()),
('menu-pay-wallet-recharge-create', 'menu-pay-wallet-recharge', '新增会员钱包充值', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_recharge:create', 2, NOW(), NOW()),
('menu-pay-wallet-recharge-update', 'menu-pay-wallet-recharge', '修改会员钱包充值', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_recharge:update', 3, NOW(), NOW()),
('menu-pay-wallet-recharge-delete', 'menu-pay-wallet-recharge', '删除会员钱包充值', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_recharge:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-pay-wallet-recharge'),
('1', 'menu-pay-wallet-recharge-query'),
('1', 'menu-pay-wallet-recharge-create'),
('1', 'menu-pay-wallet-recharge-update'),
('1', 'menu-pay-wallet-recharge-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-pay-wallet-recharge'),
('1', 'menu-pay-wallet-recharge-query'),
('1', 'menu-pay-wallet-recharge-create'),
('1', 'menu-pay-wallet-recharge-update'),
('1', 'menu-pay-wallet-recharge-delete')
ON CONFLICT DO NOTHING;
