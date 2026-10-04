-- ============================================================
-- Auto-generated RBAC & Menu Migration for 会员钱包 (PayWallet)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-pay-wallet',
  'pay-dir',
  '会员钱包管理',
  '/admin/pay/pay-wallet',
  'pay/pay-wallet/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_wallet:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-pay-wallet-query',  'menu-pay-wallet', '查询会员钱包', 'BUTTON', 'ACTIVE', 'pay:pay_wallet:query',  1, NOW(), NOW()),
('menu-pay-wallet-create', 'menu-pay-wallet', '新增会员钱包', 'BUTTON', 'ACTIVE', 'pay:pay_wallet:create', 2, NOW(), NOW()),
('menu-pay-wallet-update', 'menu-pay-wallet', '修改会员钱包', 'BUTTON', 'ACTIVE', 'pay:pay_wallet:update', 3, NOW(), NOW()),
('menu-pay-wallet-delete', 'menu-pay-wallet', '删除会员钱包', 'BUTTON', 'ACTIVE', 'pay:pay_wallet:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-pay-wallet-rm',        '1', 'menu-pay-wallet'),
('menu-pay-wallet-rm-query',  '1', 'menu-pay-wallet-query'),
('menu-pay-wallet-rm-create', '1', 'menu-pay-wallet-create'),
('menu-pay-wallet-rm-update', '1', 'menu-pay-wallet-update'),
('menu-pay-wallet-rm-delete', '1', 'menu-pay-wallet-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-pay-wallet-pm',        '1', 'menu-pay-wallet'),
('menu-pay-wallet-pm-query',  '1', 'menu-pay-wallet-query'),
('menu-pay-wallet-pm-create', '1', 'menu-pay-wallet-create'),
('menu-pay-wallet-pm-update', '1', 'menu-pay-wallet-update'),
('menu-pay-wallet-pm-delete', '1', 'menu-pay-wallet-delete')
ON CONFLICT DO NOTHING;
