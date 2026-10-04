-- ============================================================
-- Auto-generated RBAC & Menu Migration for 订单日志 (TradeOrderLog)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-trade-order-log',
  'mall-dir',
  '订单日志管理',
  '/admin/mall/trade-order-log',
  'mall/trade-order-log/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:trade_order_log:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-trade-order-log-query',  'menu-trade-order-log', '查询订单日志', 'BUTTON', 'ACTIVE', 'mall:trade_order_log:query',  1, NOW(), NOW()),
('menu-trade-order-log-create', 'menu-trade-order-log', '新增订单日志', 'BUTTON', 'ACTIVE', 'mall:trade_order_log:create', 2, NOW(), NOW()),
('menu-trade-order-log-update', 'menu-trade-order-log', '修改订单日志', 'BUTTON', 'ACTIVE', 'mall:trade_order_log:update', 3, NOW(), NOW()),
('menu-trade-order-log-delete', 'menu-trade-order-log', '删除订单日志', 'BUTTON', 'ACTIVE', 'mall:trade_order_log:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-trade-order-log-rm',        '1', 'menu-trade-order-log'),
('menu-trade-order-log-rm-query',  '1', 'menu-trade-order-log-query'),
('menu-trade-order-log-rm-create', '1', 'menu-trade-order-log-create'),
('menu-trade-order-log-rm-update', '1', 'menu-trade-order-log-update'),
('menu-trade-order-log-rm-delete', '1', 'menu-trade-order-log-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-trade-order-log-pm',        '1', 'menu-trade-order-log'),
('menu-trade-order-log-pm-query',  '1', 'menu-trade-order-log-query'),
('menu-trade-order-log-pm-create', '1', 'menu-trade-order-log-create'),
('menu-trade-order-log-pm-update', '1', 'menu-trade-order-log-update'),
('menu-trade-order-log-pm-delete', '1', 'menu-trade-order-log-delete')
ON CONFLICT DO NOTHING;
