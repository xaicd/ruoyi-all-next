-- ============================================================
-- Auto-generated RBAC & Menu Migration for PayWalletRechargePackage（源框架导入） (PayWalletRechargePackage)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-pay-wallet-recharge-package',
  'pay-dir',
  'PayWalletRechargePackage（源框架导入）管理',
  '/admin/pay/pay-wallet-recharge-package',
  'pay/pay-wallet-recharge-package/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_wallet_recharge_package:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-pay-wallet-recharge-package-query',  'menu-pay-wallet-recharge-package', '查询PayWalletRechargePackage（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_recharge_package:query',  1, NOW(), NOW()),
('menu-pay-wallet-recharge-package-create', 'menu-pay-wallet-recharge-package', '新增PayWalletRechargePackage（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_recharge_package:create', 2, NOW(), NOW()),
('menu-pay-wallet-recharge-package-update', 'menu-pay-wallet-recharge-package', '修改PayWalletRechargePackage（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_recharge_package:update', 3, NOW(), NOW()),
('menu-pay-wallet-recharge-package-delete', 'menu-pay-wallet-recharge-package', '删除PayWalletRechargePackage（源框架导入）', 'BUTTON', 'ACTIVE', 'pay:pay_wallet_recharge_package:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-pay-wallet-recharge-package'),
('1', 'menu-pay-wallet-recharge-package-query'),
('1', 'menu-pay-wallet-recharge-package-create'),
('1', 'menu-pay-wallet-recharge-package-update'),
('1', 'menu-pay-wallet-recharge-package-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-pay-wallet-recharge-package'),
('1', 'menu-pay-wallet-recharge-package-query'),
('1', 'menu-pay-wallet-recharge-package-create'),
('1', 'menu-pay-wallet-recharge-package-update'),
('1', 'menu-pay-wallet-recharge-package-delete')
ON CONFLICT DO NOTHING;
