-- ============================================================
-- Auto-generated RBAC & Menu Migration for 转账单 (PayTransfer)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-pay-transfer',
  'pay-dir',
  '转账单管理',
  '/admin/pay/pay-transfer',
  'pay/pay-transfer/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'pay:pay_transfer:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-pay-transfer-query',  'menu-pay-transfer', '查询转账单', 'BUTTON', 'ACTIVE', 'pay:pay_transfer:query',  1, NOW(), NOW()),
('menu-pay-transfer-create', 'menu-pay-transfer', '新增转账单', 'BUTTON', 'ACTIVE', 'pay:pay_transfer:create', 2, NOW(), NOW()),
('menu-pay-transfer-update', 'menu-pay-transfer', '修改转账单', 'BUTTON', 'ACTIVE', 'pay:pay_transfer:update', 3, NOW(), NOW()),
('menu-pay-transfer-delete', 'menu-pay-transfer', '删除转账单', 'BUTTON', 'ACTIVE', 'pay:pay_transfer:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-pay-transfer-rm',        '1', 'menu-pay-transfer'),
('menu-pay-transfer-rm-query',  '1', 'menu-pay-transfer-query'),
('menu-pay-transfer-rm-create', '1', 'menu-pay-transfer-create'),
('menu-pay-transfer-rm-update', '1', 'menu-pay-transfer-update'),
('menu-pay-transfer-rm-delete', '1', 'menu-pay-transfer-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-pay-transfer-pm',        '1', 'menu-pay-transfer'),
('menu-pay-transfer-pm-query',  '1', 'menu-pay-transfer-query'),
('menu-pay-transfer-pm-create', '1', 'menu-pay-transfer-create'),
('menu-pay-transfer-pm-update', '1', 'menu-pay-transfer-update'),
('menu-pay-transfer-pm-delete', '1', 'menu-pay-transfer-delete')
ON CONFLICT DO NOTHING;
