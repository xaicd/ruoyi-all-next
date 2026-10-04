-- ============================================================
-- Auto-generated RBAC & Menu Migration for 佣金提现 (BrokerageWithdraw)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-brokerage-withdraw',
  'mall-dir',
  '佣金提现管理',
  '/admin/mall/brokerage-withdraw',
  'mall/brokerage-withdraw/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:brokerage_withdraw:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-brokerage-withdraw-query',  'menu-brokerage-withdraw', '查询佣金提现', 'BUTTON', 'ACTIVE', 'mall:brokerage_withdraw:query',  1, NOW(), NOW()),
('menu-brokerage-withdraw-create', 'menu-brokerage-withdraw', '新增佣金提现', 'BUTTON', 'ACTIVE', 'mall:brokerage_withdraw:create', 2, NOW(), NOW()),
('menu-brokerage-withdraw-update', 'menu-brokerage-withdraw', '修改佣金提现', 'BUTTON', 'ACTIVE', 'mall:brokerage_withdraw:update', 3, NOW(), NOW()),
('menu-brokerage-withdraw-delete', 'menu-brokerage-withdraw', '删除佣金提现', 'BUTTON', 'ACTIVE', 'mall:brokerage_withdraw:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-brokerage-withdraw'),
('1', 'menu-brokerage-withdraw-query'),
('1', 'menu-brokerage-withdraw-create'),
('1', 'menu-brokerage-withdraw-update'),
('1', 'menu-brokerage-withdraw-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-brokerage-withdraw'),
('1', 'menu-brokerage-withdraw-query'),
('1', 'menu-brokerage-withdraw-create'),
('1', 'menu-brokerage-withdraw-update'),
('1', 'menu-brokerage-withdraw-delete')
ON CONFLICT DO NOTHING;
