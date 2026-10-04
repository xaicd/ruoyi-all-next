-- ============================================================
-- Auto-generated RBAC & Menu Migration for 交易订单 (TradeOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-trade-order',
  'mall-dir',
  '交易订单管理',
  '/admin/mall/trade-order',
  'mall/trade-order/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:trade_order:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-trade-order-query',  'menu-trade-order', '查询交易订单', 'BUTTON', 'ACTIVE', 'mall:trade_order:query',  1, NOW(), NOW()),
('menu-trade-order-create', 'menu-trade-order', '新增交易订单', 'BUTTON', 'ACTIVE', 'mall:trade_order:create', 2, NOW(), NOW()),
('menu-trade-order-update', 'menu-trade-order', '修改交易订单', 'BUTTON', 'ACTIVE', 'mall:trade_order:update', 3, NOW(), NOW()),
('menu-trade-order-delete', 'menu-trade-order', '删除交易订单', 'BUTTON', 'ACTIVE', 'mall:trade_order:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-trade-order-rm',        '1', 'menu-trade-order'),
('menu-trade-order-rm-query',  '1', 'menu-trade-order-query'),
('menu-trade-order-rm-create', '1', 'menu-trade-order-create'),
('menu-trade-order-rm-update', '1', 'menu-trade-order-update'),
('menu-trade-order-rm-delete', '1', 'menu-trade-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-trade-order-pm',        '1', 'menu-trade-order'),
('menu-trade-order-pm-query',  '1', 'menu-trade-order-query'),
('menu-trade-order-pm-create', '1', 'menu-trade-order-create'),
('menu-trade-order-pm-update', '1', 'menu-trade-order-update'),
('menu-trade-order-pm-delete', '1', 'menu-trade-order-delete')
ON CONFLICT DO NOTHING;
