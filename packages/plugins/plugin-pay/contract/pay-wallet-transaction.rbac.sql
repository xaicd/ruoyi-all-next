-- ============================================================
-- Auto-generated RBAC & Menu Migration for 会员钱包流水 (PayWalletTransaction)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-pay-wallet-transaction',
  'pay-dir',
  '会员钱包流水管理',
  '/admin/pay/pay-wallet-transaction',
  'pay/pay-wallet-transaction/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_wallet_transaction:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-pay-wallet-transaction-query',  'menu-pay-wallet-transaction', '查询会员钱包流水', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_transaction:query',  1, NOW(), NOW()),
('menu-pay-wallet-transaction-create', 'menu-pay-wallet-transaction', '新增会员钱包流水', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_transaction:create', 2, NOW(), NOW()),
('menu-pay-wallet-transaction-update', 'menu-pay-wallet-transaction', '修改会员钱包流水', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_transaction:update', 3, NOW(), NOW()),
('menu-pay-wallet-transaction-delete', 'menu-pay-wallet-transaction', '删除会员钱包流水', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_transaction:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-pay-wallet-transaction-rm',        '1', 'menu-pay-wallet-transaction'),
('menu-pay-wallet-transaction-rm-query',  '1', 'menu-pay-wallet-transaction-query'),
('menu-pay-wallet-transaction-rm-create', '1', 'menu-pay-wallet-transaction-create'),
('menu-pay-wallet-transaction-rm-update', '1', 'menu-pay-wallet-transaction-update'),
('menu-pay-wallet-transaction-rm-delete', '1', 'menu-pay-wallet-transaction-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-pay-wallet-transaction-pm',        '1', 'menu-pay-wallet-transaction'),
('menu-pay-wallet-transaction-pm-query',  '1', 'menu-pay-wallet-transaction-query'),
('menu-pay-wallet-transaction-pm-create', '1', 'menu-pay-wallet-transaction-create'),
('menu-pay-wallet-transaction-pm-update', '1', 'menu-pay-wallet-transaction-update'),
('menu-pay-wallet-transaction-pm-delete', '1', 'menu-pay-wallet-transaction-delete')
ON CONFLICT DO NOTHING;
