-- ============================================================
-- Auto-generated RBAC & Menu Migration for TradeOrder（源框架导入） (TradeOrder)
-- ============================================================

-- 1. 插入菜单目录/页面节点 (system_menu)
INSERT INTO system_menu (id, parent_id, name, path, component, icon, sort, type, status, permission, create_time, update_time)
VALUES (
  'menu-trade-order',
  'mall-dir',
  'TradeOrder（源框架导入）管理',
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
INSERT INTO system_menu (id, parent_id, name, type, status, permission, sort, create_time, update_time) VALUES
('menu-trade-order-query',  'menu-trade-order', '查询TradeOrder（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:trade_order:query',  1, NOW(), NOW()),
('menu-trade-order-create', 'menu-trade-order', '新增TradeOrder（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:trade_order:create', 2, NOW(), NOW()),
('menu-trade-order-update', 'menu-trade-order', '修改TradeOrder（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:trade_order:update', 3, NOW(), NOW()),
('menu-trade-order-delete', 'menu-trade-order', '删除TradeOrder（源框架导入）', 'BUTTON', 'ACTIVE', 'mall:trade_order:delete', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. 关联管理员角色 (system_role_menu)
INSERT INTO system_role_menu (role_id, menu_id) VALUES
('1', 'menu-trade-order'),
('1', 'menu-trade-order-query'),
('1', 'menu-trade-order-create'),
('1', 'menu-trade-order-update'),
('1', 'menu-trade-order-delete')
ON CONFLICT DO NOTHING;

-- 4. 挂载系统租户套餐 (system_tenant_package_menu，实现租户开户默认立即可见)
INSERT INTO system_tenant_package_menu (package_id, menu_id) VALUES
('1', 'menu-trade-order'),
('1', 'menu-trade-order-query'),
('1', 'menu-trade-order-create'),
('1', 'menu-trade-order-update'),
('1', 'menu-trade-order-delete')
ON CONFLICT DO NOTHING;
