-- ============================================================
-- Auto-generated RBAC & Menu Migration for 交易订单项 (TradeOrderItem)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, created_at, updated_at)
VALUES (
  'menu-trade-order-item',
  'mall-dir',
  '交易订单项管理',
  '/admin/mall/trade-order-item',
  'mall/trade-order-item/index',
  'table',
  10,
  'MENU',
  'ACTIVE',
  'mall:trade_order_item:view',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. 插入 4 大动词按钮权限
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, created_at, updated_at) VALUES
('menu-trade-order-item-query',  'menu-trade-order-item', '查询交易订单项', 'BUTTON', 'ACTIVE', 'mall:trade_order_item:query',  1, NOW(), NOW()),
('menu-trade-order-item-create', 'menu-trade-order-item', '新增交易订单项', 'BUTTON', 'ACTIVE', 'mall:trade_order_item:create', 2, NOW(), NOW()),
('menu-trade-order-item-update', 'menu-trade-order-item', '修改交易订单项', 'BUTTON', 'ACTIVE', 'mall:trade_order_item:update', 3, NOW(), NOW()),
('menu-trade-order-item-delete', 'menu-trade-order-item', '删除交易订单项', 'BUTTON', 'ACTIVE', 'mall:trade_order_item:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (id, role_id, menu_id) VALUES
('menu-trade-order-item-rm',        '1', 'menu-trade-order-item'),
('menu-trade-order-item-rm-query',  '1', 'menu-trade-order-item-query'),
('menu-trade-order-item-rm-create', '1', 'menu-trade-order-item-create'),
('menu-trade-order-item-rm-update', '1', 'menu-trade-order-item-update'),
('menu-trade-order-item-rm-delete', '1', 'menu-trade-order-item-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (id, package_id, menu_id) VALUES
('menu-trade-order-item-pm',        '1', 'menu-trade-order-item'),
('menu-trade-order-item-pm-query',  '1', 'menu-trade-order-item-query'),
('menu-trade-order-item-pm-create', '1', 'menu-trade-order-item-create'),
('menu-trade-order-item-pm-update', '1', 'menu-trade-order-item-update'),
('menu-trade-order-item-pm-delete', '1', 'menu-trade-order-item-delete')
ON CONFLICT DO NOTHING;
